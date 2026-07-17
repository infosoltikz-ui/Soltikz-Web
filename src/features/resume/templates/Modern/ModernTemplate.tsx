import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { SectionTitle, ContactItem, SectionItem, Badge } from '../Shared/TemplateComponents';

export default function ModernTemplate({ data, settings }: any) {
  const { personal, summary, experiences, educations, skills, projects, certifications, languages, achievements, awards, interests, references } = data;
  const fullName = [personal?.firstName, personal?.lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div className="p-[var(--page-margin)]">
      {/* Header */}
      <header className="mb-[var(--section-spacing)] border-b-2 border-slate-200 pb-6 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
        {settings.showProfilePhoto && personal?.profileImage && (
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-[var(--primary-color)]">
            <img src={personal.profileImage} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-[2.5em] font-bold tracking-tight text-slate-900 leading-none mb-2" style={{ fontFamily: 'var(--font-family)' }}>
            {fullName}
          </h1>
          {personal?.title && (
            <p className="text-[1.2em] text-[var(--primary-color)] font-medium mb-3">{personal.title}</p>
          )}
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-2">
            <ContactItem icon={settings.showIcons ? Mail : null} text={personal?.email} />
            <ContactItem icon={settings.showIcons ? Phone : null} text={personal?.phone ? `${personal.countryCode ? `+${personal.countryCode} ` : ''}${personal.phone}` : ''} />
            <ContactItem icon={settings.showIcons ? MapPin : null} text={personal?.location || [personal?.city, personal?.state, personal?.country].filter(Boolean).join(', ')} />
            <ContactItem icon={settings.showIcons ? LinkIcon : null} text={personal?.linkedin} link={personal?.linkedin} />
            <ContactItem icon={settings.showIcons ? Globe : null} text={personal?.website || personal?.portfolio} link={personal?.website || personal?.portfolio} />
          </div>
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
          <SectionTitle title="Experience" showDivider={settings.showSectionDividers} />
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

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-[var(--section-spacing)]">
          <SectionTitle title="Projects" showDivider={settings.showSectionDividers} />
          {projects.map((proj: any) => (
            <SectionItem 
              key={proj.id}
              title={proj.title}
              date={`${proj.startDate || ''} - ${proj.endDate || ''}`}
              description={proj.description}
              bullets={proj.technologies?.length > 0 ? [`Technologies: ${proj.technologies.join(', ')}`] : []}
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
              description={edu.description}
            />
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Skills */}
        {skills?.length > 0 && (
          <section className="mb-[var(--section-spacing)] break-inside-avoid">
            <SectionTitle title="Skills" showDivider={settings.showSectionDividers} />
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill: any) => (
                <Badge key={skill.id} text={skill.name} outlined={false} />
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <section className="mb-[var(--section-spacing)] break-inside-avoid">
            <SectionTitle title="Languages" showDivider={settings.showSectionDividers} />
            <div className="flex flex-col gap-1 mt-2">
              {languages.map((lang: any) => (
                <div key={lang.id} className="flex justify-between items-center text-[0.9em]">
                  <span className="font-medium text-slate-700">{lang.language}</span>
                  <span className="text-slate-500">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
