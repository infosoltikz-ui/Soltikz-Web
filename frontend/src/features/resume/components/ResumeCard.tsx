import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Star, 
  Copy, 
  Archive, 
  Trash2, 
  Edit2,
  ExternalLink,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Resume } from '../services/resume.api';
import { Badge } from '@/components/ui/Badge';

interface ResumeCardProps {
  resume: Resume;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRename: (id: string) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onDuplicate,
  onArchive,
  onDelete,
  onToggleFavorite,
  onRename,
}) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'READY': return { variant: 'success', icon: CheckCircle2, text: 'Ready' };
      case 'IN_PROGRESS': return { variant: 'primary', icon: Clock, text: 'In Progress' };
      case 'ARCHIVED': return { variant: 'secondary', icon: Archive, text: 'Archived' };
      default: return { variant: 'outline', icon: FileText, text: 'Draft' };
    }
  };

  const statusConfig = getStatusConfig(resume.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-[1/1.1] bg-slate-50 border-b border-slate-100 overflow-hidden">
        {resume.template?.thumbnail ? (
          <img 
            src={resume.template.thumbnail} 
            alt={resume.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
            <FileText className="w-12 h-12 text-slate-300" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <Link 
            to={`/dashboard/resumes/${resume.id}`}
            className="px-6 py-2.5 bg-white text-slate-900 font-medium rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Resume
          </Link>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(resume.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-sm backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
        >
          <Star 
            className={cn(
              "w-4 h-4 transition-colors", 
              resume.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400 group-hover:text-slate-600"
            )} 
          />
        </button>

        {/* Completion Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${resume.completionPercentage}%` }}
            className={cn(
              "h-full",
              resume.completionPercentage === 100 ? "bg-emerald-500" : "bg-primary-500"
            )}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link to={`/dashboard/resumes/${resume.id}`} className="block group/title">
              <h3 className="font-semibold text-slate-900 text-lg truncate group-hover/title:text-primary-600 transition-colors">
                {resume.title}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 mt-1 truncate flex items-center gap-2">
              <span>{resume.template?.name || 'Blank Template'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{resume.completionPercentage}% Complete</span>
            </p>
          </div>

          {/* Quick Actions Dropdown */}
          <div className="relative" ref={actionsRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden"
                >
                  <Link 
                    to={`/dashboard/resumes/${resume.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors w-full text-left"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Editor
                  </Link>
                  <button 
                    onClick={() => { setShowActions(false); onRename(resume.id); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <Edit2 className="w-4 h-4" /> Rename
                  </button>
                  <button 
                    onClick={() => { setShowActions(false); onDuplicate(resume.id); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <Copy className="w-4 h-4" /> Duplicate
                  </button>
                  <button 
                    onClick={() => { setShowActions(false); onArchive(resume.id); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <Archive className="w-4 h-4" /> {resume.isArchived ? 'Restore' : 'Archive'}
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button 
                    onClick={() => { setShowActions(false); onDelete(resume.id); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full text-left font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100/60">
          <Badge variant={statusConfig.variant as any} className="flex items-center gap-1.5 px-2.5 py-1">
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig.text}
          </Badge>
          <div className="text-xs text-slate-400 font-medium">
            Updated {formatDate(resume.updatedAt)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
