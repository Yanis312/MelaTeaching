export type Role = 'super_admin' | 'prof' | 'student' | 'parent'
export type Language = 'fr' | 'ar' | 'en'
export type Subject = 'math' | 'physique' | 'chimie'
export type LevelGroup = 'primaire' | 'cem' | 'lycee'
export type BookingStatus = 'pending' | 'counter_proposed' | 'accepted' | 'rejected' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'pending' | 'paid'
export type DayType = 'weekday' | 'weekend' | 'any'
export type RecurrenceType = 'once' | 'weekly'
export type NotificationType =
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_rejected'
  | 'counter_proposal'
  | 'reminder_24h'
  | 'reminder_1h'
  | 'payment_reminder'
  | 'new_registration'

export type StudentLevel =
  | 'primaire_1' | 'primaire_2' | 'primaire_3' | 'primaire_4' | 'primaire_5'
  | 'cem_1' | 'cem_2' | 'cem_3' | 'cem_4'
  | 'lycee_1as' | 'lycee_2as' | 'lycee_3as'

export interface Profile {
  id: string
  role: Role
  full_name: string
  phone?: string
  avatar_url?: string
  preferred_language: Language
  is_approved: boolean
  created_at: string
}

export interface Student {
  id: string
  profile_id?: string
  parent_id?: string
  full_name: string
  birth_year?: number
  level: StudentLevel
  school_name?: string
  created_at: string
}

export interface Course {
  id: string
  subject: Subject
  level_group: LevelGroup
  levels: StudentLevel[]
  title: string
  description?: string
  is_active: boolean
  color: string
}

export interface PricingRule {
  id: string
  course_id: string
  duration_minutes: number
  price: number
  currency: 'DZD'
  label: string
  day_type: DayType
}

export interface Availability {
  id: string
  prof_id: string
  start_at: string
  end_at: string
  is_blocked: boolean
  recurrence: RecurrenceType
  recurrence_end_date?: string
  note?: string
}

export interface Booking {
  id: string
  student_id: string
  requester_id: string
  course_id: string
  pricing_rule_id?: string
  requested_start: string
  requested_end: string
  confirmed_start?: string
  confirmed_end?: string
  status: BookingStatus
  prof_note?: string
  student_note?: string
  payment_status: PaymentStatus
  payment_date?: string
  payment_amount?: number
  created_at: string
  updated_at: string
  student?: Student
  course?: Course
  pricing_rule?: PricingRule
}

export interface Notification {
  id: string
  recipient_id: string
  type: NotificationType
  title_fr: string
  title_ar: string
  title_en: string
  body_fr: string
  body_ar: string
  body_en: string
  related_booking_id?: string
  is_read: boolean
  created_at: string
}

export interface PushSubscription {
  id: string
  profile_id: string
  endpoint: string
  keys_p256dh: string
  keys_auth: string
  created_at: string
}
