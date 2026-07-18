import { FC, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { exportApi } from '../api/exportApi';
import { FileText, FileDown, Code, Download, Loader2 } from 'lucide-react';

interface ExportDialogProps {
  resumeId: string;
}

export const ExportDialog: FC<ExportDialogProps> = ({ resumeId }) => {
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string>('Inter');

  const handleExport = async (format: string) => {
    try {
      setLoadingFormat(format);
      const blob = await exportApi.exportResume(resumeId, format, { fontFamily: selectedFont });
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Failed to export ${format}:`, error);
      alert(`Failed to export ${format}`);
    } finally {
      setLoadingFormat(null);
    }
  };

  const exportOptions = [
    { format: 'PDF', icon: <FileText className="w-5 h-5 text-red-500" />, desc: 'Best for email and print' },
    { format: 'DOCX', icon: <FileDown className="w-5 h-5 text-blue-500" />, desc: 'Editable Word document' },
    { format: 'HTML', icon: <Code className="w-5 h-5 text-orange-500" />, desc: 'Web ready format' },
    { format: 'JSON', icon: <Code className="w-5 h-5 text-emerald-500" />, desc: 'Raw backup data' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Download className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Export Resume</h3>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Export Font Style</label>
        <select 
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        >
          <option value="Inter">Default (Inter)</option>
          <option value="Calibri">Calibri</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <p className="text-xs text-slate-500 mt-1">Applies specific Soltikz formatting rules for PDF/HTML.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exportOptions.map((opt) => (
          <button
            key={opt.format}
            onClick={() => handleExport(opt.format)}
            disabled={loadingFormat !== null}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="shrink-0 mt-1">
              {loadingFormat === opt.format ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : opt.icon}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{opt.format}</div>
              <div className="text-sm text-slate-500">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
