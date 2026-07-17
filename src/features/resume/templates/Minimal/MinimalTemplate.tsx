import React from 'react';
import { SectionTitle, SectionItem } from '../Shared/TemplateComponents';

export default function MinimalTemplate({ data, settings }: any) {
  const { personal, summary, experiences, educations, skills, projects, certifications, languages, achievements, awards, interests, references } = data;
  const fullName = [personal?.firstName, personal?.lastName].filter(Boolean).join(' ') || 'Your Name';

  const contactText = [
    personal?.email,
    personal?.phone,
    personal?.location || personal?.city,
    personal?.linkedin
  ].filter(Boolean).join('  •  ');

  return (
    <div className="p-[var(--page-margin)] font-sans text-slate-800">
      <header className="mb-[var(--section-spacing)]">
        <h1 className="text-[2em] font-light tracking-widest text-slate-900 mb-2">
          {fullName}
        </h1>
        <p className="text-[0.85em] tracking-wider text-slate-500 uppercase">{contactText}</p>
      </header>

      {summary?.content && (
        <section className="mb-[var(--section-spacing)]">
          <div className="text-[0.9em] leading-[var(--line-height)] text-slate-600 font-light">
            {summary.content}
          </div>
        </section>
      )}

      {experiences?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <SectionTitle title="Experience" showDivider={false} className="border-b border-slate-200 pb-1 mb-4" />
          {experiences.map((exp: any) => (
            <SectionItem 
              key={exp.id}
              title={exp.jobTitle}
              subtitle={exp.companyName}
              date={`${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}`}
              description={exp.description}
            />
          ))}
        </section>
      )}

      {educations?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <SectionTitle title="Education" showDivider={false} className="border-b border-slate-200 pb-1 mb-4" />
          {educations.map((edu: any) => (
            <SectionItem 
              key={edu.id}
              title={edu.degree ? `${edu.degree} in ${edu.fieldOfStudy}` : edu.institution}
              subtitle={edu.degree ? edu.institution : ''}
              date={`${edu.startDate || ''} - ${edu.currentlyStudying ? 'Present' : edu.endDate || ''}`}
            />
          ))}
        </section>
      )}

      {skills?.length > 0 && (
        <section className="mb-[var(--section-spacing)] break-inside-avoid">
          <SectionTitle title="Skills" showDivider={false} className="border-b border-slate-200 pb-1 mb-4" />
          <div className="text-[0.9em] text-slate-600 font-light leading-relaxed">
            {skills.map((s: any) => s.name).join(', ')}
          </div>
        </section>
      )}
    </div>
  );
}
