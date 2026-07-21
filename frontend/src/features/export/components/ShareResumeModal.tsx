import { FC, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { exportApi } from '../api/exportApi';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';

interface ShareResumeModalProps {
  resumeId: string;
}

export const ShareResumeModal: FC<ShareResumeModalProps> = ({ resumeId }) => {
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState<{ share: any, qrCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState('PUBLIC');

  const handleGenerateShare = async () => {
    try {
      setLoading(true);
      const data = await exportApi.createShareLink(resumeId, { type: shareType, expiresInDays: 30 });
      setShareData(data);
    } catch (error) {
      console.error('Failed to create share link', error);
      alert('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareData?.share?.url) {
      navigator.clipboard.writeText(shareData.share.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-900">Share Resume</h3>
      </div>
      
      {!shareData ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Generate a secure link to share your resume with recruiters or colleagues.</p>
          
          <select 
            value={shareType} 
            onChange={(e) => setShareType(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="PUBLIC">Public Link (Anyone with link)</option>
            <option value="PRIVATE">Private (Only you)</option>
          </select>

          <Button onClick={handleGenerateShare} disabled={loading} fullWidth className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            Generate Link
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-slate-700 truncate mr-4">{shareData.share.url}</span>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="shrink-0 gap-1">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          {shareData.qrCode && (
            <div className="flex flex-col items-center justify-center space-y-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-700">Scan to view on mobile</span>
              <img src={shareData.qrCode} alt="QR Code" className="w-32 h-32 border p-1 rounded-lg bg-white" />
            </div>
          )}
          
          <Button variant="ghost" fullWidth onClick={() => setShareData(null)}>
            Create New Link
          </Button>
        </div>
      )}
    </div>
  );
};
