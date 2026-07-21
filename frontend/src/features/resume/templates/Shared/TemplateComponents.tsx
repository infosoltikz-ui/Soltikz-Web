import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon, Calendar } from 'lucide-react';

export const SectionTitle = ({ title, showDivider = true, align = 'left', className = '' }: any) => (
  <div className={`mb-4 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
    <h2 className="text-[1.2em] font-bold text-[var(--primary-color)] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-family)' }}>
      {title}
    </h2>
    {showDivider && <div className="h-[2px] w-full bg-[var(--primary-color)] opacity-20" />}
  </div>
);

export const ContactItem = ({ icon: Icon, text, link }: any) => {
  if (!text) return null;
  const content = (
    <span className="flex items-center gap-1.5 text-[0.9em] opacity-80 break-all">
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{text}</span>
    </span>
  );
  if (link) {
    return <a href={link} target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">{content}</a>;
  }
  return content;
};

export const SectionItem = ({ title, subtitle, date, description, environment, bullets = [], children }: any) => (
  <div className="mb-[var(--section-spacing)] last:mb-0 break-inside-avoid">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
      <div>
        <h3 className="font-semibold text-[1.05em] text-slate-800">{title}</h3>
        {subtitle && <p className="text-[0.95em] text-slate-600 font-medium">{subtitle}</p>}
      </div>
      {date && <div className="text-[0.9em] text-slate-500 whitespace-nowrap shrink-0 flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</div>}
    </div>
    
    {environment && (
      <div className="text-[0.9em] text-slate-700 font-semibold mb-2">
        Environment: <span className="font-normal text-slate-600">{environment}</span>
      </div>
    )}

    {children}
    
    {description && (
      <div className="text-[0.95em] text-slate-600 mt-2 leading-[var(--line-height)] whitespace-pre-wrap">
        {description}
      </div>
    )}
    
    {bullets.length > 0 && (
      <ul className="list-disc list-outside ml-4 mt-2 text-[0.95em] text-slate-600 space-y-1">
        {bullets.map((bullet: string, i: number) => (
          <li key={i} className="pl-1">{bullet}</li>
        ))}
      </ul>
    )}
  </div>
);

export const Badge = ({ text, outlined = false }: any) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.85em] font-medium
    ${outlined 
      ? 'border border-[var(--primary-color)] text-[var(--primary-color)]' 
      : 'bg-[var(--primary-color)] text-white'
    }`}>
    {text}
  </span>
);
