export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      _jobsToskills: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
      };
      interests: {
        Row: {
          content: string | null;
          id: string;
          industry_tags: string[] | null;
          user_id: string | null;
        };
        Insert: {
          content?: string | null;
          id?: string;
          industry_tags?: string[] | null;
          user_id?: string | null;
        };
        Update: {
          content?: string | null;
          id?: string;
          industry_tags?: string[] | null;
          user_id?: string | null;
        };
      };
      jobs: {
        Row: {
          achievements: string | null;
          company_name: string | null;
          date_ended: string | null;
          date_started: string | null;
          description: string;
          id: string;
          industry: string | null;
          industry_titles: string[] | null;
          interpreted_description: string | null;
          interpreted_responsibilities: string | null;
          responsibilities: string | null;
          temp_skills: string;
          title: string;
          type: string | null;
          user_id: string | null;
          user_job_order: number;
        };
        Insert: {
          achievements?: string | null;
          company_name?: string | null;
          date_ended?: string | null;
          date_started?: string | null;
          description: string;
          id?: string;
          industry?: string | null;
          industry_titles?: string[] | null;
          interpreted_description?: string | null;
          interpreted_responsibilities?: string | null;
          responsibilities?: string | null;
          temp_skills: string;
          title: string;
          type?: string | null;
          user_id?: string | null;
          user_job_order: number;
        };
        Update: {
          achievements?: string | null;
          company_name?: string | null;
          date_ended?: string | null;
          date_started?: string | null;
          description?: string;
          id?: string;
          industry?: string | null;
          industry_titles?: string[] | null;
          interpreted_description?: string | null;
          interpreted_responsibilities?: string | null;
          responsibilities?: string | null;
          temp_skills?: string;
          title?: string;
          type?: string | null;
          user_id?: string | null;
          user_job_order?: number;
        };
      };
      resumePredictions: {
        Row: {
          id: string;
          prediction: string;
          prompt: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          prediction: string;
          prompt: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          prediction?: string;
          prompt?: string;
          user_id?: string | null;
        };
      };
      signup: {
        Row: {
          completed: boolean | null;
          created_at: string | null;
          data: Json;
          date_completed: string | null;
          id: string;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string | null;
          data: Json;
          date_completed?: string | null;
          id?: string;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string | null;
          data?: Json;
          date_completed?: string | null;
          id?: string;
        };
      };
      skills: {
        Row: {
          content: string;
          id: string;
          industry_tags: string[] | null;
          interpretation: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          id?: string;
          industry_tags?: string[] | null;
          interpretation?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          id?: string;
          industry_tags?: string[] | null;
          interpretation?: string | null;
          user_id?: string | null;
        };
      };
      user: {
        Row: {
          email: string;
          first_name: string;
          id: string;
          last_name: string;
        };
        Insert: {
          email: string;
          first_name: string;
          id: string;
          last_name: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
