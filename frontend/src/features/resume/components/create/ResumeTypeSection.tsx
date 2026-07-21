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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">1. Select Resume Type</h2>
        <p className="text-sm text-slate-500 mt-1">Choose the type of resume you want to create.</p>
      </div>
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
                'relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm flex flex-col items-center text-center gap-3',
                isSelected 
                  ? 'border-primary bg-primary-50/20' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              )}
            >
              <div className={cn(
                'p-4 rounded-full mb-1',
                isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={cn(
                  'font-semibold text-base mb-1',
                  isSelected ? 'text-slate-900' : 'text-slate-900'
                )}>
                  {option.title}
                </h3>
                <p className="text-xs text-slate-500">{option.description}</p>
              </div>
              
              {isSelected && (
                <div className="absolute top-3 right-3 text-primary">
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
