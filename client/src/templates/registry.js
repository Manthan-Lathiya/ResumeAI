import React from 'react';
import ClassicTemplate from './layouts/ClassicTemplate';
import ExecutiveTemplate from './layouts/ExecutiveTemplate';
import TechTemplate from './layouts/TechTemplate';
import CreativeTemplate from './layouts/CreativeTemplate';
import MinimalistTemplate from './layouts/MinimalistTemplate';
import ConfigurableTemplate from './layouts/ConfigurableTemplate';

export const ThemeColors = {
  ROYAL_BLUE: '#2563eb',
  EMERALD: '#059669',
  MIDNIGHT: '#1e3a8a',
  CRIMSON: '#dc2626',
  VIOLET: '#7c3aed',
  TEAL: '#0d9488',
  CHARCOAL: '#334155',
  ROSE: '#e11d48',
  AMBER: '#d97706',
  INDIGO: '#4f46e5',
};

export const COLOR_PRESETS = [
  { id: 'royal_blue', name: 'Royal Blue', hex: '#2563eb' },
  { id: 'emerald', name: 'Emerald Green', hex: '#059669' },
  { id: 'midnight', name: 'Midnight Navy', hex: '#1e3a8a' },
  { id: 'crimson', name: 'Deep Crimson', hex: '#dc2626' },
  { id: 'violet', name: 'Modern Violet', hex: '#7c3aed' },
  { id: 'teal', name: 'Dark Teal', hex: '#0d9488' },
  { id: 'charcoal', name: 'Classic Slate', hex: '#334155' },
  { id: 'rose', name: 'Rose Red', hex: '#e11d48' },
  { id: 'amber', name: 'Warm Amber', hex: '#d97706' },
  { id: 'indigo', name: 'Deep Indigo', hex: '#4f46e5' },
];

// Wrapper helper to bind config to ConfigurableTemplate
const createTemplateComponent = (config) => {
  return (props) => React.createElement(ConfigurableTemplate, { ...props, config });
};

/**
 * 20+ Distinct Resume Templates Catalog
 */
export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic ATS',
    tag: 'Popular',
    description: 'Clean single-column structure designed for 100% ATS readability and traditional roles.',
    component: ClassicTemplate,
    defaultColor: '#2563eb',
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    tag: 'Management',
    description: 'Highlights experience, education, and skills with bold teal header accents and clean lines.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'left', headingStyle: 'left-bar', fontFamily: 'font-sans' }),
    defaultColor: '#0d9488',
  },
  {
    id: 'current',
    name: 'Current',
    tag: 'Tech & Product',
    description: 'Bold headings and vibrant royal blue banners perfect for fast-paced tech and product management.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'banner', headingStyle: 'border-bottom', fontFamily: 'font-sans' }),
    defaultColor: '#2563eb',
  },
  {
    id: 'innovative',
    name: 'Innovative',
    tag: 'Creative & Art',
    description: 'Unique left-sidebar layout ideal for artists, designers, and creatives wanting visual impact.',
    component: createTemplateComponent({ layout: 'sidebar-left', headerStyle: 'left', headingStyle: 'border-bottom', fontFamily: 'font-sans' }),
    defaultColor: '#059669',
  },
  {
    id: 'basic',
    name: 'Basic',
    tag: 'Simple',
    description: 'Showcases achievements, credentials, and skills cleanly for entry-level and experienced pros.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'center', headingStyle: 'muted', fontFamily: 'font-sans' }),
    defaultColor: '#dc2626',
  },
  {
    id: 'polished',
    name: 'Polished',
    tag: 'Entry Level',
    description: 'Straightforward design for fast-paced industries where clarity and simplicity are key.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'banner', headingStyle: 'pill', fontFamily: 'font-sans' }),
    defaultColor: '#0d9488',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    tag: 'Executive',
    description: 'Refined serif typography and subtle accent dividers for directors and C-suite leadership.',
    component: ExecutiveTemplate,
    defaultColor: '#1e3a8a',
  },
  {
    id: 'tech',
    name: 'Silicon Valley Tech',
    tag: 'Engineering',
    description: 'Dual-column layout featuring a dedicated sidebar for Tech Stack, skills, and code links.',
    component: TechTemplate,
    defaultColor: '#059669',
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    tag: 'Design',
    description: 'Vibrant accent banner, initials avatar badge, and modern pill tags for portfolio roles.',
    component: CreativeTemplate,
    defaultColor: '#7c3aed',
  },
  {
    id: 'minimalist',
    name: 'Nordic Minimalist',
    tag: 'Clean',
    description: 'Spacious, borderless layout with subtle slate typography for modern professionals.',
    component: MinimalistTemplate,
    defaultColor: '#334155',
  },
  {
    id: 'harvard_ats',
    name: 'Harvard Business ATS',
    tag: 'Corporate',
    description: 'Traditional ivy-league single-column format favored by top investment banks and consulting firms.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'center', headingStyle: 'double-line', fontFamily: 'font-serif' }),
    defaultColor: '#1e3a8a',
  },
  {
    id: 'stanford_modern',
    name: 'Stanford Modern',
    tag: 'Tech',
    description: 'Clean modern structure with left accent indicators and crisp indigo titles.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'left', headingStyle: 'left-bar', fontFamily: 'font-sans' }),
    defaultColor: '#4f46e5',
  },
  {
    id: 'metropolitan',
    name: 'Metropolitan',
    tag: 'Business',
    description: 'Boxed header badge and dark slate borders for corporate analysts and strategists.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'boxed', headingStyle: 'border-bottom', fontFamily: 'font-sans' }),
    defaultColor: '#334155',
  },
  {
    id: 'oxford_serif',
    name: 'Oxford Academic',
    tag: 'Academic',
    description: 'Classic serif font pairing with subtle underline accents for researchers and professors.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'center', headingStyle: 'border-bottom', fontFamily: 'font-serif' }),
    defaultColor: '#7c3aed',
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    tag: 'Portfolio',
    description: 'Bold initials avatar badge and multi-color accents tailored for modern marketers.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'initials', headingStyle: 'pill', fontFamily: 'font-sans' }),
    defaultColor: '#e11d48',
  },
  {
    id: 'elegance',
    name: 'Elegance Luxury',
    tag: 'High-End',
    description: 'Sophisticated warm amber theme with generous line height and elegant header styling.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'left', headingStyle: 'muted', fontFamily: 'font-serif' }),
    defaultColor: '#d97706',
  },
  {
    id: 'metro_split',
    name: 'Metro Split',
    tag: '2-Column',
    description: 'Right sidebar structure putting work achievements front and center with right-side credentials.',
    component: createTemplateComponent({ layout: 'sidebar-right', headerStyle: 'left', headingStyle: 'left-bar', fontFamily: 'font-sans' }),
    defaultColor: '#2563eb',
  },
  {
    id: 'apex_leader',
    name: 'Apex Leader',
    tag: 'Senior Exec',
    description: 'Commanding header presence and double-underlined section dividers for senior leaders.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'left', headingStyle: 'double-line', fontFamily: 'font-sans' }),
    defaultColor: '#1e3a8a',
  },
  {
    id: 'compact_tech',
    name: 'Compact Engineer',
    tag: 'Developer',
    description: 'High-density layout engineered to fit maximum technical projects & skills on a single page.',
    component: createTemplateComponent({ layout: 'sidebar-left', headerStyle: 'left', headingStyle: 'border-bottom', fontFamily: 'font-sans' }),
    defaultColor: '#0d9488',
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle Professional',
    tag: 'Universal',
    description: 'Universal high-impact template suitable for any industry from healthcare to finance.',
    component: createTemplateComponent({ layout: '1col', headerStyle: 'initials', headingStyle: 'left-bar', fontFamily: 'font-sans' }),
    defaultColor: '#4f46e5',
  },
];

/**
 * Helper to retrieve a template component by ID (falls back to Classic)
 */
export function getTemplateComponent(templateId) {
  const found = TEMPLATES.find(t => t.id === templateId);
  return found ? found.component : ClassicTemplate;
}
