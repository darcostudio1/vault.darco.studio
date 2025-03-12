export interface Component {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  featured?: boolean;
  previewImage?: string;
  preview_image?: string; // Snake case version from database
  previewVideo?: string;
  preview_video?: string; // Snake case version from database
  media?: string;
  mediaType?: 'image' | 'video' | 'auto' | 'unknown';
  media_type?: 'image' | 'video' | 'auto' | 'unknown'; // Snake case version from database
  tags?: string[];
  author?: string;
  dependencies?: string[];
  codeSnippet?: string;
  code_snippet?: string; // Snake case version from database
  demoUrl?: string;
  demo_url?: string; // Snake case version from database
  githubUrl?: string;
  github_url?: string; // Snake case version from database
  externalSourceUrl?: string;
  external_source_url?: string; // Snake case version from database
  slug?: string;
  implementation?: string;
  moreInformation?: string;
  more_information?: string; // Snake case version from database
  content?: {
    externalScripts: string;
    external_scripts?: string; // Snake case version from database
    html: string;
    css: string;
    js: string;
  };
  // Additional properties for code editors
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  updatedAt?: string;
}
