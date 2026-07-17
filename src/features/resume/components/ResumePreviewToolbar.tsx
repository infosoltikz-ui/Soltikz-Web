import React, { useState } from 'react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { ZoomIn, ZoomOut, Maximize, FileDown, Printer, Palette, LayoutTemplate, Settings2 } from 'lucide-react';
import { useUpdateTemplate, useUpdateTheme, useUpdateTypography, useUpdateLayout } from '../hooks/resume.queries';

interface ToolbarProps {
  resumeId: string;
  onOpenGallery: () => void;
}

export const ResumePreviewToolbar: React.FC<ToolbarProps> = ({ resumeId, onOpenGallery }) => {
  const { previewZoom, setPreviewZoom, liveSettings, setLiveSettings } = useResumeBuilderStore();
  const [showSettings, setShowSettings] = useState(false);

  const updateTheme = useUpdateTheme();
  const updateTypography = useUpdateTypography();
  const updateLayout = useUpdateLayout();

  const handleZoomIn = () => setPreviewZoom(Math.min(previewZoom + 25, 200));
  const handleZoomOut = () => setPreviewZoom(Math.max(previewZoom - 25, 50));
  const handleFitPage = () => setPreviewZoom(100);

  const handlePrint = () => {
    window.print();
  };

  const fonts = ['inter', 'roboto', 'poppins', 'lato', 'opensans', 'merriweather', 'georgia', 'times'];
  const themes = [
    { name: 'Corporate Blue', color: '#2563eb' },
    { name: 'Emerald', color: '#16a34a' },
    { name: 'Slate', color: '#475569' },
    { name: 'Crimson', color: '#dc2626' },
    { name: 'Purple', color: '#9333ea' },
    { name: 'Monochrome', color: '#171717' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2 z-10 sticky top-0 shadow-sm print:hidden">
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenGallery}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-sm font-medium transition-colors"
        >
          <LayoutTemplate className="w-4 h-4" /> Templates
        </button>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showSettings ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 hover:bg-slate-200'}`}
        >
          <Palette className="w-4 h-4" /> Theme
        </button>
      </div>

      {showSettings && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 shadow-lg rounded-lg p-4 flex flex-col md:flex-row gap-6 z-20">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Theme Presets</p>
            <div className="flex flex-wrap gap-2">
              {themes.map(theme => (
                <button
                  key={theme.name}
                  title={theme.name}
                  className={`w-6 h-6 rounded-full border-2 ${liveSettings.primaryColor === theme.color ? 'border-slate-800' : 'border-transparent'}`}
                  style={{ backgroundColor: theme.color }}
                  onClick={() => {
                    setLiveSettings({ primaryColor: theme.color });
                    updateTheme.mutate({ id: resumeId, data: { primaryColor: theme.color } });
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Typography</p>
            <select 
              className="text-sm border-slate-300 rounded-md"
              value={liveSettings.fontFamily || 'inter'}
              onChange={(e) => {
                setLiveSettings({ fontFamily: e.target.value });
                updateTypography.mutate({ id: resumeId, data: { fontFamily: e.target.value } });
              }}
            >
              {fonts.map(f => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Layout Density</p>
            <select 
              className="text-sm border-slate-300 rounded-md"
              value={liveSettings.sectionSpacing || 'comfortable'}
              onChange={(e) => {
                setLiveSettings({ sectionSpacing: e.target.value });
                updateLayout.mutate({ id: resumeId, data: { sectionSpacing: e.target.value } });
              }}
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
        <button onClick={handleZoomOut} className="p-1 hover:bg-white rounded text-slate-600"><ZoomOut className="w-4 h-4" /></button>
        <span className="text-xs font-medium w-12 text-center">{previewZoom}%</span>
        <button onClick={handleZoomIn} className="p-1 hover:bg-white rounded text-slate-600"><ZoomIn className="w-4 h-4" /></button>
        <div className="w-[1px] h-4 bg-slate-300 mx-1" />
        <button onClick={handleFitPage} title="Fit Page" className="p-1 hover:bg-white rounded text-slate-600"><Maximize className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors">
          <Printer className="w-4 h-4" /> Print
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors opacity-50 cursor-not-allowed" title="Sprint 7 Feature">
          <FileDown className="w-4 h-4" /> Export PDF
        </button>
      </div>
    </div>
  );
};
