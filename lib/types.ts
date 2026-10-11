export type VisaPathway = {
  title?: string;
  description?: string;
  requirements?: string;
  steps?: string[];
};

export type VisaFaq = {
  question?: string;
  answer?: string;
};

export type VisaCost = {
  label?: string;
  amount?: string;
  notes?: string;
};

export type VisaDuration = {
  initial?: string;
  extension?: string;
  permanent?: string;
  notes?: string;
};

export type VisaProcessing = {
  standard?: string;
  priority?: string;
  complex?: string;
};

export type CmsPageRecord = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  template: string | null;
  category: string;
  subcategory: string | null;
  image: string | null;
  image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  featured: boolean;
  visaHighlights: string[];
  visaEligibility: string[];
  visaBenefits: string[];
  visaSteps: string[];
  visaFaqs: VisaFaq[];
  visaProcessing: VisaProcessing;
  visaCosts: VisaCost[];
  visaDuration: VisaDuration;
  visaPathways: VisaPathway[];
  updatedAt: string | null;
};

export type RelatedPage = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  href: string;
};

export type BlogSummary = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  image: string | null;
  imageAlt: string | null;
  author: string | null;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string | null;
};

export type BlogPost = BlogSummary & {
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type SuccessStorySummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  visaType: string | null;
  clientName: string | null;
  featured: boolean;
  order: number | null;
};

export type SuccessStory = SuccessStorySummary & {
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type ServiceItem = {
  id: number;
  title: string;
  slug: string | null;
  shortDescription: string | null;
  icon: string | null;
  order: number | null;
};

export type TeamMember = {
  id: number;
  name: string;
  designation: string | null;
  marn: string | null;
  description: string | null;
  image: string | null;
  order: number | null;
};

export type HomeContent = {
  seoTitle: string;
  seoDescription: string;
  meetLink: string;
  blogs: BlogSummary[];
  services: ServiceItem[];
  stories: SuccessStorySummary[];
  team: TeamMember[];
};
