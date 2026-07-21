import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SuggestionCardProps {
  id?: string;
  type: string;
  currentText: string;
  suggestedText: string;
  reason: string;
  atsImpact: 'High' | 'Medium' | 'Low' | string;
  onAccept: (editedText: string) => void;
  onReject: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  type,
  currentText,
  suggestedText,
  reason,
  atsImpact,
  onAccept,
  onReject
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSuggestion, setEditedSuggestion] = useState(suggestedText);

  const handleAccept = () => {
    onAccept(editedSuggestion);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-4"
    >
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {type} Optimization
            </span>
            <Badge variant="neutral" className={`text-xs ${getImpactColor(atsImpact)}`}>
              {atsImpact} Impact
            </Badge>
          </div>
          <p className="text-sm text-slate-600 flex items-start gap-1.5 mt-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{reason}</span>
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase">Current</span>
          <p className="text-sm text-slate-600 mt-1 line-through opacity-70">
            {currentText || 'No existing content'}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-emerald-600 uppercase">Suggested</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-slate-500"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-3 h-3 mr-1" />
              {isEditing ? 'Cancel Edit' : 'Edit Suggestion'}
            </Button>
          </div>
          
          {isEditing ? (
            <textarea
              value={editedSuggestion}
              onChange={(e) => setEditedSuggestion(e.target.value)}
              className="w-full min-h-[80px] text-sm mt-1 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <p className="text-sm text-slate-900 mt-1 bg-emerald-50 p-3 rounded border border-emerald-100">
              {editedSuggestion}
            </p>
          )}
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onReject} className="text-slate-600">
          <X className="w-4 h-4 mr-1" />
          Reject
        </Button>
        <Button variant="primary" size="sm" onClick={handleAccept} className="bg-emerald-600 hover:bg-emerald-700">
          <Check className="w-4 h-4 mr-1" />
          Accept & Apply
        </Button>
      </div>
    </motion.div>
  );
};
