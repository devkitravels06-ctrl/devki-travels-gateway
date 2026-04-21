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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bills: {
        Row: {
          amount_in_words: string | null
          bank_name: string | null
          bill_date: string
          bill_number: number
          cgst_amount: number | null
          cgst_percent: number | null
          created_at: string
          customer_address: string | null
          customer_name: string
          grand_total: number
          gstin: string | null
          id: string
          igst_amount: number | null
          igst_percent: number | null
          less_advance: number | null
          notes: string | null
          particulars: Json
          sgst_amount: number | null
          sgst_percent: number | null
          subtotal: number
        }
        Insert: {
          amount_in_words?: string | null
          bank_name?: string | null
          bill_date?: string
          bill_number?: number
          cgst_amount?: number | null
          cgst_percent?: number | null
          created_at?: string
          customer_address?: string | null
          customer_name: string
          grand_total?: number
          gstin?: string | null
          id?: string
          igst_amount?: number | null
          igst_percent?: number | null
          less_advance?: number | null
          notes?: string | null
          particulars?: Json
          sgst_amount?: number | null
          sgst_percent?: number | null
          subtotal?: number
        }
        Update: {
          amount_in_words?: string | null
          bank_name?: string | null
          bill_date?: string
          bill_number?: number
          cgst_amount?: number | null
          cgst_percent?: number | null
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          grand_total?: number
          gstin?: string | null
          id?: string
          igst_amount?: number | null
          igst_percent?: number | null
          less_advance?: number | null
          notes?: string | null
          particulars?: Json
          sgst_amount?: number | null
          sgst_percent?: number | null
          subtotal?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          drop_location: string
          email: string
          id: string
          name: string
          notes: string | null
          passengers: number | null
          phone: string
          pickup_date: string
          pickup_location: string
          pickup_time: string | null
          status: string
          vehicle: string
        }
        Insert: {
          created_at?: string
          drop_location: string
          email: string
          id?: string
          name: string
          notes?: string | null
          passengers?: number | null
          phone: string
          pickup_date: string
          pickup_location: string
          pickup_time?: string | null
          status?: string
          vehicle: string
        }
        Update: {
          created_at?: string
          drop_location?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          passengers?: number | null
          phone?: string
          pickup_date?: string
          pickup_location?: string
          pickup_time?: string | null
          status?: string
          vehicle?: string
        }
        Relationships: []
      }
      contact_queries: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      drivers: {
        Row: {
          aadhaar_number: string | null
          aadhaar_url: string | null
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          experience_years: number | null
          full_name: string
          id: string
          license_expiry: string | null
          license_number: string
          license_url: string | null
          notes: string | null
          phone: string
          photo_url: string | null
          status: string
          vehicle_types: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          aadhaar_url?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          license_expiry?: string | null
          license_number: string
          license_url?: string | null
          notes?: string | null
          phone: string
          photo_url?: string | null
          status?: string
          vehicle_types?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          aadhaar_url?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          license_expiry?: string | null
          license_number?: string
          license_url?: string | null
          notes?: string | null
          phone?: string
          photo_url?: string | null
          status?: string
          vehicle_types?: string | null
        }
        Relationships: []
      }
      founders: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          id: string
          name: string
          photo_url: string | null
          role: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
          photo_url?: string | null
          role: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
      service_offers: {
        Row: {
          created_at: string
          discount_label: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          price_label: string | null
          subtitle: string | null
          title: string
          updated_at: string
          whatsapp_message: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          discount_label?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_label?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
          whatsapp_message?: string
          whatsapp_number?: string
        }
        Update: {
          created_at?: string
          discount_label?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_label?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
          whatsapp_message?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
      app_role: ["admin", "user"],
    },
  },
} as const
