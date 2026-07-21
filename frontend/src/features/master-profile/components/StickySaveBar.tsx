import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickySaveBarProps {
  saveStatus: 'idle' | 'saving' | 'saved';
  onSaveDraft: () => void;
  onSaveProfile: () => void;
  onCancel: () => void;
}

export const StickySaveBar: React.FC<StickySaveBarProps> = ({
  saveStatus,
  onSaveDraft,
  onSaveProfile,
  onCancel
}) => {
  const { formState: { isDirty } } = useFormContext();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 lg:left-[var(--sidebar-width)] bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-blue-500 font-medium">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}
            
            {saveStatus === 'saved' && !isDirty && (
              <div className="flex items-center gap-2 text-green-500 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                All changes saved
              </div>
            )}

            {isDirty && saveStatus !== 'saving' && (
              <div className="flex items-center gap-2 text-amber-600 font-medium">
                <AlertCircle className="w-5 h-5" />
                Unsaved changes
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={onSaveProfile}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
