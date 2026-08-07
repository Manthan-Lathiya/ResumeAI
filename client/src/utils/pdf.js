export function downloadResumeAsPDF(resume, title = 'Resume') {
  if (!resume) return;

  const personalInfo = resume.personalInfo || resume.personal_info || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  const printWindow = window.open('', '_blank', 'width=800,height=1100');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups for this site.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            color: #1a1a1a;
            padding: 40px 50px;
            line-height: 1.5;
            font-size: 11pt;
          }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 16px; }
          .header h1 { font-size: 22pt; margin-bottom: 6px; letter-spacing: 1px; }
          .header .contact { font-size: 9pt; color: #555; }
          .section-title {
            font-size: 10pt; font-weight: bold; text-transform: uppercase;
            letter-spacing: 1.5px; border-bottom: 1px solid #ccc;
            padding-bottom: 3px; margin-top: 14px; margin-bottom: 8px;
          }
          .job-header { display: flex; justify-content: space-between; align-items: baseline; }
          .job-header strong { font-size: 11pt; }
          .job-header .date { font-size: 9pt; color: #666; }
          .company { font-size: 9.5pt; color: #444; }
          ul { padding-left: 18px; margin-top: 4px; }
          ul li { margin-bottom: 2px; font-size: 10.5pt; }
          .edu-row { display: flex; justify-content: space-between; align-items: baseline; }
          .skills { font-size: 10.5pt; }
          .project-name { font-weight: bold; }
          .project-link { font-size: 9pt; color: #0066cc; margin-left: 8px; }
          .project-desc { font-size: 10pt; margin-top: 2px; }
          .project-tech { font-size: 9pt; color: #666; margin-top: 2px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-3 { margin-bottom: 12px; }
          @media print {
            body { padding: 20px 40px; }
            @page { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${personalInfo.fullName || 'Your Name'}</h1>
          <div class="contact">
            ${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' • ')}
          </div>
          ${(personalInfo.linkedin || personalInfo.website) ? `<div class="contact">${[personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' • ')}</div>` : ''}
        </div>

        ${summary ? `<div class="section-title">Professional Summary</div><p style="font-size:10.5pt;color:#333;">${summary}</p>` : ''}

        ${experience.filter(e => e.company || e.title).length > 0 ? `
          <div class="section-title">Experience</div>
          ${experience.filter(e => e.company || e.title).map(exp => `
            <div class="mb-3">
              <div class="job-header">
                <strong>${exp.title || 'Job Title'}</strong>
                <span class="date">${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}</span>
              </div>
              <div class="company">${exp.company || ''}${exp.location ? ` • ${exp.location}` : ''}</div>
              ${exp.bullets?.filter(Boolean).length > 0 ? `<ul>${exp.bullets.filter(Boolean).map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${education.filter(e => e.institution || e.degree).length > 0 ? `
          <div class="section-title">Education</div>
          ${education.filter(e => e.institution || e.degree).map(edu => `
            <div class="mb-2">
              <div class="edu-row">
                <strong>${edu.degree || 'Degree'}</strong>
                <span class="date">${edu.startDate || ''} – ${edu.endDate || ''}</span>
              </div>
              <div class="company">${edu.institution || ''}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
            </div>
          `).join('')}
        ` : ''}

        ${skills.length > 0 ? `
          <div class="section-title">Skills</div>
          <p class="skills">${skills.join(' • ')}</p>
        ` : ''}

        ${projects.filter(p => p.name).length > 0 ? `
          <div class="section-title">Projects</div>
          ${projects.filter(p => p.name).map(proj => `
            <div class="mb-2">
              <span class="project-name">${proj.name}</span>
              ${proj.link ? `<span class="project-link">${proj.link}</span>` : ''}
              ${proj.description ? `<p class="project-desc">${proj.description}</p>` : ''}
              ${proj.technologies?.length > 0 ? `<p class="project-tech">Tech: ${proj.technologies.join(', ')}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function downloadTextAsFile(text, filename) {
  if (!text) return;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
