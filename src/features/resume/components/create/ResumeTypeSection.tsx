import React from 'react';
import { Briefcase, Handshake, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ResumeTypeSectionProps {
  value: 'FULLTIME' | 'C2C' | '';
  onChange: (value: 'FULLTIME' | 'C2C') => void;
}

export const ResumeTypeSection: React.FC<ResumeTypeSectionProps> = ({ value, onChange }) => {
  const options = [
    {
      id: 'FULLTIME',
      title: 'Full Time',
      description: 'For permanent full-time positions',
      icon: Briefcase,
    },
    {
      id: 'C2C',
      title: 'C2C (Contract)',
      description: 'For contract / client-based positions',
      icon: Handshake,
    },
  ] as const;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Resume Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = value === option.id;
          const Icon = option.icon;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.id)}
              className={cn(
                'relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 shadow-sm flex items-start gap-4',
                isSelected 
                  ? 'border-primary bg-primary-50/10' 
                  : 'border-slate-100 hover:border-slate-300 bg-white'
              )}
            >
              <div className={cn(
                'p-3 rounded-full',
                isSelected ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  'font-medium text-base mb-1',
                  isSelected ? 'text-primary-900' : 'text-slate-900'
                )}>
                  {option.title}
                </h3>
                <p className="text-sm text-slate-500">{option.description}</p>
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary-600">
                  <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
