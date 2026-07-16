import React from 'react';
import { Modal } from '@/components/ui/Overlay';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Archive, Trash2, Copy, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteResumeModal: React.FC<ActionModalProps & { isPermanent?: boolean }> = ({
  isOpen, onClose, onConfirm, isLoading, isPermanent
}) => (
  <Modal
    id="delete-resume"
    title={isPermanent ? "Delete Permanently" : "Move to Trash"}
    description={isPermanent 
      ? "Are you sure you want to permanently delete this resume? This action cannot be undone."
      : "Are you sure you want to move this resume to the trash? It will be automatically deleted after 30 days."}
  >
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} loading={isLoading}>
        <Trash2 className="w-4 h-4 mr-2" />
        {isPermanent ? "Delete Permanently" : "Move to Trash"}
      </Button>
    </div>
  </Modal>
);

export const ArchiveResumeModal: React.FC<ActionModalProps & { isArchiving: boolean }> = ({
  isOpen, onClose, onConfirm, isLoading, isArchiving
}) => (
  <Modal
    id="archive-resume"
    title={isArchiving ? "Archive Resume" : "Restore Resume"}
    description={isArchiving 
      ? "Archiving this resume will remove it from your active list. You can restore it at any time."
      : "Restoring this resume will move it back to your active list."}
  >
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
      <Button onClick={onConfirm} loading={isLoading}>
        <Archive className="w-4 h-4 mr-2" />
        {isArchiving ? "Archive" : "Restore"}
      </Button>
    </div>
  </Modal>
);

interface RenameModalProps extends ActionModalProps {
  currentTitle: string;
  onConfirmRename: (newTitle: string) => void;
}

export const RenameResumeModal: React.FC<RenameModalProps> = ({
  isOpen, onClose, onConfirmRename, isLoading, currentTitle
}) => {
  const [title, setTitle] = React.useState(currentTitle);

  React.useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  return (
    <Modal
      id="rename-resume"
      title="Rename Resume"
      description="Enter a new name for your resume."
    >
      <div className="mt-4">
        <Input 
          label="Resume Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          autoFocus
          placeholder="e.g. Senior Frontend Engineer"
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button 
          onClick={() => onConfirmRename(title)} 
          loading={isLoading}
          disabled={!title.trim() || title === currentTitle}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Rename
        </Button>
      </div>
    </Modal>
  );
};
