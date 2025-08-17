export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          content_id: string
          content_type: string
          created_at: string
          id: string
          is_helpful: boolean
          likes_count: number
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          is_helpful?: boolean
          likes_count?: number
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          is_helpful?: boolean
          likes_count?: number
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          email: string
          id: string
          ip_address: string | null
          name: string
          subject: string
          submitted_at: string
        }
        Insert: {
          email: string
          id?: string
          ip_address?: string | null
          name: string
          subject: string
          submitted_at?: string
        }
        Update: {
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          subject?: string
          submitted_at?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed_modules: number[] | null
          completion_percentage: number | null
          course_id: number
          created_at: string | null
          id: string
          last_accessed: string | null
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_modules?: number[] | null
          completion_percentage?: number | null
          course_id: number
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_modules?: number[] | null
          completion_percentage?: number | null
          course_id?: number
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          price_cents: number | null
          stripe_price_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          price_cents?: number | null
          stripe_price_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          price_cents?: number | null
          stripe_price_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      digital_product_files: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          product_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          product_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          product_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string
          discussion_id: string
          id: string
          is_solution: boolean
          likes_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          is_solution?: boolean
          likes_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_solution?: boolean
          likes_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          content_id: string | null
          content_type: string
          created_at: string
          description: string
          id: string
          is_solved: boolean
          replies_count: number
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          content_id?: string | null
          content_type: string
          created_at?: string
          description: string
          id?: string
          is_solved?: boolean
          replies_count?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number
        }
        Update: {
          content_id?: string | null
          content_type?: string
          created_at?: string
          description?: string
          id?: string
          is_solved?: boolean
          replies_count?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: []
      }
      printify_orders: {
        Row: {
          address_to: Json
          created_at: string
          delivered_at: string | null
          external_id: string
          id: string
          line_items: Json
          printify_order_id: string
          shipped_at: string | null
          shipping_method: number | null
          status: string
          total_price: number | null
          total_shipping: number | null
          total_tax: number | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_to: Json
          created_at?: string
          delivered_at?: string | null
          external_id: string
          id?: string
          line_items: Json
          printify_order_id: string
          shipped_at?: string | null
          shipping_method?: number | null
          status: string
          total_price?: number | null
          total_shipping?: number | null
          total_tax?: number | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_to?: Json
          created_at?: string
          delivered_at?: string | null
          external_id?: string
          id?: string
          line_items?: Json
          printify_order_id?: string
          shipped_at?: string | null
          shipping_method?: number | null
          status?: string
          total_price?: number | null
          total_shipping?: number | null
          total_tax?: number | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      printify_products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          printify_id: string
          shop_id: string
          tags: string[] | null
          title: string
          updated_at: string
          variants: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          printify_id: string
          shop_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          variants?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          printify_id?: string
          shop_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          variants?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          started_at: string
          time_taken: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score: number
          started_at?: string
          time_taken?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          started_at?: string
          time_taken?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: number
          created_at: string
          description: string | null
          id: string
          max_attempts: number | null
          module_id: string
          passing_score: number | null
          questions: Json
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: number
          created_at?: string
          description?: string | null
          id?: string
          max_attempts?: number | null
          module_id: string
          passing_score?: number | null
          questions: Json
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: number
          created_at?: string
          description?: string | null
          id?: string
          max_attempts?: number | null
          module_id?: string
          passing_score?: number | null
          questions?: Json
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          created_at: string
          id: string
          identifier: string
          request_count: number
          window_end: string
          window_start: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          identifier: string
          request_count?: number
          window_end: string
          window_start?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          identifier?: string
          request_count?: number
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_description: string
          badge_name: string
          badge_type: string
          earned_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          badge_description: string
          badge_name: string
          badge_type: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          badge_description?: string
          badge_name?: string
          badge_type?: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount_paid: number | null
          created_at: string
          id: string
          product_id: number
          purchase_date: string
          stripe_session_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          id?: string
          product_id: number
          purchase_date?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          id?: string
          product_id?: number
          purchase_date?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          _action_type: string
          _identifier: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_average_rating: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_profiles_batch: {
        Args: { user_ids: string[] }
        Returns: {
          avatar_url: string
          display_name: string
          user_id: string
        }[]
      }
      get_total_courses_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_users_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          _details?: Json
          _event_type: string
          _ip_address?: string
          _user_agent?: string
          _user_id?: string
        }
        Returns: undefined
      }
      user_has_purchased_course: {
        Args: { course_id: number }
        Returns: boolean
      }
      user_has_purchased_product: {
        Args: { product_id: number }
        Returns: boolean
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
