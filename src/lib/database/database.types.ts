export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      durations: {
        Row: {
          created_at: string
          description: string
          id: number
          json: Json
          name: string
          owner: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          json: Json
          name: string
          owner: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          json?: Json
          name?: string
          owner?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          description: string
          id: number
          json: Json
          name: string
          owner: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          json: Json
          name: string
          owner: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          json?: Json
          name?: string
          owner?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          created_at: string
          description: string
          id: number
          json: Json
          name: string
          owner: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          json: Json
          name: string
          owner: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          json?: Json
          name?: string
          owner?: string
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
