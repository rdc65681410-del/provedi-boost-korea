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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      channel_exposures: {
        Row: {
          analysis_id: string | null
          avg_engagement: number | null
          avg_views: number | null
          best_time: string | null
          cafe_name: string | null
          created_at: string | null
          id: string
          keyword: string | null
          post_count: number | null
        }
        Insert: {
          analysis_id?: string | null
          avg_engagement?: number | null
          avg_views?: number | null
          best_time?: string | null
          cafe_name?: string | null
          created_at?: string | null
          id?: string
          keyword?: string | null
          post_count?: number | null
        }
        Update: {
          analysis_id?: string | null
          avg_engagement?: number | null
          avg_views?: number | null
          best_time?: string | null
          cafe_name?: string | null
          created_at?: string | null
          id?: string
          keyword?: string | null
          post_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_exposures_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "product_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_keywords: {
        Row: {
          analysis_id: string | null
          avg_views: number | null
          cafe_name: string | null
          competitor_brand: string | null
          created_at: string | null
          exposure_count: number | null
          id: string
          keyword: string | null
          ranking: number | null
          trend: string | null
        }
        Insert: {
          analysis_id?: string | null
          avg_views?: number | null
          cafe_name?: string | null
          competitor_brand?: string | null
          created_at?: string | null
          exposure_count?: number | null
          id?: string
          keyword?: string | null
          ranking?: number | null
          trend?: string | null
        }
        Update: {
          analysis_id?: string | null
          avg_views?: number | null
          cafe_name?: string | null
          competitor_brand?: string | null
          created_at?: string | null
          exposure_count?: number | null
          id?: string
          keyword?: string | null
          ranking?: number | null
          trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_keywords_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "product_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_contents: {
        Row: {
          channel_name: string
          content: string
          content_type: string
          created_at: string
          id: string
          order_item_id: string
          posted_at: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          channel_name: string
          content: string
          content_type: string
          created_at?: string
          id?: string
          order_item_id: string
          posted_at?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          channel_name?: string
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          order_item_id?: string
          posted_at?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_contents_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      mom_cafe_channels: {
        Row: {
          activity_level: string | null
          avg_engagement_rate: number | null
          avg_views: number | null
          best_content_types: string[] | null
          category: string | null
          created_at: string | null
          id: string
          keywords: string[] | null
          members: number | null
          name: string
          pricing: Json | null
          success_rate: number | null
          updated_at: string | null
        }
        Insert: {
          activity_level?: string | null
          avg_engagement_rate?: number | null
          avg_views?: number | null
          best_content_types?: string[] | null
          category?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          members?: number | null
          name: string
          pricing?: Json | null
          success_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          activity_level?: string | null
          avg_engagement_rate?: number | null
          avg_views?: number | null
          best_content_types?: string[] | null
          category?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          members?: number | null
          name?: string
          pricing?: Json | null
          success_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          channel_name: string
          content_type: string
          created_at: string
          id: string
          order_id: string
          post_count: number
          price_per_post: number
          total_price: number
        }
        Insert: {
          channel_name: string
          content_type: string
          created_at?: string
          id?: string
          order_id: string
          post_count: number
          price_per_post: number
          total_price: number
        }
        Update: {
          channel_name?: string
          content_type?: string
          created_at?: string
          id?: string
          order_id?: string
          post_count?: number
          price_per_post?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount: number | null
          final_amount: number
          id: string
          product_name: string | null
          product_url: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount?: number | null
          final_amount: number
          id?: string
          product_name?: string | null
          product_url: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number | null
          final_amount?: number
          id?: string
          product_name?: string | null
          product_url?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_analyses: {
        Row: {
          cafe_exposure_data: Json | null
          category: string | null
          channel_recommendations: Json | null
          competitor_analysis: Json | null
          competitor_keywords: Json | null
          content_samples: Json | null
          created_at: string | null
          estimated_roi: number | null
          id: string
          keyword_analysis: Json | null
          negative_count: number | null
          overall_score: number | null
          positive_count: number | null
          price_range: string | null
          product_name: string | null
          product_url: string
          score_level: string | null
          timing_analysis: Json | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cafe_exposure_data?: Json | null
          category?: string | null
          channel_recommendations?: Json | null
          competitor_analysis?: Json | null
          competitor_keywords?: Json | null
          content_samples?: Json | null
          created_at?: string | null
          estimated_roi?: number | null
          id?: string
          keyword_analysis?: Json | null
          negative_count?: number | null
          overall_score?: number | null
          positive_count?: number | null
          price_range?: string | null
          product_name?: string | null
          product_url: string
          score_level?: string | null
          timing_analysis?: Json | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cafe_exposure_data?: Json | null
          category?: string | null
          channel_recommendations?: Json | null
          competitor_analysis?: Json | null
          competitor_keywords?: Json | null
          content_samples?: Json | null
          created_at?: string | null
          estimated_roi?: number | null
          id?: string
          keyword_analysis?: Json | null
          negative_count?: number | null
          overall_score?: number | null
          positive_count?: number | null
          price_range?: string | null
          product_name?: string | null
          product_url?: string
          score_level?: string | null
          timing_analysis?: Json | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
