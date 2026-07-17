import React, { useState } from 'react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { Resume } from '../services/resume.api';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ResumePreviewToolbar } from './ResumePreviewToolbar';
import { TemplateGallery } from './TemplateGallery';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { showMobilePreview, previewZoom } = useResumeBuilderStore();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <div className={`flex-col flex-1 bg-slate-100/80 overflow-y-auto ${!showMobilePreview ? 'hidden md:flex' : 'flex'} relative`}>
        
        {/* Toolbar */}
        <ResumePreviewToolbar 
          resumeId={resume.id}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />

        {/* Zoom & Centering Container */}
        <div className="flex-1 flex justify-center items-start p-4 md:p-8 min-h-0 print:p-0 print:block">
          
          {/* A4 Paper Wrapper (210mm x 297mm approx ratio) */}
          <div 
            className="bg-white shadow-md ring-1 ring-slate-900/5 sm:rounded-sm transition-transform origin-top print:shadow-none print:ring-0 print:rounded-none"
            style={{ 
              width: '794px',
              minHeight: '1123px',
              transform: `scale(${previewZoom / 100})`,
              marginBottom: `${Math.max(0, (previewZoom / 100 - 1) * 1123)}px`, // prevent cropping when zoomed
            }}
          >
            <TemplateRenderer resume={resume} />
          </div>

        </div>
      </div>

      <TemplateGallery 
        resumeId={resume.id} 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
      />
    </>
  );
};
