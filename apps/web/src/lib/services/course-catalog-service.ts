import { createClient } from '@/lib/supabase/client';
import { MOCK_COURSES, type CourseData } from '@/lib/data/courses-data';

const PUBLIC_CATALOG_STORAGE_KEY = 'professor_academy_public_published_courses';

export class CourseCatalogService {
  /**
   * 1. Get all published courses for the public catalog (/courses)
   */
  static async getAllPublishedCourses(): Promise<CourseData[]> {
    const supabase = createClient();
    const localCourses = this.getLocalPublishedCourses();

    try {
      const { data: dbCourses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          short_description,
          full_description,
          eligibility_criteria,
          category,
          thumbnail_url,
          price_pkr,
          status,
          created_at,
          course_sections (
            id,
            title,
            sort_order,
            lessons (
              id,
              title,
              lesson_type,
              video_url,
              video_duration_seconds,
              is_free_preview,
              content_html
            )
          )
        `)
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });

      if (error || !dbCourses || dbCourses.length === 0) {
        return this.mergeWithMock(localCourses);
      }

      // Format Supabase courses into CourseData interface
      const formattedDbCourses: CourseData[] = dbCourses.map((c: any) => {
        const sections = (c.course_sections || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          lessons: (s.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            durationMinutes: Math.round((l.video_duration_seconds || 1200) / 60),
            isFreePreview: l.is_free_preview || false,
            videoUrl: l.video_url || '',
          })),
        }));

        const totalLessons = sections.reduce(
          (acc: number, s: any) => acc + (s.lessons?.length || 0),
          0
        );

        return {
          id: c.id,
          slug: c.slug,
          title: c.title,
          subtitle: c.short_description,
          category: c.category || 'MDCAT Prep',
          examBoard: 'UHS / PMDC / National Boards',
          level: 'Entry Test',
          instructor: {
            name: 'Prof. Dr. Arshad Mahmood',
            designation: 'Ex-Chairman Physics, Senior Faculty',
            avatarUrl:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            bio: 'Senior academic director and lead curriculum supervisor at Professor Online Academy.',
            rating: 4.9,
            studentsCount: 14200,
            coursesCount: 4,
          },
          thumbnailUrl:
            c.thumbnail_url ||
            'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          ratingCount: 340,
          pricePkr: Number(c.price_pkr),
          originalPricePkr: Math.round(Number(c.price_pkr) * 1.3),
          badgeText: 'NEWLY PUBLISHED',
          badgeVariant: 'indigo',
          durationHours: Math.max(12, Math.round(totalLessons * 0.75)),
          lessonsCount: totalLessons || 12,
          lastUpdated: 'Recently updated',
          language: 'Urdu & English',
          eligibilitySnippet: c.eligibility_criteria,
          eligibilityRequirements: {
            minQualification: 'FSc Pre-Medical / Pre-Engineering or Equivalent',
            recommendedBackground: 'Basic concept foundation in relevant subjects',
            targetStudents: [
              'Students preparing for upcoming academic board exams',
              'Entry test aspirants aiming for high-scoring rank',
            ],
            prerequisites: ['Standard scientific calculator and textbook reference'],
          },
          whatYouWillLearn: [
            'Complete high-yield chapter derivations and shortcuts',
            'Numerical problem solving strategies without calculator',
            'Past paper questions analysis (2018–2024)',
          ],
          sections,
          faqs: [
            {
              question: 'How do I access video lectures after enrolling?',
              answer:
                'Once your fee slip is verified by Admin, all lectures unlock automatically in your Student Dashboard.',
            },
          ],
        };
      });

      return this.mergeWithMock([...formattedDbCourses, ...localCourses]);
    } catch {
      return this.mergeWithMock(localCourses);
    }
  }

  /**
   * 2. Get Single Course by Slug
   */
  static async getCourseBySlug(slug: string): Promise<CourseData | null> {
    const all = await this.getAllPublishedCourses();
    const found = all.find((c) => c.slug === slug);
    return found || null;
  }

  /**
   * 3. Register newly published course locally (Immediate display)
   */
  static registerPublishedCourse(course: CourseData) {
    if (typeof window === 'undefined') return;
    const existing = this.getLocalPublishedCourses();
    const filtered = existing.filter((c) => c.slug !== course.slug && c.id !== course.id);
    localStorage.setItem(
      PUBLIC_CATALOG_STORAGE_KEY,
      JSON.stringify([course, ...filtered])
    );
  }

  private static getLocalPublishedCourses(): CourseData[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(PUBLIC_CATALOG_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return [];
  }

  private static mergeWithMock(custom: CourseData[]): CourseData[] {
    const seenSlugs = new Set<string>();
    const merged: CourseData[] = [];

    // Add custom first
    for (const c of custom) {
      if (!seenSlugs.has(c.slug)) {
        seenSlugs.add(c.slug);
        merged.push(c);
      }
    }

    // Add mock courses if not duplicated
    for (const m of MOCK_COURSES) {
      if (!seenSlugs.has(m.slug)) {
        seenSlugs.add(m.slug);
        merged.push(m);
      }
    }

    return merged;
  }
}
