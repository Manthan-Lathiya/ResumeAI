import React from 'react';
import { getTemplateComponent } from '../templates/registry';

/**
 * Renders a resume data object using its configured template and theme color.
 */
export default function ResumePreview({ resume }) {
  if (!resume) return null;

  const templateId = resume.template_id || resume.templateId || 'classic';
  const themeColor = resume.theme_color || resume.themeColor || '#2563eb';

  const TemplateComponent = getTemplateComponent(templateId);

  return <TemplateComponent resume={resume} themeColor={themeColor} />;
}
