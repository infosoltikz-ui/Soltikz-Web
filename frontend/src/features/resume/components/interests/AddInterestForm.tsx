import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useCreateInterest } from '../../hooks/resume.queries';

const CATEGORIES = ['Sports', 'Technology', 'Travel', 'Reading', 'Music', 'Art', 'Community', 'Other'] as const;

interface AddInterestFormProps {
  resumeId: string;
}

export const AddInterestForm: React.FC<AddInterestFormProps> = ({ resumeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [interest, setInterest] = useState('');
  const [category, setCategory] = useState<string>('Other');
  const { mutate: createInterest, isPending } = useCreateInterest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interest.trim()) return;
    createInterest(
      { id: resumeId, data: { interest: interest.trim(), category } },
      {
        onSuccess: () => {
          setInterest('');
          setCategory('Other');
          setIsOpen(false);
        },
      }
    );
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-primary-300 text-primary-600 rounded-full text-sm hover:bg-primary-50 hover:border-primary-400 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Interest
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <input
        autoFocus
        type="text"
        value={interest}
        onChange={e => setInterest(e.target.value)}
        placeholder="e.g. Mountain Hiking"
        className="flex-1 min-w-[140px] px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none text-sm bg-white"
        maxLength={100}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none text-sm bg-white"
      >
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !interest.trim()}
          className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
