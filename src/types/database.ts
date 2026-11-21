export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: "customer" | "staff" | "admin";
          company_name: string | null;
          trn: string | null;
          is_blocked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "staff" | "admin";
          company_name?: string | null;
          trn?: string | null;
          is_blocked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          brand_id: string | null;
          title: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          sku: string;
          barcode: string | null;
          base_price_fils: number;
          sale_price_fils: number | null;
          cost_price_fils: number | null;
          stock_quantity: number;
          low_stock_threshold: number;
          is_published: boolean;
          is_featured: boolean;
          is_deal: boolean;
          deal_ends_at: string | null;
          rating: number;
          reviews_count: number;
          warranty_months: number;
          warranty_type: string;
          specs: Record<string, string>;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          brand_id?: string | null;
          title: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          sku: string;
          barcode?: string | null;
          base_price_fils: number;
          sale_price_fils?: number | null;
          cost_price_fils?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          is_published?: boolean;
          is_featured?: boolean;
          is_deal?: boolean;
          deal_ends_at?: string | null;
          rating?: number;
          reviews_count?: number;
          warranty_months?: number;
          warranty_type?: string;
          specs?: Record<string, string>;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          title: string;
          sku: string;
          price_fils: number;
          sale_price_fils: number | null;
          stock_quantity: number;
          color: string | null;
          storage: string | null;
          ram: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          title: string;
          sku: string;
          price_fils: number;
          sale_price_fils?: number | null;
          stock_quantity?: number;
          color?: string | null;
          storage?: string | null;
          ram?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          recipient_name: string;
          phone: string;
          emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman" | "Ras Al Khaimah" | "Umm Al Quwain" | "Fujairah";
          area: string;
          street_address: string;
          building_name: string | null;
          apartment_number: string | null;
          landmark: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_name: string;
          phone: string;
          emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman" | "Ras Al Khaimah" | "Umm Al Quwain" | "Fujairah";
          area: string;
          street_address: string;
          building_name?: string | null;
          apartment_number?: string | null;
          landmark?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          guest_name: string | null;
          shipping_address: Json;
          billing_address: Json | null;
          subtotal_fils: number;
          vat_fils: number;
          shipping_fils: number;
          discount_fils: number;
          total_fils: number;
          currency: string;
          payment_method: "card_stripe" | "card_telr" | "card_paytabs" | "cod";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          tracking_number: string | null;
          courier_name: string | null;
          internal_notes: string | null;
          customer_notes: string | null;
          is_retained_5_years: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          guest_name?: string | null;
          shipping_address: Json;
          billing_address?: Json | null;
          subtotal_fils: number;
          vat_fils: number;
          shipping_fils?: number;
          discount_fils?: number;
          total_fils: number;
          currency?: string;
          payment_method: "card_stripe" | "card_telr" | "card_paytabs" | "cod";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          order_status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          tracking_number?: string | null;
          courier_name?: string | null;
          internal_notes?: string | null;
          customer_notes?: string | null;
          is_retained_5_years?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_title: string;
          variant_title: string | null;
          sku: string | null;
          unit_price_fils: number;
          quantity: number;
          line_subtotal_fils: number;
          line_vat_fils: number;
          line_total_fils: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_title: string;
          variant_title?: string | null;
          sku?: string | null;
          unit_price_fils: number;
          quantity: number;
          line_subtotal_fils: number;
          line_vat_fils: number;
          line_total_fils: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          order_id: string;
          invoice_type: "simplified" | "full";
          issue_date: string;
          supply_date: string;
          supplier_name: string;
          supplier_address: string;
          supplier_trn: string;
          supplier_license: string;
          customer_name: string;
          customer_email: string;
          customer_address: string;
          customer_trn: string | null;
          customer_company_name: string | null;
          currency: string;
          subtotal_fils: number;
          vat_rate_percent: number;
          vat_fils: number;
          total_fils: number;
          pdf_url: string | null;
          is_retained_5_years: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          order_id: string;
          invoice_type?: "simplified" | "full";
          issue_date?: string;
          supply_date?: string;
          supplier_name?: string;
          supplier_address?: string;
          supplier_trn?: string;
          supplier_license?: string;
          customer_name: string;
          customer_email: string;
          customer_address: string;
          customer_trn?: string | null;
          customer_company_name?: string | null;
          currency?: string;
          subtotal_fils: number;
          vat_rate_percent?: number;
          vat_fils: number;
          total_fils: number;
          pdf_url?: string | null;
          is_retained_5_years?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      invoice_lines: {
        Row: {
          id: string;
          invoice_id: string;
          item_description: string;
          sku: string | null;
          quantity: number;
          unit_price_fils: number;
          discount_fils: number;
          taxable_amount_fils: number;
          vat_rate_percent: number;
          vat_fils: number;
          gross_amount_fils: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          item_description: string;
          sku?: string | null;
          quantity: number;
          unit_price_fils: number;
          discount_fils?: number;
          taxable_amount_fils: number;
          vat_rate_percent?: number;
          vat_fils: number;
          gross_amount_fils: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoice_lines"]["Insert"]>;
      };
      credit_notes: {
        Row: {
          id: string;
          credit_note_number: string;
          original_invoice_id: string;
          reason: string;
          amount_fils: number;
          vat_fils: number;
          total_fils: number;
          issue_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          credit_note_number: string;
          original_invoice_id: string;
          reason: string;
          amount_fils: number;
          vat_fils: number;
          total_fils: number;
          issue_date?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_notes"]["Insert"]>;
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          min_order_fils: number;
          max_discount_fils: number | null;
          usage_limit: number | null;
          times_used: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          min_order_fils?: number;
          max_discount_fils?: number | null;
          usage_limit?: number | null;
          times_used?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
      settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_name: string;
          entity_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_name: string;
          entity_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
      };
    };
  };
}

