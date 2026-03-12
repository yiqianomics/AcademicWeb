
export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  gpa?: string;
  details: string[];
}

export interface PublicationItem {
  authors: string;
  title: string;
  journal: string;
  status?: string | string[];
  doi?: string;
  year: string;
}

export interface ExperienceItem {
  title: string;
  institution: string;
  duration: string;
  advisors?: string;
  description: {
    label: string;
    content: string;
  }[];
  link?: string;
}

export interface ServiceItem {
  role: string;
  organization: string;
  duration: string;
  details: string[];
}

export interface TeachingItem {
  role: string;
  course: string;
  period: string;
  institution?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface NewsItem {
  date: string;
  title: string;
  content: string;
}