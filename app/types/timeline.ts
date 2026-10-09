export interface TimelineEntry {
  id: string;
  category: 'Education' | 'Certification' | 'Writing' | 'Project' | 'Experience';
  title: string;
  organization: string;
  start: string;
  end?: string;
  current?: boolean;
  description: string;
  skills: string[];
  link?: { label: string; to: string };
}
