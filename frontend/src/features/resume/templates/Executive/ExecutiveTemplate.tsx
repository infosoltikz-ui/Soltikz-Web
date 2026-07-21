import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { SectionItem, Badge } from '../Shared/TemplateComponents';

const ExecutiveSectionTitle = ({ title, showDivider = true }: any) => (
  <div className="mb-4">
    <h2 className="text-[1.4em] font-serif font-bold text-slate-900 uppercase tracking-widest mb-1 border-b-4 border-slate-900 pb-1" style={{ borderBottomColor: 'var(--primary-color)' }}>
      {title}
    </h2>
  </div>
);

export default function ExecutiveTemplate({ data, settings }: any) {
  const { personal, summary, experiences, educations, skills, projects, certifications, languages, achievements, awards, interests, references } = data;
  const fullName = [personal?.firstName, personal?.lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div className="p-[var(--page-margin)] bg-white text-slate-800">
      {/* Header - Formal & Bold */}
      <header className="mb-[var(--section-spacing)]">
        <h1 className="text-[3em] font-serif font-black uppercase tracking-tight text-slate-900 leading-none mb-1 text-center">
          {fullName}
        </h1>
        {personal?.title && (
          <p className="text-[1.3em] font-serif text-center text-slate-700 font-bold mb-4">{personal.title}</p>
        )}
        
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-[0.9em] font-medium border-t-2 border-b-2 py-2" style={{ borderColor: 'var(--primary-color)' }}>
          {personal?.email && <span>{personal.email}</span>}
          {personal?.phone && <span>{personal.countryCode ? `+${personal.countryCode} ` : ''}{personal.phone}</span>}
          {(personal?.location || personal?.city) && <span>{personal.location || [personal?.city, personal?.state, personal?.country].filter(Boolean).join(', ')}</span>}
          {personal?.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary?.content && (
        <section className="mb-[var(--section-spacing)]">
          <ExecutiveSectionTitle title="Executive Summary" showDivider={settings.showSectionDividers} />
          <div className="text-[1em] text-slate-800 leading-[var(--line-height)] font-serif italic font-medium">
            {summary.content}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <ExecutiveSectionTitle title="Professional Experience" showDivider={settings.showSectionDividers} />
          {experiences.map((exp: any) => (
            <div key={exp.id} className="mb-6 last:mb-0 break-inside-avoid">
              <div className="flex justify-between items-baseline mb-1 border-b border-slate-200 pb-1">
                <h3 className="font-bold text-[1.1em] text-slate-900 uppercase">{exp.companyName}</h3>
                <span className="font-medium text-slate-600 font-serif">
                  {exp.startDate || ''} - {exp.currentlyWorking ? 'Present' : exp.endDate || ''}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="font-semibold italic text-slate-700 text-[1.05em]">{exp.jobTitle}</p>
                <span className="text-sm text-slate-500">{[exp.city, exp.country].filter(Boolean).join(', ')}</span>
              </div>
              {exp.environment && (
                <div className="text-[0.9em] text-slate-700 font-semibold mb-2">
                  Environment: <span className="font-normal text-slate-600">{exp.environment}</span>
                </div>
              )}
              <div className="text-[0.95em] text-slate-700 mt-2 leading-[var(--line-height)] whitespace-pre-wrap">
                {exp.description}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {educations?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <ExecutiveSectionTitle title="Education" showDivider={settings.showSectionDividers} />
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

      {/* Core Competencies (Skills) */}
      {skills?.length > 0 && (
        <section className="mb-[var(--section-spacing)] break-inside-avoid">
          <ExecutiveSectionTitle title="Areas of Expertise" showDivider={settings.showSectionDividers} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-[0.95em] text-slate-800 font-medium list-disc list-inside">
            {skills.map((skill: any) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
