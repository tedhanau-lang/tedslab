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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          body: string
          created_at: string
          excerpt: string
          id: string
          image_key: string | null
          image_url: string | null
          minutes: number
          published: boolean
          section_slug: string | null
          slug: string
          sort: number
          subject_slug: string | null
          title: string
          tone: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          minutes?: number
          published?: boolean
          section_slug?: string | null
          slug: string
          sort?: number
          subject_slug?: string | null
          title: string
          tone?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          minutes?: number
          published?: boolean
          section_slug?: string | null
          slug?: string
          sort?: number
          subject_slug?: string | null
          title?: string
          tone?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          active: boolean
          body: string
          created_at: string
          id: string
          image_key: string | null
          image_url: string | null
          link_to: string | null
          sort: number
          subject_slug: string
          subtitle: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          active?: boolean
          body?: string
          created_at?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          link_to?: string | null
          sort?: number
          subject_slug: string
          subtitle?: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          link_to?: string | null
          sort?: number
          subject_slug?: string
          subtitle?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          created_at: string
          group_name: string
          href: string
          icon: string
          id: string
          label: string
          sort: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_name?: string
          href: string
          icon?: string
          id?: string
          label: string
          sort?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_name?: string
          href?: string
          icon?: string
          id?: string
          label?: string
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          body: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          published: boolean
          show_in_nav: boolean
          slug: string
          sort: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          published?: boolean
          show_in_nav?: boolean
          slug: string
          sort?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          published?: boolean
          show_in_nav?: boolean
          slug?: string
          sort?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          body: string
          created_at: string
          description: string
          icon: string
          id: string
          image_key: string | null
          image_url: string | null
          label: string
          slug: string
          sort: number
          subject_id: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          label: string
          slug: string
          sort?: number
          subject_id: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          label?: string
          slug?: string
          sort?: number
          subject_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image_key: string | null
          image_url: string | null
          slug: string
          sort: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          slug: string
          sort?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          slug?: string
          sort?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          blurb: string
          body: string
          created_at: string
          id: string
          image_url: string | null
          section_id: string
          slug: string
          sort: number
          title: string
          updated_at: string
        }
        Insert: {
          blurb?: string
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          section_id: string
          slug: string
          sort?: number
          title: string
          updated_at?: string
        }
        Update: {
          blurb?: string
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          section_id?: string
          slug?: string
          sort?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
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
      videos: {
        Row: {
          created_at: string
          description: string
          id: string
          poster_url: string | null
          slug: string
          sort: number
          subject_slug: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          poster_url?: string | null
          slug: string
          sort?: number
          subject_slug?: string | null
          title: string
          updated_at?: string
          url?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          poster_url?: string | null
          slug?: string
          sort?: number
          subject_slug?: string | null
          title?: string
          updated_at?: string
          url?: string
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
