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
        className={`w-full relative group overflow-hidden rounded-xl p-0.5 transition-all duration-300 ${
          isLoading || disabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-primary/20'
        }`}
      >
        {/* Animated gradient border effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></span>
        
        {/* Button content */}
        <div className="relative bg-white/10 backdrop-blur-sm px-6 py-4 rounded-[11px] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-white font-semibold text-lg mb-1">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-yellow-300" />
            )}
            {isLoading ? 'Generating ATS Resume...' : 'Generate Tailored Resume'}
          </div>
          <p className="text-white/80 text-sm font-medium">
            AI will analyze and create an ATS-optimized resume.
          </p>
        </div>
      </motion.button>
    </div>
  );
};
