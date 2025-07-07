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
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          client_email: string
          client_name: string
          created_at: string | null
          id: string
          package_id: string
          package_name: string
          package_price: number
          special_requests: string | null
          status: string | null
          updated_at: string | null
          uploaded_images: Json | null
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          client_email: string
          client_name: string
          created_at?: string | null
          id?: string
          package_id: string
          package_name: string
          package_price: number
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_images?: Json | null
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          client_email?: string
          client_name?: string
          created_at?: string | null
          id?: string
          package_id?: string
          package_name?: string
          package_price?: number
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_images?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      configurations: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          channel: string | null
          created_at: string | null
          currency: string | null
          customer_email: string
          gateway_response: string | null
          id: string
          paid_at: string | null
          reference: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          channel?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          gateway_response?: string | null
          id?: string
          paid_at?: string | null
          reference: string
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          channel?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          gateway_response?: string | null
          id?: string
          paid_at?: string | null
          reference?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      paystack_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: number
          payload: Json
          processed: boolean | null
          processed_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: never
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: never
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transfer_recipients: {
        Row: {
          account_name: string | null
          account_number: string
          bank_code: string
          bank_name: string
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          recipient_code: string
          updated_at: string | null
        }
        Insert: {
          account_name?: string | null
          account_number: string
          bank_code: string
          bank_name: string
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          recipient_code: string
          updated_at?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          recipient_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transfers: {
        Row: {
          account_number: string
          amount: number
          bank_code: string
          bank_name: string
          completed_at: string | null
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          id: string
          initiated_by: string | null
          paystack_recipient_code: string | null
          recipient_email: string
          recipient_name: string
          reference: string
          status: string | null
          transfer_code: string | null
          updated_at: string | null
        }
        Insert: {
          account_number: string
          amount: number
          bank_code: string
          bank_name: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          initiated_by?: string | null
          paystack_recipient_code?: string | null
          recipient_email: string
          recipient_name: string
          reference: string
          status?: string | null
          transfer_code?: string | null
          updated_at?: string | null
        }
        Update: {
          account_number?: string
          amount?: number
          bank_code?: string
          bank_name?: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          initiated_by?: string | null
          paystack_recipient_code?: string | null
          recipient_email?: string
          recipient_name?: string
          reference?: string
          status?: string | null
          transfer_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const