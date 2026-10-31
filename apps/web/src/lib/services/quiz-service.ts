import { supabase } from '@/lib/supabase/client';
import { GeminiService } from '@/lib/services/gemini-service';
import { NotificationService } from '@/lib/services/notification-service';

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'FILL_BLANK'
  | 'WRITTEN_QA';

export type GradingMode = 'AUTO_AI' | 'MANUAL_TEACHER' | 'HYBRID_AI_TEACHER';

export interface QuizQuestionInput {
  id?: string;
  questionType: QuestionType;
  prompt: string;
  options?: any; // e.g. { A: '...', B: '...', C: '...', D: '...' }
  correctAnswer: any; // e.g. 'A', ['A', 'C'], 'True', '1800'
  points: number;
  sortOrder: number;
  explanation?: string;
  rubricNotes?: string;
}

export interface QuizDetails {
  id: string;
  courseId: string;
  lessonId?: string | null;
  title: string;
  description?: string | null;
  timeLimitMinutes: number;
  attemptsAllowed: number;
  passingPercentage: number;
  randomizeQuestions: boolean;
  hasExpiry: boolean;
  expiresAt?: string | null;
  writtenGradingMode: GradingMode;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  courseTitle?: string;
  questions?: QuizQuestionInput[];
  submissionsCount?: number;
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: string;
  submittedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  gradingStatus: 'COMPLETED' | 'PENDING_GRADING';
  answers: Array<{
    questionId: string;
    questionPrompt: string;
    questionType: QuestionType;
    studentResponse: any;
    correctAnswer: any;
    pointsAwarded: number;
    maxPoints: number;
    isCorrect?: boolean;
    aiFeedback?: string | null;
    teacherFeedback?: string | null;
    isGraded: boolean;
  }>;
}

export class QuizService {
  /**
   * 1. Get Quizzes for Teacher Management Portal
   */
  static async getTeacherQuizzes(teacherId: string): Promise<QuizDetails[]> {
    try {
      // 1. Fetch teacher's courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('teacher_id', teacherId);

      const courseIds = (courses || []).map((c: any) => c.id);
      if (courseIds.length === 0) {
        // Fallback: all quizzes in system for admin / demo teacher
        const { data: allQ } = await supabase
          .from('quizzes')
          .select('*, courses:course_id(title)')
          .order('created_at', { ascending: false });

        return (allQ || []).map(this.mapQuizRow);
      }

      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*, courses:course_id(title)')
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (quizzes || []).map(this.mapQuizRow);
    } catch (err) {
      console.error('Failed to get teacher quizzes:', err);
      return [];
    }
  }

  /**
   * 2. Get Quizzes for Student Course Portal
   */
  static async getCourseQuizzes(courseId: string, studentId?: string): Promise<any[]> {
    try {
      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          course_id,
          title,
          description,
          time_limit_minutes,
          attempts_allowed,
          passing_percentage,
          has_expiry,
          expires_at,
          written_grading_mode,
          is_published,
          published_at,
          created_at
        `)
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check student attempts if studentId provided
      let attemptsByQuiz: Record<string, any> = {};
      if (studentId) {
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('student_id', studentId);

        (attempts || []).forEach((att: any) => {
          attemptsByQuiz[att.quiz_id] = att;
        });
      }

      return (quizzes || []).map((q: any) => ({
        ...this.mapQuizRow(q),
        studentAttempt: attemptsByQuiz[q.id] || null,
      }));
    } catch (err) {
      console.error('Failed to get course quizzes:', err);
      return [];
    }
  }

  /**
   * 2b. Get All Published Quizzes for Student Portal
   */
  static async getAllPublishedQuizzes(studentId?: string): Promise<any[]> {
    try {
      const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          course_id,
          title,
          description,
          time_limit_minutes,
          attempts_allowed,
          passing_percentage,
          has_expiry,
          expires_at,
          written_grading_mode,
          is_published,
          published_at,
          created_at,
          courses:course_id(title)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let attemptsByQuiz: Record<string, any> = {};
      if (studentId) {
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('student_id', studentId);

        (attempts || []).forEach((att: any) => {
          attemptsByQuiz[att.quiz_id] = att;
        });
      }

      return (quizzes || []).map((q: any) => ({
        ...this.mapQuizRow(q),
        studentAttempt: attemptsByQuiz[q.id] || null,
      }));
    } catch (err) {
      console.error('Failed to get published quizzes:', err);
      return [];
    }
  }

  /**
   * 3. Get Full Quiz Details with Questions
   */
  static async getQuizDetails(quizId: string): Promise<QuizDetails | null> {
    try {
      const { data: quiz, error: qErr } = await supabase
        .from('quizzes')
        .select('*, courses:course_id(title)')
        .eq('id', quizId)
        .single();

      if (qErr || !quiz) return null;

      const { data: questions, error: questErr } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('sort_order', { ascending: true });

      if (questErr) throw questErr;

      const mapped = this.mapQuizRow(quiz);
      mapped.questions = (questions || []).map((q: any) => ({
        id: q.id,
        questionType: q.question_type,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correct_answer,
        points: Number(q.points) || 1,
        sortOrder: q.sort_order,
      }));

      return mapped;
    } catch (err) {
      console.error('Failed to get quiz details:', err);
      return null;
    }
  }

  /**
   * 4. Create New Quiz with Questions
   */
  static async createQuiz(input: {
    courseId: string;
    lessonId?: string;
    title: string;
    description?: string;
    timeLimitMinutes: number;
    passingPercentage: number;
    hasExpiry: boolean;
    expiresAt?: string | null;
    writtenGradingMode: GradingMode;
    isPublished: boolean;
    questions: QuizQuestionInput[];
    teacherId: string;
  }): Promise<{ success: boolean; quizId?: string; error?: string }> {
    try {
      // 1. Insert Quiz Record
      const { data: insertedQuiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          course_id: input.courseId,
          lesson_id: input.lessonId || null,
          title: input.title.trim(),
          description: input.description?.trim() || null,
          time_limit_minutes: input.timeLimitMinutes,
          passing_percentage: input.passingPercentage,
          has_expiry: input.hasExpiry,
          expires_at: input.hasExpiry && input.expiresAt ? input.expiresAt : null,
          written_grading_mode: input.writtenGradingMode,
          is_published: input.isPublished,
          published_at: input.isPublished ? new Date().toISOString() : null,
        })
        .select('id')
        .single();

      if (quizError) throw quizError;
      const quizId = insertedQuiz.id;

      // 2. Insert Questions
      if (input.questions && input.questions.length > 0) {
        const questionRows = input.questions.map((q, idx) => ({
          quiz_id: quizId,
          question_type: q.questionType,
          prompt: q.prompt.trim(),
          options: q.options || {},
          correct_answer: q.correctAnswer,
          points: q.points || 1,
          sort_order: idx + 1,
        }));

        const { error: questError } = await supabase
          .from('quiz_questions')
          .insert(questionRows);

        if (questError) throw questError;
      }

      // 3. If published immediately, dispatch notifications to all enrolled students!
      if (input.isPublished) {
        await NotificationService.notifyEnrolledStudents({
          courseId: input.courseId,
          senderId: input.teacherId,
          title: `New Timed Assessment: ${input.title}`,
          message: `Your instructor has published a new test (${input.timeLimitMinutes} mins). Log in to test your concepts.`,
          type: 'QUIZ',
          linkUrl: `/student/quizzes/${quizId}`,
        });
      }

      return { success: true, quizId };
    } catch (err: any) {
      console.error('Failed to create quiz:', err);
      return { success: false, error: err?.message || 'Could not save quiz' };
    }
  }

  /**
   * 5. Publish an Existing Draft Quiz & Dispatch Notifications
   */
  static async publishQuiz(quizId: string, teacherId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: updated, error } = await supabase
        .from('quizzes')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', quizId)
        .select('id, title, course_id, time_limit_minutes')
        .single();

      if (error) throw error;

      // Dispatch notifications
      await NotificationService.notifyEnrolledStudents({
        courseId: updated.course_id,
        senderId: teacherId,
        title: `New Timed Assessment: ${updated.title}`,
        message: `Your instructor has published a new test (${updated.time_limit_minutes} mins). Log in to take the quiz.`,
        type: 'QUIZ',
        linkUrl: `/student/quizzes/${quizId}`,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Publish failed' };
    }
  }

  /**
   * 6. Submit Student Quiz Attempt with Hybrid AI Evaluation
   */
  static async submitQuizAttempt(input: {
    quizId: string;
    studentId: string;
    answers: Record<string, any>; // { [questionId]: studentAnswer }
    startedAt: string;
  }): Promise<{ success: boolean; result?: QuizAttemptResult; error?: string }> {
    try {
      const quiz = await this.getQuizDetails(input.quizId);
      if (!quiz || !quiz.questions) throw new Error('Quiz not found');

      let totalAwarded = 0;
      let maxScore = 0;
      let hasWrittenNeedingReview = false;

      const gradedAnswers: any[] = [];

      // Evaluate each question
      for (const q of quiz.questions) {
        const qId = q.id!;
        const studentResp = input.answers[qId];
        const pts = Number(q.points) || 1;
        maxScore += pts;

        let awarded = 0;
        let isCorrect = false;
        let aiFeedback: string | null = null;
        let isGraded = true;

        if (q.questionType === 'SINGLE_CHOICE' || q.questionType === 'TRUE_FALSE') {
          isCorrect = String(studentResp).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
          awarded = isCorrect ? pts : 0;
        } else if (q.questionType === 'MULTIPLE_CHOICE') {
          // Compare arrays
          const expected = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
          const actual = Array.isArray(studentResp) ? studentResp : [studentResp];
          const sortedExp = [...expected].sort().join(',');
          const sortedAct = [...actual].sort().join(',');
          isCorrect = sortedExp === sortedAct;
          awarded = isCorrect ? pts : 0;
        } else if (q.questionType === 'FILL_BLANK') {
          const acceptable = Array.isArray(q.correctAnswer) ? q.correctAnswer : [String(q.correctAnswer)];
          const lowerActual = String(studentResp || '').trim().toLowerCase();
          isCorrect = acceptable.some((ans: string) => String(ans).trim().toLowerCase() === lowerActual);
          awarded = isCorrect ? pts : 0;
        } else if (q.questionType === 'WRITTEN_QA') {
          // Descriptive answer: Use Gemini AI evaluation
          if (studentResp && String(studentResp).trim().length > 0) {
            const aiEval = await GeminiService.gradeWrittenAnswer({
              questionPrompt: q.prompt,
              rubricOrExpectedAnswer: String(q.correctAnswer || ''),
              studentAnswer: String(studentResp),
              maxPoints: pts,
            });
            awarded = aiEval.awardedPoints;
            aiFeedback = aiEval.feedback;
          } else {
            awarded = 0;
            aiFeedback = 'No written response provided.';
          }

          if (quiz.writtenGradingMode === 'AUTO_AI') {
            isGraded = true;
          } else {
            // HYBRID_AI_TEACHER or MANUAL_TEACHER: Tentatively awarded by AI, but queued for teacher
            hasWrittenNeedingReview = true;
            isGraded = false;
          }
        }

        totalAwarded += awarded;

        gradedAnswers.push({
          questionId: qId,
          questionPrompt: q.prompt,
          questionType: q.questionType,
          studentResponse: studentResp ?? null,
          correctAnswer: q.correctAnswer,
          pointsAwarded: awarded,
          maxPoints: pts,
          isCorrect,
          aiFeedback,
          teacherFeedback: null,
          isGraded,
        });
      }

      const percentage = maxScore > 0 ? Math.round((totalAwarded / maxScore) * 1000) / 10 : 0;
      const isPassed = percentage >= quiz.passingPercentage;
      const gradingStatus = hasWrittenNeedingReview ? 'PENDING_GRADING' : 'COMPLETED';

      // 1. Insert into public.quiz_attempts
      const { data: attemptRow, error: attErr } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: input.quizId,
          student_id: input.studentId,
          started_at: input.startedAt,
          submitted_at: new Date().toISOString(),
          total_score: totalAwarded,
          max_score: maxScore,
          percentage,
          is_passed: isPassed,
          grading_status: gradingStatus,
        })
        .select('id')
        .single();

      if (attErr) throw attErr;
      const attemptId = attemptRow.id;

      // 2. Insert into public.quiz_attempt_answers
      const answerRows = gradedAnswers.map((ga) => ({
        attempt_id: attemptId,
        question_id: ga.questionId,
        student_response: ga.studentResponse,
        points_awarded: ga.pointsAwarded,
        ai_feedback: ga.aiFeedback,
        teacher_feedback: null,
        is_graded: ga.isGraded,
      }));

      const { error: ansErr } = await supabase
        .from('quiz_attempt_answers')
        .insert(answerRows);

      if (ansErr) throw ansErr;

      return {
        success: true,
        result: {
          id: attemptId,
          quizId: input.quizId,
          studentId: input.studentId,
          startedAt: input.startedAt,
          submittedAt: new Date().toISOString(),
          totalScore: totalAwarded,
          maxScore,
          percentage,
          isPassed,
          gradingStatus,
          answers: gradedAnswers,
        },
      };
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      return { success: false, error: err?.message || 'Submission failed' };
    }
  }

  /**
   * 7. Get Teacher Written Q/A Grading Queue
   */
  static async getTeacherGradingQueue(teacherId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          id,
          quiz_id,
          student_id,
          started_at,
          submitted_at,
          total_score,
          max_score,
          percentage,
          grading_status,
          profiles:student_id (full_name, email),
          quizzes:quiz_id (title, course_id, courses:course_id (title, teacher_id)),
          quiz_attempt_answers (
            id,
            question_id,
            student_response,
            points_awarded,
            ai_feedback,
            teacher_feedback,
            is_graded,
            quiz_questions:question_id (
              prompt,
              question_type,
              correct_answer,
              points
            )
          )
        `)
        .eq('grading_status', 'PENDING_GRADING')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.id,
        quizId: row.quiz_id,
        quizTitle: row.quizzes?.title || 'Course Quiz',
        courseTitle: row.quizzes?.courses?.title || 'Academic Course',
        studentName: row.profiles?.full_name || 'Academic Student',
        studentEmail: row.profiles?.email || '',
        submittedAt: new Date(row.submitted_at).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        totalScore: Number(row.total_score),
        maxScore: Number(row.max_score),
        percentage: Number(row.percentage),
        writtenAnswers: (row.quiz_attempt_answers || [])
          .filter((a: any) => a.quiz_questions?.question_type === 'WRITTEN_QA')
          .map((a: any) => ({
            id: a.id,
            questionId: a.question_id,
            prompt: a.quiz_questions?.prompt || '',
            expectedAnswer: a.quiz_questions?.correct_answer || '',
            maxPoints: Number(a.quiz_questions?.points) || 5,
            studentResponse: a.student_response,
            pointsAwarded: Number(a.points_awarded),
            aiFeedback: a.ai_feedback,
            teacherFeedback: a.teacher_feedback || '',
          })),
      }));
    } catch (err) {
      console.error('Failed to get grading queue:', err);
      return [];
    }
  }

  /**
   * 8. Finalize Teacher Grading for an Attempt
   */
  static async finalizeTeacherGrading(input: {
    attemptId: string;
    teacherId: string;
    studentId: string;
    quizTitle: string;
    gradedAnswers: Array<{
      answerId: string;
      points: number;
      feedback: string;
    }>;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Update each answer
      for (const item of input.gradedAnswers) {
        await supabase
          .from('quiz_attempt_answers')
          .update({
            points_awarded: item.points,
            teacher_feedback: item.feedback,
            graded_by_teacher_id: input.teacherId,
            is_graded: true,
          })
          .eq('id', item.answerId);
      }

      // 2. Recalculate total score
      const { data: allAnswers } = await supabase
        .from('quiz_attempt_answers')
        .select('points_awarded')
        .eq('attempt_id', input.attemptId);

      const totalScore = (allAnswers || []).reduce(
        (sum: number, a: any) => sum + (Number(a.points_awarded) || 0),
        0
      );

      const { data: att } = await supabase
        .from('quiz_attempts')
        .select('max_score, quiz_id, quizzes:quiz_id(passing_percentage)')
        .eq('id', input.attemptId)
        .single();

      const maxScore = Number(att?.max_score) || 10;
      const passingPct = Number((att?.quizzes as any)?.passing_percentage) || 50;
      const percentage = Math.round((totalScore / maxScore) * 1000) / 10;
      const isPassed = percentage >= passingPct;

      await supabase
        .from('quiz_attempts')
        .update({
          total_score: totalScore,
          percentage,
          is_passed: isPassed,
          grading_status: 'COMPLETED',
        })
        .eq('id', input.attemptId);

      // 3. Notify student
      await NotificationService.sendNotification({
        recipientId: input.studentId,
        senderId: input.teacherId,
        title: `Written Quiz Graded: ${input.quizTitle}`,
        message: `Your instructor has finalized your written assessment score: ${totalScore}/${maxScore} (${percentage}% - ${isPassed ? 'Passed' : 'Needs Improvement'}).`,
        type: 'QUIZ',
        linkUrl: `/student/quizzes/${att?.quiz_id}`,
      });

      return { success: true };
    } catch (err: any) {
      console.error('Finalize grading failed:', err);
      return { success: false, error: err?.message };
    }
  }

  private static mapQuizRow(row: any): QuizDetails {
    return {
      id: row.id,
      courseId: row.course_id,
      lessonId: row.lesson_id,
      title: row.title,
      description: row.description,
      timeLimitMinutes: row.time_limit_minutes,
      attemptsAllowed: row.attempts_allowed,
      passingPercentage: Number(row.passing_percentage),
      randomizeQuestions: row.randomize_questions,
      hasExpiry: row.has_expiry,
      expiresAt: row.expires_at,
      writtenGradingMode: row.written_grading_mode,
      isPublished: row.is_published,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      courseTitle: row.courses?.title || 'Academic Masterclass',
    };
  }
}
