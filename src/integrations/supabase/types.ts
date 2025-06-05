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
      bom_items: {
        Row: {
          created_at: string | null
          final_product_id: string | null
          id: string
          material_id: string | null
          quantity_per_unit: number
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          final_product_id?: string | null
          id?: string
          material_id?: string | null
          quantity_per_unit: number
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          final_product_id?: string | null
          id?: string
          material_id?: string | null
          quantity_per_unit?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_items_final_product_id_fkey"
            columns: ["final_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      incoming_orders: {
        Row: {
          created_at: string | null
          expected_arrival_date: string | null
          id: string
          notes: string | null
          order_date: string | null
          ordered_quantity: number
          product_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expected_arrival_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          ordered_quantity: number
          product_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expected_arrival_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          ordered_quantity?: number
          product_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incoming_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      movements: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          product_id: string | null
          quantity: number
          type: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          client_price: number | null
          created_at: string | null
          current_stock: number | null
          description: string | null
          id: string
          initial_quantity: number | null
          location: string | null
          min_stock: number | null
          name: string
          nature: string | null
          production_price: number | null
          professional_price: number | null
          sku: string
          supplier: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          client_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          initial_quantity?: number | null
          location?: string | null
          min_stock?: number | null
          name: string
          nature?: string | null
          production_price?: number | null
          professional_price?: number | null
          sku: string
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          client_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          initial_quantity?: number | null
          location?: string | null
          min_stock?: number | null
          name?: string
          nature?: string | null
          production_price?: number | null
          professional_price?: number | null
          sku?: string
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
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
    Enums: {},
  },
} as const
