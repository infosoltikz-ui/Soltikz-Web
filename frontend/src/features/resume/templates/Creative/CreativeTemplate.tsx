import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { SectionTitle, ContactItem, SectionItem, Badge } from '../Shared/TemplateComponents';

export default function CreativeTemplate({ data, settings }: any) {
  const { personal, summary, experiences, educations, skills, projects, certifications, languages, achievements, awards, interests, references } = data;
  const fullName = [personal?.firstName, personal?.lastName].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div className="flex h-full min-h-[1123px]">
      
      {/* Sidebar */}
      <div className="w-[35%] bg-[var(--primary-color)] text-white p-[var(--page-margin)]">
        {settings.showProfilePhoto && personal?.profileImage && (
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white/20">
            <img src={personal.profileImage} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="mb-8 text-center">
          <h1 className="text-[2em] font-bold leading-tight mb-2" style={{ fontFamily: 'var(--font-family)' }}>
            {fullName}
          </h1>
          {personal?.title && (
            <p className="text-[1.1em] font-medium opacity-90">{personal.title}</p>
          )}
        </div>

        <div className="space-y-3 mb-10 text-[0.9em]">
          <ContactItem icon={settings.showIcons ? Mail : null} text={personal?.email} />
          <ContactItem icon={settings.showIcons ? Phone : null} text={personal?.phone ? `${personal.countryCode ? `+${personal.countryCode} ` : ''}${personal.phone}` : ''} />
          <ContactItem icon={settings.showIcons ? MapPin : null} text={personal?.location || [personal?.city, personal?.state, personal?.country].filter(Boolean).join(', ')} />
          <ContactItem icon={settings.showIcons ? LinkIcon : null} text={personal?.linkedin} link={personal?.linkedin} />
          <ContactItem icon={settings.showIcons ? Globe : null} text={personal?.website || personal?.portfolio} link={personal?.website || personal?.portfolio} />
        </div>

        {skills?.length > 0 && (
          <div className="mb-8 break-inside-avoid">
            <h2 className="text-[1.1em] font-bold uppercase tracking-wider mb-3 opacity-90 border-b border-white/20 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: any) => (
                <span key={skill.id} className="bg-white/10 px-2 py-1 rounded-md text-[0.85em]">{skill.name}</span>
              ))}
            </div>
          </div>
        )}

        {languages?.length > 0 && (
          <div className="mb-8 break-inside-avoid">
            <h2 className="text-[1.1em] font-bold uppercase tracking-wider mb-3 opacity-90 border-b border-white/20 pb-1">Languages</h2>
            <div className="flex flex-col gap-2 text-[0.9em]">
              {languages.map((lang: any) => (
                <div key={lang.id} className="flex justify-between">
                  <span>{lang.language}</span>
                  <span className="opacity-70">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] bg-white p-[var(--page-margin)]">
        
        {/* Summary */}
        {summary?.content && (
          <section className="mb-[var(--section-spacing)]">
            <SectionTitle title="Profile" showDivider={settings.showSectionDividers} />
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
                environment={exp.environment}
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
      </div>
      
    </div>
  );
}
