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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_access_state: {
        Row: {
          blocked: boolean
          provider: string
          reason: string | null
          updated_at: string
        }
        Insert: {
          blocked?: boolean
          provider: string
          reason?: string | null
          updated_at?: string
        }
        Update: {
          blocked?: boolean
          provider?: string
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      analysis_runs: {
        Row: {
          agent_slug: string
          created_at: string
          error: string | null
          filename: string
          id: string
          report: string | null
          status: string
          user_id: string
        }
        Insert: {
          agent_slug?: string
          created_at?: string
          error?: string | null
          filename: string
          id?: string
          report?: string | null
          status?: string
          user_id: string
        }
        Update: {
          agent_slug?: string
          created_at?: string
          error?: string | null
          filename?: string
          id?: string
          report?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      app_user_connections: {
        Row: {
          connection_key_ciphertext: string
          connector_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_key_ciphertext: string
          connector_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_key_ciphertext?: string
          connector_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      external_items: {
        Row: {
          authors: string
          captured_at: string
          category: string
          id: string
          published_at: string | null
          source_id: string
          summary: string
          title: string
          url: string
        }
        Insert: {
          authors?: string
          captured_at?: string
          category?: string
          id: string
          published_at?: string | null
          source_id: string
          summary?: string
          title: string
          url: string
        }
        Update: {
          authors?: string
          captured_at?: string
          category?: string
          id?: string
          published_at?: string | null
          source_id?: string
          summary?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      indicator_values: {
        Row: {
          country: string
          indicator: string
          source_id: string
          updated_at: string
          value: number | null
          year: string
        }
        Insert: {
          country: string
          indicator: string
          source_id: string
          updated_at?: string
          value?: number | null
          year: string
        }
        Update: {
          country?: string
          indicator?: string
          source_id?: string
          updated_at?: string
          value?: number | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_values_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          company: string | null
          consent: boolean
          created_at: string
          email: string
          id: string
          kind: string
          marketing: boolean
          message: string | null
          name: string
          plan: string | null
          policy_version: string
          role: string | null
          size: string | null
        }
        Insert: {
          company?: string | null
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          kind: string
          marketing?: boolean
          message?: string | null
          name: string
          plan?: string | null
          policy_version: string
          role?: string | null
          size?: string | null
        }
        Update: {
          company?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          kind?: string
          marketing?: boolean
          message?: string | null
          name?: string
          plan?: string | null
          policy_version?: string
          role?: string | null
          size?: string | null
        }
        Relationships: []
      }
      sources: {
        Row: {
          id: string
          item_count: number
          kind: string
          last_error: string | null
          last_synced_at: string | null
          name: string
          refresh_minutes: number
          status: string
          url: string
        }
        Insert: {
          id: string
          item_count?: number
          kind: string
          last_error?: string | null
          last_synced_at?: string | null
          name: string
          refresh_minutes?: number
          status?: string
          url: string
        }
        Update: {
          id?: string
          item_count?: number
          kind?: string
          last_error?: string | null
          last_synced_at?: string | null
          name?: string
          refresh_minutes?: number
          status?: string
          url?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id?: string
          paddle_subscription_id?: string
          price_id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trial_claims: {
        Row: {
          created_at: string
          run_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          run_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          run_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_claims_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "analysis_runs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_analysis: {
        Args: { p_agent_slug: string; p_env: string; p_filename: string }
        Returns: string
      }
      my_plan: { Args: { p_env: string }; Returns: Json }
      plan_tier: { Args: { p_env: string; p_user: string }; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
