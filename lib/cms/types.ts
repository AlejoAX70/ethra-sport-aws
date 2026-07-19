export interface CmsPageResponse {
  page: {
    slug: string;
    admin_title: string;
    template_hint: string | null;
    seo: {
      meta_title: string | null;
      meta_description: string | null;
      og_title: string | null;
      og_description: string | null;
      og_image_url: string | null;
    };
  };
  sections: Array<{
    id: string;
    section_type: string;
    label: string | null;
    content: Record<string, unknown>;
    display_order: number;
  }>;
}

export interface CmsConfigResponse {
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  social_links: Array<{ platform: string; url: string }>;
  default_meta_title: string | null;
  default_meta_description: string | null;
  copyright_text: string | null;
}

export interface CmsMenuResponse {
  menu_key: string;
  label: string;
  items: Array<{
    label: string;
    url: string;
    target: string;
    children: Array<{ label: string; url: string; target: string; children: [] }>;
  }>;
}
