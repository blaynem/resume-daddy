export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _jobsToskills: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
      }
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          new_data: Json | null
          old_data: Json | null
          row_id: string
          table_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          row_id: string
          table_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          row_id?: string
          table_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
      }
      interests: {
        Row: {
          content: string | null
          id: string
          industry_tags: string[] | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          industry_tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          industry_tags?: string[] | null
          user_id?: string | null
        }
      }
      jobs: {
        Row: {
          achievements: string | null
          company_name: string | null
          date_ended: string | null
          date_started: string | null
          experience: string | null
          id: string
          industry_tags: string | null
          industry_titles: string[] | null
          interpreted_experience: string | null
          interpreted_summary: string | null
          summary: string
          temp_skills: string
          title: string
          type: string | null
          user_id: string | null
          user_job_order: number
        }
        Insert: {
          achievements?: string | null
          company_name?: string | null
          date_ended?: string | null
          date_started?: string | null
          experience?: string | null
          id?: string
          industry_tags?: string | null
          industry_titles?: string[] | null
          interpreted_experience?: string | null
          interpreted_summary?: string | null
          summary: string
          temp_skills: string
          title: string
          type?: string | null
          user_id?: string | null
          user_job_order: number
        }
        Update: {
          achievements?: string | null
          company_name?: string | null
          date_ended?: string | null
          date_started?: string | null
          experience?: string | null
          id?: string
          industry_tags?: string | null
          industry_titles?: string[] | null
          interpreted_experience?: string | null
          interpreted_summary?: string | null
          summary?: string
          temp_skills?: string
          title?: string
          type?: string | null
          user_id?: string | null
          user_job_order?: number
        }
      }
      predictions: {
        Row: {
          created_at: string | null
          id: string
          job_description: string
          prediction: string
          question: string
          resume: string
          type: Database["public"]["Enums"]["PredictionType"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_description: string
          prediction: string
          question: string
          resume: string
          type: Database["public"]["Enums"]["PredictionType"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_description?: string
          prediction?: string
          question?: string
          resume?: string
          type?: Database["public"]["Enums"]["PredictionType"]
          user_id?: string | null
        }
      }
      skills: {
        Row: {
          content: string
          id: string
          industry_tags: string[] | null
          interpretation: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          id?: string
          industry_tags?: string[] | null
          interpretation?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          id?: string
          industry_tags?: string[] | null
          interpretation?: string | null
          user_id?: string | null
        }
      }
      suggestedChanges: {
        Row: {
          id: string
          job_id: string | null
          original_content: string
          status: Database["public"]["Enums"]["StatusType"]
          status_reason: string | null
          suggest_at: string | null
          suggested_content: string
          type: Database["public"]["Enums"]["SuggestionType"]
          user_id: string | null
        }
        Insert: {
          id?: string
          job_id?: string | null
          original_content: string
          status?: Database["public"]["Enums"]["StatusType"]
          status_reason?: string | null
          suggest_at?: string | null
          suggested_content: string
          type: Database["public"]["Enums"]["SuggestionType"]
          user_id?: string | null
        }
        Update: {
          id?: string
          job_id?: string | null
          original_content?: string
          status?: Database["public"]["Enums"]["StatusType"]
          status_reason?: string | null
          suggest_at?: string | null
          suggested_content?: string
          type?: Database["public"]["Enums"]["SuggestionType"]
          user_id?: string | null
        }
      }
      user: {
        Row: {
          email: string
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          email: string
          first_name: string
          id: string
          last_name: string
        }
        Update: {
          email?: string
          first_name?: string
          id?: string
          last_name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      PredictionType: "FREE_FORM_QUESTION"
      StatusType: "PENDING" | "ACCEPTED" | "REJECTED"
      SuggestionType: "EXPERIENCE" | "JOB_SUMMARY" | "COVER_LETTER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

