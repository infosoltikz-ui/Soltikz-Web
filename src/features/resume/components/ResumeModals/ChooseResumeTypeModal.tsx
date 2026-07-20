import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Handshake, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ChooseResumeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChooseResumeTypeModal: React.FC<ChooseResumeTypeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'FULLTIME' | 'C2C' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onClose();
      navigate(`/dashboard/resumes/new?type=${selectedType}`);
      // Reset for next time
      setTimeout(() => setSelectedType(null), 300);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Choose Resume Type</h2>
              <p className="text-sm text-slate-500 mt-1">
                Select the type of position you are targeting.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <TypeOption 
                id="FULLTIME"
                title="Full Time"
                description="For permanent, full-time positions."
                icon={Briefcase}
                isSelected={selectedType === 'FULLTIME'}
                onClick={() => setSelectedType('FULLTIME')}
              />
              <TypeOption 
                id="C2C"
                title="C2C (Contract)"
                description="For contract or client-based positions."
                icon={Handshake}
                isSelected={selectedType === 'C2C'}
                onClick={() => setSelectedType('C2C')}
              />
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedType}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-primary/20"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TypeOption = ({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  isSelected, 
  onClick 
}: { 
  id: string;
  title: string;
  description: string;
  icon: any;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4',
      isSelected 
        ? 'border-primary bg-primary-50/10' 
        : 'border-slate-100 hover:border-slate-300 bg-white'
    )}
  >
    <div className={cn(
      'p-3 rounded-full',
      isSelected ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
    )}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 mt-0.5">
      <h3 className={cn(
        'font-medium text-base mb-1',
        isSelected ? 'text-primary-900' : 'text-slate-900'
      )}>
        {title}
      </h3>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    
    {isSelected && (
      <div className="absolute top-4 right-4 text-primary">
        <CheckCircle2 className="w-5 h-5 fill-current text-white" />
      </div>
    )}
  </motion.div>
);
