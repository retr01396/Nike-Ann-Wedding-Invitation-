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
      rsvps: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          attendance: "attending" | "declined";
          guest_count: number;
          dietary_preference: string;
          dietary_other: string | null;
          accommodation_required: boolean;
          stay_guest_name: string | null;
          phone: string | null;
          people_staying: number | null;
          arrival_date: string | null;
          departure_date: string | null;
          rooms_required: number | null;
          transportation: string | null;
          transportation_other: string | null;
          special_requirements: string | null;
          message: string | null;
          status: "received" | "confirmed" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          attendance: "attending" | "declined";
          guest_count?: number;
          dietary_preference?: string;
          dietary_other?: string | null;
          accommodation_required?: boolean;
          stay_guest_name?: string | null;
          phone?: string | null;
          people_staying?: number | null;
          arrival_date?: string | null;
          departure_date?: string | null;
          rooms_required?: number | null;
          transportation?: string | null;
          transportation_other?: string | null;
          special_requirements?: string | null;
          message?: string | null;
          status?: "received" | "confirmed" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          attendance?: "attending" | "declined";
          guest_count?: number;
          dietary_preference?: string;
          dietary_other?: string | null;
          accommodation_required?: boolean;
          stay_guest_name?: string | null;
          phone?: string | null;
          people_staying?: number | null;
          arrival_date?: string | null;
          departure_date?: string | null;
          rooms_required?: number | null;
          transportation?: string | null;
          transportation_other?: string | null;
          special_requirements?: string | null;
          message?: string | null;
          status?: "received" | "confirmed" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: "admin" | "superadmin";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: "admin" | "superadmin";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "admin" | "superadmin";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type RSVPRow = Database["public"]["Tables"]["rsvps"]["Row"];
export type RSVPInsert = Database["public"]["Tables"]["rsvps"]["Insert"];
export type RSVPUpdate = Database["public"]["Tables"]["rsvps"]["Update"];
export type AdminUserRow = Database["public"]["Tables"]["admin_users"]["Row"];
