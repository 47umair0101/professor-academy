import { supabase } from '@/lib/supabase/client';
import { MOCK_COURSES } from '@/lib/data/courses-data';

export interface LessonProgressItem {
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface CourseLesson {
  id: string;
  sectionId: string;
  courseId: string;
  title: string;
  lessonType: 'VIDEO' | 'TEXT' | 'MIXED';
  contentHtml?: string | null;
  videoUrl?: string | null;
  videoDurationSeconds: number;
  isFreePreview: boolean;
  sortOrder: number;
  isCompleted?: boolean;
}

export interface CourseSectionWithLessons {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  lessons: CourseLesson[];
}

export interface LessonComment {
  id: string;
  lessonId: string;
  userId: string;
  parentCommentId?: string | null;
  body: string;
  isPinnedAnswer: boolean;
  createdAt: string;
  author: {
    name: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    avatarUrl?: string | null;
  };
  replies?: LessonComment[];
}

export class LessonService {
  /**
   * 1. Get Course Curriculum with Student Completion Status
   */
  static async getCourseCurriculum(
    courseIdOrSlug: string,
    studentId?: string
  ): Promise<{
    course: any;
    sections: CourseSectionWithLessons[];
    totalLessons: number;
    completedLessonsCount: number;
    progressPercentage: number;
  }> {
    // 1. Identify course UUID and info
    let targetCourseId = courseIdOrSlug;
    let courseInfo: any = null;

    // Check if courseIdOrSlug is a slug
    const { data: dbCourse } = await supabase
      .from('courses')
      .select('*')
      .or(`id.eq.${courseIdOrSlug},slug.eq.${courseIdOrSlug}`)
      .maybeSingle();

    if (dbCourse) {
      targetCourseId = dbCourse.id;
      courseInfo = dbCourse;
    } else {
      // Find from mock
      const mock = MOCK_COURSES.find(c => c.id === courseIdOrSlug || c.slug === courseIdOrSlug);
      if (mock) {
        targetCourseId = mock.id;
        courseInfo = mock;
      }
    }

    // 2. Fetch sections and lessons from Supabase
    const { data: dbSections, error: secError } = await supabase
      .from('course_sections')
      .select(`
        id,
        course_id,
        title,
        sort_order,
        lessons (
          id,
          section_id,
          course_id,
          title,
          lesson_type,
          content_html,
          video_url,
          video_duration_seconds,
          is_free_preview,
          sort_order
        )
      `)
      .eq('course_id', targetCourseId)
      .order('sort_order', { ascending: true });

    // 3. Fetch student's progress if studentId is provided
    let completedLessonIds = new Set<string>();
    if (studentId) {
      const { data: progressRows } = await supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed')
        .eq('student_id', studentId)
        .eq('course_id', targetCourseId)
        .eq('is_completed', true);

      if (progressRows) {
        progressRows.forEach(r => completedLessonIds.add(r.lesson_id));
      }
    }

    let structuredSections: CourseSectionWithLessons[] = [];

    if (dbSections && dbSections.length > 0) {
      structuredSections = dbSections.map((sec: any) => ({
        id: sec.id,
        courseId: sec.course_id,
        title: sec.title,
        sortOrder: sec.sort_order,
        lessons: (sec.lessons || [])
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((l: any) => ({
            id: l.id,
            sectionId: l.section_id,
            courseId: l.course_id,
            title: l.title,
            lessonType: l.lesson_type,
            contentHtml: l.content_html,
            videoUrl: l.video_url,
            videoDurationSeconds: l.video_duration_seconds || 0,
            isFreePreview: l.is_free_preview,
            sortOrder: l.sort_order,
            isCompleted: completedLessonIds.has(l.id),
          })),
      }));
    } else {
      // Fallback to local mock curriculum if DB sections haven't been seeded for this course
      const mock = MOCK_COURSES.find(c => c.id === targetCourseId || c.slug === courseIdOrSlug) || MOCK_COURSES[0];
      courseInfo = courseInfo || mock;
      structuredSections = (mock.sections || []).map((sec, secIdx) => ({
        id: sec.id || `mock-sec-${secIdx}`,
        courseId: targetCourseId,
        title: sec.title,
        sortOrder: secIdx + 1,
        lessons: sec.lessons.map((l, lIdx) => ({
          id: l.id || `mock-les-${secIdx}-${lIdx}`,
          sectionId: sec.id || `mock-sec-${secIdx}`,
          courseId: targetCourseId,
          title: l.title,
          lessonType: l.videoUrl ? 'VIDEO' : 'TEXT',
          contentHtml: `
            <h3>${l.title}</h3>
            <p>High-yield lecture covering core concepts and numerical problems aligned strictly with the 2026 syllabus guidelines.</p>
            <blockquote><strong>Exam Tip:</strong> Pay special attention to the conceptual examples and past paper tricks demonstrated in this lesson.</blockquote>
          `,
          videoUrl: l.videoUrl || null,
          videoDurationSeconds: (l.durationMinutes || 30) * 60,
          isFreePreview: l.isFreePreview,
          sortOrder: lIdx + 1,
          isCompleted: completedLessonIds.has(l.id),
        })),
      }));
    }

    const allLessons = structuredSections.flatMap(s => s.lessons);
    const totalLessons = allLessons.length;
    const completedCount = allLessons.filter(l => l.isCompleted).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      course: courseInfo,
      sections: structuredSections,
      totalLessons,
      completedLessonsCount: completedCount,
      progressPercentage,
    };
  }

  /**
   * 2. Mark Lesson as Complete / Incomplete in Database
   */
  static async toggleLessonProgress(
    studentId: string,
    courseId: string,
    lessonId: string,
    isCompleted: boolean
  ): Promise<{ success: boolean; progressPercentage: number; allCompleted: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            student_id: studentId,
            course_id: courseId,
            lesson_id: lessonId,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          },
          { onConflict: 'student_id,lesson_id' }
        );

      if (error) throw error;

      // Calculate new completion rate
      const curriculum = await this.getCourseCurriculum(courseId, studentId);
      return {
        success: true,
        progressPercentage: curriculum.progressPercentage,
        allCompleted: curriculum.progressPercentage === 100,
      };
    } catch (err: any) {
      console.error('Failed to toggle lesson progress:', err);
      return {
        success: false,
        progressPercentage: 0,
        allCompleted: false,
        error: err?.message || 'Database error',
      };
    }
  }

  /**
   * 3. Get Threaded Comments for a Specific Lesson
   */
  static async getLessonComments(lessonId: string): Promise<LessonComment[]> {
    try {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select(`
          id,
          lesson_id,
          user_id,
          parent_comment_id,
          body,
          is_pinned_answer,
          created_at,
          profiles (
            full_name,
            role,
            avatar_url
          )
        `)
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Map profiles
      const list: LessonComment[] = (data || []).map((row: any) => ({
        id: row.id,
        lessonId: row.lesson_id,
        userId: row.user_id,
        parentCommentId: row.parent_comment_id,
        body: row.body,
        isPinnedAnswer: row.is_pinned_answer,
        createdAt: new Date(row.created_at).toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        author: {
          name: row.profiles?.full_name || 'Academic Student',
          role: row.profiles?.role || 'STUDENT',
          avatarUrl: row.profiles?.avatar_url || null,
        },
      }));

      // Structure into parent comments with nested replies
      const topLevel: LessonComment[] = [];
      const repliesMap = new Map<string, LessonComment[]>();

      list.forEach(c => {
        if (c.parentCommentId) {
          const arr = repliesMap.get(c.parentCommentId) || [];
          arr.push(c);
          repliesMap.set(c.parentCommentId, arr);
        } else {
          topLevel.push(c);
        }
      });

      topLevel.forEach(c => {
        c.replies = repliesMap.get(c.id) || [];
      });

      return topLevel;
    } catch (err) {
      console.error('Failed to load lesson comments:', err);
      return [];
    }
  }

  /**
   * 4. Post a New Comment or Teacher Reply
   */
  static async postComment(input: {
    lessonId: string;
    userId: string;
    body: string;
    parentCommentId?: string;
  }): Promise<{ success: boolean; comment?: LessonComment; error?: string }> {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', input.userId)
        .maybeSingle();

      const isTeacherOrAdmin = userProfile?.role === 'TEACHER' || userProfile?.role === 'ADMIN';

      const { data, error } = await supabase
        .from('lesson_comments')
        .insert({
          lesson_id: input.lessonId,
          user_id: input.userId,
          body: input.body.trim(),
          parent_comment_id: input.parentCommentId || null,
          is_pinned_answer: isTeacherOrAdmin && Boolean(input.parentCommentId),
        })
        .select('id, created_at')
        .single();

      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      console.error('Failed to post comment:', err);
      return { success: false, error: err?.message || 'Could not post comment' };
    }
  }

  /**
   * 5. Delete a Comment (Admin / Teacher moderation)
   */
  static async deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lesson_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Delete failed' };
    }
  }
}
