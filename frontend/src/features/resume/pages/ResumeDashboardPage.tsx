import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { 
  useResumes, 
  useCreateResume, 
  useDuplicateResume, 
  useArchiveResume, 
  useDeleteResume, 
  useToggleFavoriteResume,
  useUpdateResume
} from '../hooks/resume.queries';
import { ResumeList } from '../components/ResumeList';
import { 
  DeleteResumeModal, 
  ArchiveResumeModal, 
  RenameResumeModal 
} from '../components/ResumeModals';
import { ChooseResumeTypeModal } from '../components/ResumeModals/ChooseResumeTypeModal';
import { 
  Search, 
  Grid, 
  List as ListIcon, 
  Filter, 
  ArrowUpDown, 
  FileText, 
  FileEdit, 
  CheckCircle2, 
  Archive, 
  Star,
  Activity,
  BarChart3
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const ResumeDashboardPage: React.FC = () => {
  const { 
    viewMode, setViewMode, 
    searchQuery, setSearchQuery, 
    sortBy, setSortBy, 
    filterBy, setFilterBy 
  } = useResumeStore();

  const [page, setPage] = useState(1);
  const { data, isLoading } = useResumes({ 
    page, 
    limit: 12, 
    search: searchQuery, 
    sort: sortBy, 
    status: filterBy === 'ALL' || filterBy === 'FAVORITES' ? undefined : filterBy,
    favorite: filterBy === 'FAVORITES' ? true : undefined
  });

  const resumes = data?.resumes || [];
  const total = data?.pagination.total || 0;

  const createMutation = useCreateResume();
  const duplicateMutation = useDuplicateResume();
  const archiveMutation = useArchiveResume();
  const deleteMutation = useDeleteResume();
  const favoriteMutation = useToggleFavoriteResume();
  const updateMutation = useUpdateResume();

  const [modalState, setModalState] = useState<{
    type: 'create' | 'delete' | 'archive' | 'rename' | null;
    resumeId: string | null;
  }>({ type: null, resumeId: null });

  const activeResume = resumes.find(r => r.id === modalState.resumeId);

  // Simple statistics derived from current page or global if available
  // In a real app with large data, these would be separate API calls.
  // For Sprint 3.1, we show placeholders or derived stats.
  
  const stats = [
    { label: 'Total Resumes', value: total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Drafts', value: resumes.filter(r => r.status === 'DRAFT').length, icon: FileEdit, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'Ready', value: resumes.filter(r => r.status === 'READY').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Archived', value: resumes.filter(r => r.status === 'ARCHIVED').length, icon: Archive, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Favorites', value: resumes.filter(r => r.isFavorite).length, icon: Star, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Resumes</h1>
            <p className="text-slate-500 mt-1">Manage and track your application documents.</p>
          </div>
          <Button onClick={() => setModalState({ type: 'create', resumeId: null })}>
            + Create Resume
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Widgets Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" /> Recent Activity
            </h3>
          </div>
          <div className="h-40 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Activity Timeline (Coming in Sprint 3.2)
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" /> Completion Rate
            </h3>
          </div>
          <div className="h-40 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Analytics Graph (Coming in Sprint 3.2)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search resumes or templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 py-1 pl-2 pr-8 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="READY">Ready</option>
              <option value="ARCHIVED">Archived</option>
              <option value="TRASH">Trash</option>
              <option value="FAVORITES">Favorites</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
            <ArrowUpDown className="w-4 h-4 text-slate-400 ml-2" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 py-1 pl-1 pr-8 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="completion">Completion %</option>
            </select>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <ResumeList
        resumes={resumes}
        isLoading={isLoading}
        onCreateNew={() => setModalState({ type: 'create', resumeId: null })}
        onDuplicate={(id) => duplicateMutation.mutate(id)}
        onArchive={(id) => setModalState({ type: 'archive', resumeId: id })}
        onDelete={(id) => setModalState({ type: 'delete', resumeId: id })}
        onToggleFavorite={(id) => favoriteMutation.mutate(id)}
        onRename={(id) => setModalState({ type: 'rename', resumeId: id })}
      />

      {/* Modals */}
      <DeleteResumeModal
        isOpen={modalState.type === 'delete'}
        onClose={() => setModalState({ type: null, resumeId: null })}
        onConfirm={() => {
          if (modalState.resumeId) deleteMutation.mutate(modalState.resumeId);
          setModalState({ type: null, resumeId: null });
        }}
        isPermanent={activeResume?.deletedAt !== null && activeResume?.deletedAt !== undefined}
      />

      <ArchiveResumeModal
        isOpen={modalState.type === 'archive'}
        onClose={() => setModalState({ type: null, resumeId: null })}
        onConfirm={() => {
          if (modalState.resumeId) archiveMutation.mutate(modalState.resumeId);
          setModalState({ type: null, resumeId: null });
        }}
        isArchiving={!activeResume?.isArchived}
      />

      {modalState.type === 'rename' && activeResume && (
        <RenameResumeModal
          isOpen={true}
          currentTitle={activeResume.title}
          onClose={() => setModalState({ type: null, resumeId: null })}
          onConfirm={() => {}}
          onConfirmRename={(title) => {
            updateMutation.mutate({ id: activeResume.id, data: { title } });
            setModalState({ type: null, resumeId: null });
          }}
          isLoading={updateMutation.isPending}
        />
      )}

      <ChooseResumeTypeModal 
        isOpen={modalState.type === 'create'} 
        onClose={() => setModalState({ type: null, resumeId: null })} 
      />
    </div>
  );
};
