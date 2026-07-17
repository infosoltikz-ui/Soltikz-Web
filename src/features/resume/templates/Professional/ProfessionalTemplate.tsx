import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { SectionTitle, ContactItem, SectionItem, Badge } from '../Shared/TemplateComponents';

export default function ProfessionalTemplate({ data, settings }: any) {
  const { personal, summary, experiences, educations, skills, projects, certifications, languages, achievements, awards, interests, references } = data;
  const fullName = [personal?.firstName, personal?.lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div className="p-[var(--page-margin)]">
      {/* Header - Centered Corporate Style */}
      <header className="mb-[var(--section-spacing)] border-b-[3px] border-[var(--primary-color)] pb-6 flex flex-col items-center text-center">
        {settings.showProfilePhoto && personal?.profileImage && (
          <div className="w-24 h-24 mb-4 rounded overflow-hidden shrink-0 border border-slate-300">
            <img src={personal.profileImage} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-[2.2em] font-bold uppercase tracking-wider text-slate-900 leading-none mb-2" style={{ fontFamily: 'var(--font-family)' }}>
          {fullName}
        </h1>
        {personal?.title && (
          <p className="text-[1.1em] text-slate-600 font-medium uppercase tracking-widest mb-3">{personal.title}</p>
        )}
        
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[0.85em] font-medium text-slate-700">
          <ContactItem icon={settings.showIcons ? Mail : null} text={personal?.email} />
          <span className="text-[var(--primary-color)]">|</span>
          <ContactItem icon={settings.showIcons ? Phone : null} text={personal?.phone ? `${personal.countryCode ? `+${personal.countryCode} ` : ''}${personal.phone}` : ''} />
          <span className="text-[var(--primary-color)]">|</span>
          <ContactItem icon={settings.showIcons ? MapPin : null} text={personal?.location || [personal?.city, personal?.state, personal?.country].filter(Boolean).join(', ')} />
          {personal?.linkedin && (
            <>
              <span className="text-[var(--primary-color)]">|</span>
              <ContactItem icon={settings.showIcons ? LinkIcon : null} text={personal.linkedin} link={personal.linkedin} />
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary?.content && (
        <section className="mb-[var(--section-spacing)]">
          <div className="text-[0.95em] text-slate-700 leading-[var(--line-height)]">
            {summary.content}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <SectionTitle title="Professional Experience" showDivider={settings.showSectionDividers} />
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

      {/* Education */}
      {educations?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <SectionTitle title="Education" showDivider={settings.showSectionDividers} />
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

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-[var(--section-spacing)] break-inside-avoid">
          <SectionTitle title="Core Competencies" showDivider={settings.showSectionDividers} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[0.95em] text-slate-700 font-medium">
            {skills.map((skill: any, index: number) => (
              <React.Fragment key={skill.id}>
                <span>{skill.name}</span>
                {index < skills.length - 1 && <span className="text-[var(--primary-color)] opacity-50">•</span>}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
