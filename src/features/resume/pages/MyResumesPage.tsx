import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ResumeCreationWizard } from '../components/ResumeCreationWizard';
import {
  Search,
  Grid,
  List as ListIcon,
  ArrowUpDown,
  FileText,
  Plus,
  SlidersHorizontal,
  Star,
  Inbox,
  Archive,
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

const FILTER_TABS = [
  { value: 'ALL',       label: 'All',       icon: FileText },
  { value: 'DRAFT',     label: 'Drafts',    icon: Inbox },
  { value: 'READY',     label: 'Ready',     icon: FileText },
  { value: 'ARCHIVED',  label: 'Archived',  icon: Archive },
  { value: 'FAVORITES', label: 'Favorites', icon: Star },
];

export const MyResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    filterBy, setFilterBy,
  } = useResumeStore();

  const [page, setPage] = useState(1);

  const { data, isLoading } = useResumes({
    page,
    limit: 12,
    search: searchQuery,
    sort: sortBy,
    status: filterBy === 'ALL' || filterBy === 'FAVORITES' ? undefined : filterBy,
    favorite: filterBy === 'FAVORITES' ? true : undefined,
  });

  const resumes = data?.resumes || [];
  const total   = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  const createMutation    = useCreateResume();
  const duplicateMutation = useDuplicateResume();
  const archiveMutation   = useArchiveResume();
  const deleteMutation    = useDeleteResume();
  const favoriteMutation  = useToggleFavoriteResume();
  const updateMutation    = useUpdateResume();

  const [modalState, setModalState] = useState<{
    type: 'create' | 'delete' | 'archive' | 'rename' | null;
    resumeId: string | null;
  }>({ type: null, resumeId: null });

  const activeResume = resumes.find(r => r.id === modalState.resumeId);

  const handleCreateClick = () => {
    setModalState({ type: 'create', resumeId: null });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Resumes</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading ? 'Loading…' : `${total} resume${total !== 1 ? 's' : ''} in your library`}
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            {createMutation.isPending ? 'Creating…' : 'New Resume'}
          </button>
        </div>

        {/* ── Filter Tabs ─────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit overflow-x-auto">
          {FILTER_TABS.map(tab => {
            const Icon = tab.icon;
            const active = filterBy === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => { setFilterBy(tab.value as any); setPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150
                  ${active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Toolbar ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-3 shadow-sm">

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search resumes…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm font-medium text-slate-700 border-none focus:ring-0 cursor-pointer pr-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="updated">Updated</option>
                <option value="alphabetical">A–Z</option>
                <option value="completion">Completion</option>
              </select>
            </div>

            {/* View mode */}
            <div className="flex bg-slate-100 p-1 rounded-lg gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid view"
                className={`p-1.5 rounded-md transition-colors
                  ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List view"
                className={`p-1.5 rounded-md transition-colors
                  ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Resume Grid / List ──────────────────────────── */}
        <ResumeList
          resumes={resumes}
          isLoading={isLoading}
          onCreateNew={handleCreateClick}
          onDuplicate={id => duplicateMutation.mutate(id)}
          onArchive={id => setModalState({ type: 'archive', resumeId: id })}
          onDelete={id => setModalState({ type: 'delete', resumeId: id })}
          onToggleFavorite={id => favoriteMutation.mutate(id)}
          onRename={id => setModalState({ type: 'rename', resumeId: id })}
        />

        {/* ── Pagination ──────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 bg-white
                         hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 bg-white
                         hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────── */}
      <ResumeCreationWizard
        isOpen={modalState.type === 'create'}
        onClose={() => setModalState({ type: null, resumeId: null })}
      />

      <DeleteResumeModal
        isOpen={modalState.type === 'delete'}
        onClose={() => setModalState({ type: null, resumeId: null })}
        onConfirm={() => {
          if (modalState.resumeId) deleteMutation.mutate(modalState.resumeId);
          setModalState({ type: null, resumeId: null });
        }}
        isPermanent={!!activeResume?.deletedAt}
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
          onConfirmRename={title => {
            updateMutation.mutate({ id: activeResume.id, data: { title } });
            setModalState({ type: null, resumeId: null });
          }}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
};
