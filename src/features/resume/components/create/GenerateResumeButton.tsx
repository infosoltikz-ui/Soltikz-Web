import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenerateResumeButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}

export const GenerateResumeButton: React.FC<GenerateResumeButtonProps> = ({ isLoading, disabled }) => {
  return (
    <div className="mt-8 mb-12">
      <motion.button
        type="submit"
        disabled={isLoading || disabled}
        whileHover={{ scale: (isLoading || disabled) ? 1 : 1.01 }}
        whileTap={{ scale: (isLoading || disabled) ? 1 : 0.99 }}
        className={`w-full bg-primary hover:bg-primary-hover text-white rounded-xl p-4 transition-all duration-200 ${
          isLoading || disabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 font-semibold text-base mb-0.5">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isLoading ? 'Generating ATS Resume...' : 'Generate Tailored Resume'}
          </div>
          <p className="text-white/90 text-sm">
            AI will analyze and create an ATS-optimized resume
          </p>
        </div>
      </motion.button>
    </div>
  );
};
