import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeCard } from './ResumeCard';
import { Resume } from '../services/resume.api';
import { useResumeStore } from '../store/useResumeStore';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResumeListProps {
  resumes: Resume[];
  isLoading: boolean;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRename: (id: string) => void;
  onCreateNew: () => void;
}

export const ResumeList: React.FC<ResumeListProps> = ({
  resumes,
  isLoading,
  onDuplicate,
  onArchive,
  onDelete,
  onToggleFavorite,
  onRename,
  onCreateNew
}) => {
  const viewMode = useResumeStore((state) => state.viewMode);

  if (isLoading) {
    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "flex flex-col gap-4"
      }>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
            <div className="aspect-[1/1.1] bg-slate-100 rounded-xl mb-4" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-48 h-48 mb-8 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-primary-100/50 rounded-full blur-3xl" />
          <div className="relative bg-white p-8 rounded-3xl shadow-xl shadow-primary-500/10 border border-primary-100/50 rotate-[-5deg]">
            <FileText className="w-16 h-16 text-primary-500" />
            <div className="absolute -right-4 -bottom-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg rotate-[10deg]">
              <Plus className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          You haven't created your first resume.
        </h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          Create a professional ATS-friendly resume in less than 2 minutes.
        </p>
        
        <Button size="lg" onClick={onCreateNew} className="rounded-full px-8 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30">
          Create Resume
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "flex flex-col gap-4"
      }
    >
      <AnimatePresence mode="popLayout">
        {resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onRename={onRename}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
