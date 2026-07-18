import { Prisma } from '@prisma/client';

export class HTMLExportService {
  /**
   * Generates a clean, ATS-friendly HTML string from Resume Data.
   */
  public static generateHTML(resume: any, options: { template?: string; margin?: string; fontFamily?: string } = {}): string {
    const { personal, summary, experiences, educations, skills, projects } = resume;
    
    const marginClass = options.margin === 'large' ? 'padding: 60px;' : options.margin === 'small' ? 'padding: 20px;' : 'padding: 40px;';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${personal?.firstName || 'Resume'} ${personal?.lastName || ''}</title>
        <style>
          :root {
            --primary: ${resume.primaryColor || '#0f172a'};
          }
          * { box-sizing: border-box; }
          body {
            font-family: ${options.fontFamily === 'Times New Roman' ? '"Times New Roman", Times, serif' : 
                          options.fontFamily === 'Calibri' ? 'Calibri, "Open Sans", sans-serif' : 
                          options.fontFamily === 'Arial' ? 'Arial, Helvetica, sans-serif' : 
                          '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif'};
            font-size: 11pt; /* Body text = 11pt */
            line-height: 1.5;
            color: #333;
            margin: 0;
            background: #fff;
            ${marginClass}
          }
          h1, h2, h3, h4 { margin: 0 0 10pt 0; color: var(--primary); }
          h1 { font-size: 15pt; border-bottom: 2pt solid var(--primary); padding-bottom: 8pt; margin-bottom: 16pt; } /* Name = 14-15pt */
          h2 { font-size: 12pt; border-bottom: 1pt solid #ccc; padding-bottom: 4pt; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase; } /* Section Headings = 12pt */
          h3 { font-size: 11pt; font-weight: 600; }
          p { margin: 0 0 8pt 0; font-size: 11pt; }
          .contact-info { margin-bottom: 24pt; font-size: 11pt; color: #555; }
          .contact-info span { margin-right: 12pt; }
          .section { margin-bottom: 24pt; }
          .item { margin-bottom: 16pt; }
          .item-header { display: flex; justify-content: space-between; align-items: baseline; }
          .item-subtitle { font-style: italic; color: #666; font-size: 11pt; margin-bottom: 4pt;}
          .skills-list { display: flex; flex-wrap: wrap; gap: 8pt; list-style: none; padding: 0; margin: 0; }
          .skills-list li { background: #f1f5f9; padding: 4pt 10pt; border-radius: 4px; font-size: 11pt; }
          @media print {
            body { padding: 0; }
            @page { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        ${personal ? `
          <header>
            <h1>${personal.firstName || ''} ${personal.lastName || ''}</h1>
            <div class="contact-info">
              ${personal.email ? `<span>Email: ${personal.email}</span>` : ''}
              ${personal.phone ? `<span>Phone: ${personal.phone}</span>` : ''}
              ${personal.city ? `<span>Location: ${personal.city}${personal.state ? `, ${personal.state}` : ''}</span>` : ''}
              ${personal.linkedin ? `<span>LinkedIn: ${personal.linkedin}</span>` : ''}
            </div>
          </header>
        ` : ''}

        ${summary?.content ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${summary.content}</p>
          </div>
        ` : ''}

        ${experiences && experiences.length > 0 ? `
          <div class="section">
            <h2>Experience</h2>
            ${experiences.map((exp: any) => `
              <div class="item">
                <div class="item-header">
                  <h3>${exp.jobTitle} at ${exp.companyName}</h3>
                  <span style="font-size: 14px; color: #666;">${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : (exp.endDate || '')}</span>
                </div>
                <div class="item-subtitle">${exp.city || ''} ${exp.state || ''}</div>
                <p style="font-size: 14px; margin-top: 8px;">${exp.description || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${educations && educations.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${educations.map((edu: any) => `
              <div class="item">
                <div class="item-header">
                  <h3>${edu.degree ? `${edu.degree} in ` : ''}${edu.fieldOfStudy || ''}</h3>
                  <span style="font-size: 14px; color: #666;">${edu.startDate || ''} - ${edu.currentlyStudying ? 'Present' : (edu.endDate || '')}</span>
                </div>
                <div class="item-subtitle">${edu.institution} ${edu.city ? `- ${edu.city}` : ''}</div>
                ${edu.description ? `<p style="font-size: 14px;">${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            <ul class="skills-list">
              ${skills.map((skill: any) => `<li>${skill.name}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${projects && projects.length > 0 ? `
          <div class="section">
            <h2>Projects</h2>
            ${projects.map((proj: any) => `
              <div class="item">
                <div class="item-header">
                  <h3>${proj.title}</h3>
                  <span style="font-size: 14px; color: #666;">${proj.startDate || ''} - ${proj.endDate || ''}</span>
                </div>
                ${proj.technologies && proj.technologies.length > 0 ? `<div class="item-subtitle">Tech: ${proj.technologies.join(', ')}</div>` : ''}
                <p style="font-size: 14px; margin-top: 8px;">${proj.description || ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

      </body>
      </html>
    `;

    return html;
  }
}
