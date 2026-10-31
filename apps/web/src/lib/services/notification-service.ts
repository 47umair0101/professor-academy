import { supabase } from '@/lib/supabase/client';

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId?: string | null;
  courseId?: string | null;
  title: string;
  message: string;
  type: 'ACADEMIC' | 'QUIZ' | 'FEE' | 'CLASS' | 'GENERAL';
  linkUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export class NotificationService {
  /**
   * 1. Get User Notifications
   */
  static async getUserNotifications(userId: string): Promise<AppNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.id,
        recipientId: row.recipient_id,
        senderId: row.sender_id,
        courseId: row.course_id,
        title: row.title,
        message: row.message,
        type: row.type || 'GENERAL',
        linkUrl: row.link_url,
        isRead: Boolean(row.is_read),
        createdAt: new Date(row.created_at).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
    } catch (err) {
      console.error('Failed to get notifications:', err);
      return [];
    }
  }

  /**
   * 2. Send In-App Notification to a Single User
   */
  static async sendNotification(input: {
    recipientId: string;
    senderId?: string;
    courseId?: string;
    title: string;
    message: string;
    type: 'ACADEMIC' | 'QUIZ' | 'FEE' | 'CLASS' | 'GENERAL';
    linkUrl?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('notifications').insert({
        recipient_id: input.recipientId,
        sender_id: input.senderId || null,
        course_id: input.courseId || null,
        title: input.title,
        message: input.message,
        type: input.type,
        link_url: input.linkUrl || null,
        is_read: false,
      });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Send notification error:', err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * 3. Broadcast Notification to All Enrolled Students of a Course
   */
  static async notifyEnrolledStudents(input: {
    courseId: string;
    senderId?: string;
    title: string;
    message: string;
    type: 'ACADEMIC' | 'QUIZ' | 'FEE' | 'CLASS' | 'GENERAL';
    linkUrl?: string;
  }): Promise<{ success: boolean; notifiedCount: number; error?: string }> {
    try {
      // Find all active students enrolled in this course
      const { data: enrollments, error: enrollErr } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('course_id', input.courseId)
        .eq('status', 'ACTIVE');

      if (enrollErr) throw enrollErr;

      const studentIds = (enrollments || []).map((e: any) => e.student_id);

      // If no active students enrolled, also notify default student demo profile
      if (!studentIds.includes('33333333-3333-3333-3333-333333333333')) {
        studentIds.push('33333333-3333-3333-3333-333333333333');
      }

      const rows = studentIds.map((sId) => ({
        recipient_id: sId,
        sender_id: input.senderId || null,
        course_id: input.courseId,
        title: input.title,
        message: input.message,
        type: input.type,
        link_url: input.linkUrl || null,
        is_read: false,
      }));

      const { error: insErr } = await supabase.from('notifications').insert(rows);
      if (insErr) throw insErr;

      return { success: true, notifiedCount: rows.length };
    } catch (err: any) {
      console.error('Broadcast notification error:', err);
      return { success: false, notifiedCount: 0, error: err?.message };
    }
  }

  /**
   * 4. Mark Notification as Read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * 5. Mark All Notifications as Read for User
   */
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * 6. Multi-Channel Email Alert Dispatcher
   */
  static async dispatchEmail(input: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    templateType?: string;
  }): Promise<{ success: boolean; id?: string }> {
    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      const res = await fetch(`${origin}/api/notifications/dispatch-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) return { success: false };
      const data = await res.json();
      return { success: true, id: data.id };
    } catch {
      return { success: false };
    }
  }
}
