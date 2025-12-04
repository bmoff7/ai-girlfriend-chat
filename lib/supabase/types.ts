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
          credits: number;
          is_unlimited: boolean;
          has_purchased: boolean;
          gf_name: string;
          your_name: string;
          personality: string;
          backstory: string;
          texting_style: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          credits?: number;
          is_unlimited?: boolean;
          has_purchased?: boolean;
          gf_name?: string;
          your_name?: string;
          personality?: string;
          backstory?: string;
          texting_style?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          credits?: number;
          is_unlimited?: boolean;
          has_purchased?: boolean;
          gf_name?: string;
          your_name?: string;
          personality?: string;
          backstory?: string;
          texting_style?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

