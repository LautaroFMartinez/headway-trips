export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string
          title: string
          subtitle: string
          region: string
          description: string
          duration: string
          duration_days: number
          price: string
          price_value: number
          image: string
          hero_image: string
          highlights: string[]
          tags: string[]
          available: boolean
          includes: string[]
          excludes: string[]
          start_dates: string[]
          max_capacity: number
          current_bookings: number
          difficulty_level: 'easy' | 'moderate' | 'challenging' | 'difficult'
          min_age: number
          accommodation_type: string
          cancellation_policy: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          subtitle: string
          region: string
          description: string
          duration: string
          duration_days: number
          price: string
          price_value: number
          image: string
          hero_image: string
          highlights?: string[]
          tags?: string[]
          available?: boolean
          includes?: string[]
          excludes?: string[]
          start_dates?: string[]
          max_capacity?: number
          current_bookings?: number
          difficulty_level?: 'easy' | 'moderate' | 'challenging' | 'difficult'
          min_age?: number
          accommodation_type?: string
          cancellation_policy?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          region?: string
          description?: string
          duration?: string
          duration_days?: number
          price?: string
          price_value?: number
          image?: string
          hero_image?: string
          highlights?: string[]
          tags?: string[]
          available?: boolean
          includes?: string[]
          excludes?: string[]
          start_dates?: string[]
          max_capacity?: number
          current_bookings?: number
          difficulty_level?: 'easy' | 'moderate' | 'challenging' | 'difficult'
          min_age?: number
          accommodation_type?: string
          cancellation_policy?: string
          created_at?: string
          updated_at?: string
        }
      }
      quote_requests: {
        Row: {
          id: string
          trip_id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          customer_country: string | null
          travel_date: string | null
          adults: number
          children: number
          message: string | null
          status: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'cancelled'
          assigned_agent: string | null
          internal_notes: string | null
          quoted_price: number | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          customer_country?: string | null
          travel_date?: string | null
          adults?: number
          children?: number
          message?: string | null
          status?: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'cancelled'
          assigned_agent?: string | null
          internal_notes?: string | null
          quoted_price?: number | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          customer_country?: string | null
          travel_date?: string | null
          adults?: number
          children?: number
          message?: string | null
          status?: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'cancelled'
          assigned_agent?: string | null
          internal_notes?: string | null
          quoted_price?: number | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          quote_request_id: string | null
          trip_id: string
          travel_date: string
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_document_type: string | null
          customer_document_number: string | null
          customer_country: string | null
          adults: number
          children: number
          subtotal: number
          discount_code: string | null
          discount_amount: number
          total_price: number
          currency: string
          status: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
          special_requests: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          quote_request_id?: string | null
          trip_id: string
          travel_date: string
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_document_type?: string | null
          customer_document_number?: string | null
          customer_country?: string | null
          adults?: number
          children?: number
          subtotal: number
          discount_code?: string | null
          discount_amount?: number
          total_price: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded'
          special_requests?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          quote_request_id?: string | null
          trip_id?: string
          travel_date?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_document_type?: string | null
          customer_document_number?: string | null
          customer_country?: string | null
          adults?: number
          children?: number
          subtotal?: number
          discount_code?: string | null
          discount_amount?: number
          total_price?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded'
          special_requests?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
        }
      }
      booking_passengers: {
        Row: {
          id: string
          booking_id: string
          full_name: string
          document_type: string | null
          document_number: string | null
          nationality: string | null
          birth_date: string | null
          is_adult: boolean
          email: string | null
          phone: string | null
          dietary_restrictions: string | null
          medical_conditions: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          full_name: string
          document_type?: string | null
          document_number?: string | null
          nationality?: string | null
          birth_date?: string | null
          is_adult?: boolean
          email?: string | null
          phone?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          full_name?: string
          document_type?: string | null
          document_number?: string | null
          nationality?: string | null
          birth_date?: string | null
          is_adult?: boolean
          email?: string | null
          phone?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          status: 'unread' | 'read' | 'replied' | 'archived'
          created_at: string
          replied_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'unread' | 'read' | 'replied' | 'archived'
          created_at?: string
          replied_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'unread' | 'read' | 'replied' | 'archived'
          created_at?: string
          replied_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Trip = Database['public']['Tables']['trips']['Row']
export type TripInsert = Database['public']['Tables']['trips']['Insert']
export type TripUpdate = Database['public']['Tables']['trips']['Update']

export type QuoteRequest = Database['public']['Tables']['quote_requests']['Row']
export type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert']
export type QuoteRequestUpdate = Database['public']['Tables']['quote_requests']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type BookingPassenger = Database['public']['Tables']['booking_passengers']['Row']
export type BookingPassengerInsert = Database['public']['Tables']['booking_passengers']['Insert']
export type BookingPassengerUpdate = Database['public']['Tables']['booking_passengers']['Update']

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update']
