import { useMemo, type RefObject } from "react";
import { AdminBulkActionBar } from "@/components/admin/AdminBulkActionBar";
import { AdminCompetitionEditorPanel } from "@/components/admin/AdminCompetitionEditorPanel";
import { AdminCompetitionListPanel } from "@/components/admin/AdminCompetitionListPanel";
import type {
  AdminCompetitionStatusFilter,
  EditableCompetitionField,
  EditableCompetitionLink,
} from "@/components/admin/AdminCompetitionManager.utils";
import type { Competition, CompetitionStatus } from "@/lib/types";
import { getCompetitionStatus, getDaysUntilDeadline } from "@/lib/utils/competitions";

interface AdminCompetitionWorkspaceProps {
  competitions: Competition[];
  filteredCompetitions: Competition[];
  selectedCompetition: Competition | null;
  selectedIds: Set<string>;
  selectedValidationErrors: string[];
  selectedPriorityOrder: number | null;
  isSingleEventDate: boolean;
  now: Date;
  isMutationPending: boolean;
  dataStatusMessage?: string | null;
  openCompetitions: number;
  comingSoonCompetitions: number;
  closedCompetitions: number;
  searchValue: string;
  categoryFilterValue: string;
  statusFilterValue: AdminCompetitionStatusFilter;
  availableCategoryFilters: string[];
  priorityOrderByCompetitionId: Map<string, number>;
  syncedListMaxHeight: number | null;
  priorityCompetitionsCount: number;
  hasUnsavedChanges: boolean;
  saveMessage: string;
  regStartInputRef: RefObject<HTMLInputElement | null>;
  regEndInputRef: RefObject<HTMLInputElement | null>;
  eventStartInputRef: RefObject<HTMLInputElement | null>;
  eventEndInputRef: RefObject<HTMLInputElement | null>;
  editorPanelRef: RefObject<HTMLElement | null>;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: AdminCompetitionStatusFilter) => void;
  onAddCompetition: () => void;
  onSelectCompetition: (competitionId: string) => void;
  onFieldChange: (field: EditableCompetitionField, value: string) => void;
  onLinkChange: (field: EditableCompetitionLink, value: string) => void;
  onSave: () => void;
  onDuplicateCompetition: () => void;
  onResetDraft: () => void;
  onDeleteCompetition: () => void;
  onTogglePriority: () => void;
  onEventDateModeChange: (mode: "single" | "range") => void;
  openDatePicker: (inputElement: HTMLInputElement | null) => void;
  onToggleSelect: (competitionId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: CompetitionStatus) => void;
  onBulkSetPriority: () => void;
  onBulkRemovePriority: () => void;
  onExportCsv: () => void;
  onAutoFixStatus: () => void;
}

export function AdminCompetitionWorkspace({
  competitions,
  filteredCompetitions,
  selectedCompetition,
  selectedIds,
  selectedValidationErrors,
  selectedPriorityOrder,
  isSingleEventDate,
  now,
  isMutationPending,
  dataStatusMessage = null,
  openCompetitions,
  comingSoonCompetitions,
  closedCompetitions,
  searchValue,
  categoryFilterValue,
  statusFilterValue,
  availableCategoryFilters,
  priorityOrderByCompetitionId,
  syncedListMaxHeight,
  priorityCompetitionsCount,
  hasUnsavedChanges,
  saveMessage,
  regStartInputRef,
  regEndInputRef,
  eventStartInputRef,
  eventEndInputRef,
  editorPanelRef,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onAddCompetition,
  onSelectCompetition,
  onFieldChange,
  onLinkChange,
  onSave,
  onDuplicateCompetition,
  onResetDraft,
  onDeleteCompetition,
  onTogglePriority,
  onEventDateModeChange,
  openDatePicker,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  onBulkSetPriority,
  onBulkRemovePriority,
  onExportCsv,
  onAutoFixStatus,
}: AdminCompetitionWorkspaceProps) {
  const staleOpenCompetitions = useMemo(
    () =>
      competitions.filter((c) => {
        const status = getCompetitionStatus(c, now);
        return status === "open" && c.regEnd && c.regEnd < now.toISOString().split("T")[0];
      }),
    [competitions, now],
  );

  const staleComingSoonCompetitions = useMemo(
    () =>
      competitions.filter((c) => {
        const status = getCompetitionStatus(c, now);
        return status === "coming-soon" && c.regStart && c.regStart <= now.toISOString().split("T")[0];
      }),
    [competitions, now],
  );

  const urgentCompetitions = useMemo(
    () =>
      competitions.filter((c) => {
        const daysLeft = getDaysUntilDeadline(c.regEnd, now);
        return daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
      }),
    [competitions, now],
  );

  const hasStatusIssues = staleOpenCompetitions.length > 0 || staleComingSoonCompetitions.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-center backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Total data
          </p>
          <p className="mt-2 text-[1.8rem] font-semibold text-zinc-50 sm:text-[2rem]">
            {competitions.length}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-emerald-300/18 bg-emerald-300/10 px-5 py-4 text-center backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-100/75">
            Masih buka
          </p>
          <p className="mt-2 text-[1.8rem] font-semibold text-emerald-50 sm:text-[2rem]">
            {openCompetitions}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-sky-300/18 bg-sky-300/10 px-5 py-4 text-center backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-sky-100/75">
            Coming Soon
          </p>
          <p className="mt-2 text-[1.8rem] font-semibold text-sky-50 sm:text-[2rem]">
            {comingSoonCompetitions}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-rose-300/18 bg-rose-300/10 px-5 py-4 text-center backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-rose-100/75">
            Sudah tutup
          </p>
          <p className="mt-2 text-[1.8rem] font-semibold text-rose-50 sm:text-[2rem]">
            {closedCompetitions}
          </p>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:text-zinc-100"
        >
          Export CSV
        </button>
      </div>

      {hasStatusIssues ? (
        <section className="rounded-[1.25rem] border border-rose-300/18 bg-rose-300/10 px-4 py-3 backdrop-blur-md sm:px-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-rose-50">
                Ditemukan data dengan status tidak sesuai
              </p>
              <p className="mt-1 text-xs text-rose-200/70">
                {staleOpenCompetitions.length > 0
                  ? `${staleOpenCompetitions.length} kompetisi masih \u201CMasih buka\u201D tapi sudah lewat deadline. ` : null}
                {staleComingSoonCompetitions.length > 0
                  ? `${staleComingSoonCompetitions.length} kompetisi masih \u201CComing Soon\u201D tapi sudah waktunya dibuka. ` : null}
                {urgentCompetitions.length > 0 && staleOpenCompetitions.length === 0 && staleComingSoonCompetitions.length === 0
                  ? `${urgentCompetitions.length} kompetisi deadline-nya tinggal kurang dari 7 hari. ` : null}
              </p>
            </div>
            <button
              type="button"
              onClick={onAutoFixStatus}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-rose-200/20 bg-rose-200/10 px-4 text-xs font-semibold uppercase tracking-wide text-rose-100 transition hover:border-rose-200/32 hover:bg-rose-200/14"
            >
              Perbarui otomatis
            </button>
          </div>
        </section>
      ) : null}

      {urgentCompetitions.length > 0 && !hasStatusIssues ? (
        <section className="rounded-[1.25rem] border border-amber-200/14 bg-amber-200/8 px-4 py-3 text-sm text-amber-50 backdrop-blur-md sm:px-5">
          <p>{urgentCompetitions.length} kompetisi deadline-nya tinggal kurang dari 7 hari.</p>
        </section>
      ) : null}

      {dataStatusMessage ? (
        <section className="rounded-[1.25rem] border border-amber-200/14 bg-amber-200/8 px-4 py-3 text-sm text-amber-50 backdrop-blur-md sm:px-5">
          <p>{dataStatusMessage}</p>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.35fr)] xl:items-start">
        <AdminCompetitionListPanel
          competitions={competitions}
          filteredCompetitions={filteredCompetitions}
          selectedCompetition={selectedCompetition}
          selectedIds={selectedIds}
          now={now}
          isMutationPending={isMutationPending}
          searchValue={searchValue}
          categoryFilterValue={categoryFilterValue}
          statusFilterValue={statusFilterValue}
          availableCategoryFilters={availableCategoryFilters}
          priorityOrderByCompetitionId={priorityOrderByCompetitionId}
          syncedListMaxHeight={syncedListMaxHeight}
          onSearchChange={onSearchChange}
          onCategoryFilterChange={onCategoryFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onAddCompetition={onAddCompetition}
          onSelectCompetition={onSelectCompetition}
          onToggleSelect={onToggleSelect}
          onSelectAll={onSelectAll}
        />

        <AdminCompetitionEditorPanel
          selectedCompetition={selectedCompetition}
          selectedValidationErrors={selectedValidationErrors}
          selectedPriorityOrder={selectedPriorityOrder}
          isSingleEventDate={isSingleEventDate}
          isMutationPending={isMutationPending}
          priorityCompetitionsCount={priorityCompetitionsCount}
          hasUnsavedChanges={hasUnsavedChanges}
          saveMessage={saveMessage}
          now={now}
          editorPanelRef={editorPanelRef}
          regStartInputRef={regStartInputRef}
          regEndInputRef={regEndInputRef}
          eventStartInputRef={eventStartInputRef}
          eventEndInputRef={eventEndInputRef}
          onFieldChange={onFieldChange}
          onLinkChange={onLinkChange}
          onSave={onSave}
          onAddCompetition={onAddCompetition}
          onDuplicateCompetition={onDuplicateCompetition}
          onResetDraft={onResetDraft}
          onDeleteCompetition={onDeleteCompetition}
          onTogglePriority={onTogglePriority}
          onEventDateModeChange={onEventDateModeChange}
          openDatePicker={openDatePicker}
        />
      </section>

      <AdminBulkActionBar
        selectedCount={selectedIds.size}
        isPending={isMutationPending}
        onBulkDelete={onBulkDelete}
        onBulkStatusChange={onBulkStatusChange}
        onBulkSetPriority={onBulkSetPriority}
        onBulkRemovePriority={onBulkRemovePriority}
        onClearSelection={onClearSelection}
      />
    </div>
  );
}
