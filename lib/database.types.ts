export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          token: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          name: string
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      booking_passengers: {
        Row: {
          birth_date: string | null
          booking_id: string | null
          created_at: string | null
          document_number: string | null
          document_type: string | null
          full_name: string
          id: string
          is_adult: boolean | null
          nationality: string | null
        }
        Insert: {
          birth_date?: string | null
          booking_id?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          full_name: string
          id?: string
          is_adult?: boolean | null
          nationality?: string | null
        }
        Update: {
          birth_date?: string | null
          booking_id?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          full_name?: string
          id?: string
          is_adult?: boolean | null
          nationality?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_passengers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          adults: number | null
          children: number | null
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          internal_notes: string | null
          payment_status: string | null
          quote_request_id: string | null
          special_requests: string | null
          status: string | null
          total_price: number | null
          travel_date: string
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          adults?: number | null
          children?: number | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          internal_notes?: string | null
          payment_status?: string | null
          quote_request_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_price?: number | null
          travel_date: string
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          adults?: number | null
          children?: number | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          internal_notes?: string | null
          payment_status?: string | null
          quote_request_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_price?: number | null
          travel_date?: string
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          status: string
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          status?: string
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          status?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          notes: string | null
          phone: string | null
          read: boolean | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          read?: boolean | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          read?: boolean | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          adults: number | null
          children: number | null
          created_at: string | null
          customer_country: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          message: string | null
          notes: string | null
          status: string | null
          travel_date: string | null
          trip_id: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          adults?: number | null
          children?: number | null
          created_at?: string | null
          customer_country?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          status?: string | null
          travel_date?: string | null
          trip_id?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          adults?: number | null
          children?: number | null
          created_at?: string | null
          customer_country?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          status?: string | null
          travel_date?: string | null
          trip_id?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          accommodation_type: string | null
          available: boolean | null
          booking_count: number | null
          content_blocks: Json | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration: string
          duration_days: number
          excludes: string[] | null
          featured: boolean | null
          gallery: string[] | null
          group_size_max: number | null
          group_size_min: number | null
          hero_image: string | null
          highlights: string[] | null
          id: string
          image: string | null
          includes: string[] | null
          itinerary: Json | null
          pdf_url: string | null
          price: string
          price_value: number
          region: string
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          accommodation_type?: string | null
          available?: boolean | null
          booking_count?: number | null
          content_blocks?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration: string
          duration_days: number
          excludes?: string[] | null
          featured?: boolean | null
          gallery?: string[] | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image?: string | null
          highlights?: string[] | null
          id: string
          image?: string | null
          includes?: string[] | null
          itinerary?: Json | null
          pdf_url?: string | null
          price: string
          price_value: number
          region: string
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          accommodation_type?: string | null
          available?: boolean | null
          booking_count?: number | null
          content_blocks?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: string
          duration_days?: number
          excludes?: string[] | null
          featured?: boolean | null
          gallery?: string[] | null
          group_size_max?: number | null
          group_size_min?: number | null
          hero_image?: string | null
          highlights?: string[] | null
          id?: string
          image?: string | null
          includes?: string[] | null
          itinerary?: Json | null
          pdf_url?: string | null
          price?: string
          price_value?: number
          region?: string
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_admin_password: {
        Args: { p_email: string; p_password: string }
        Returns: {
          email: string
          id: string
          name: string
          role: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
