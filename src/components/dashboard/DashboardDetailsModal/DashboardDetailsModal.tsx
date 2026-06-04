import { useCallback, useEffect, useState } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { icons } from '../../../icons';
import {
  getDashboard,
  getAllTags,
  addTagToDashboard,
  removeTagFromDashboard,
  updateDashboard,
  type DashboardDetail,
  type DashboardTag,
} from '../../../services/dashboard/dashboardService';

export interface DashboardDetailsModalProps {
  dashboardId: string;
  isOwner: boolean;
  onClose: () => void;
  onIsPublicChange?: (dashboardId: string, isPublic: boolean) => void;
  /** Called when title is successfully updated so the parent list reflects it. */
  onTitleChange?: (dashboardId: string, title: string) => void;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SliderToggleProps {
  checked: boolean;
  onChange: () => void;
}

const SliderToggle = ({ checked, onChange }: SliderToggleProps) => {
  const EyeOnIcon = icons.eyeOn;
  const EyeOffIcon = icons.eyeOff;
  const EyeIcon = checked ? EyeOnIcon : EyeOffIcon;

  return (
    <div className="flex items-center gap-3">
      <span className="text-body-sm font-medium text-content-secondary">
        <EyeIcon size={15} aria-hidden="true" className="inline mr-1.5 align-middle" />
        {checked ? 'Público' : 'Privado'}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 p-0',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          checked ? 'bg-primary' : 'bg-border-strong',
        ].join(' ')}
      >
        <span className="sr-only">{checked ? 'Público' : 'Privado'}</span>
        <span
          className={[
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  );
};

interface TagChipProps {
  tag: DashboardTag;
  onRemove?: () => void;
}

const TagChip = ({ tag, onRemove }: TagChipProps) => (
  <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 bg-surface-sunken text-caption font-semibold text-content-secondary ring-1 ring-inset ring-border-subtle">
    <span
      className="h-2 w-2 rounded-full shrink-0"
      style={{ backgroundColor: tag.color.hex }}
      aria-hidden="true"
    />
    {tag.name}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-content-muted hover:text-danger border-0 bg-transparent cursor-pointer p-0 leading-none"
        aria-label={`Quitar etiqueta ${tag.name}`}
      >
        ×
      </button>
    )}
  </span>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const DashboardDetailsModal = ({
  dashboardId,
  isOwner,
  onClose,
  onIsPublicChange,
  onTitleChange,
}: DashboardDetailsModalProps) => {
  const CalendarIcon = icons.calendar;

  const [detail, setDetail] = useState<DashboardDetail | null>(null);
  const [allTags, setAllTags] = useState<DashboardTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Tag state
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagError, setTagError] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const [dashboard, tags] = await Promise.all([
        getDashboard(dashboardId),
        isOwner ? getAllTags() : Promise.resolve([]),
      ]);
      setDetail(dashboard);
      setAllTags(tags);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId, isOwner]);

  useEffect(() => {
    load();
  }, [load]);

  const enterEditMode = () => {
    if (!detail) return;
    setEditTitle(detail.title);
    setEditDescription(detail.description ?? '');
    setTitleError(null);
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTitleError(null);
    setSaveError(null);
    setShowTagPicker(false);
  };

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setTitleError('El título es obligatorio');
      return;
    }
    setTitleError(null);
    setSaveError(null);
    setIsSaving(true);
    try {
      await updateDashboard(dashboardId, {
        title: trimmedTitle,
        description: editDescription.trim() || undefined,
      });
      setDetail((prev) =>
        prev
          ? { ...prev, title: trimmedTitle, description: editDescription.trim() || null }
          : prev,
      );
      onTitleChange?.(dashboardId, trimmedTitle);
      setIsEditing(false);
      setShowTagPicker(false);
    } catch {
      setSaveError('No se pudo guardar. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublic = () => {
    if (!detail) return;
    const next = !detail.isPublic;
    setDetail((prev) => (prev ? { ...prev, isPublic: next } : prev));
    onIsPublicChange?.(dashboardId, next);
    // TODO: not persisted yet. PATCH /dashboard/{id} (UpdateDashboardDTO) has no
    // isPublic field; add it on the backend, then persist here like title/desc.
  };

  const handleAddTag = async (tag: DashboardTag) => {
    if (!detail) return;
    setTagError(false);
    try {
      await addTagToDashboard(dashboardId, tag.id);
      setDetail((prev) => (prev ? { ...prev, tags: [...prev.tags, tag] } : prev));
    } catch {
      setTagError(true);
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    if (!detail) return;
    setTagError(false);
    try {
      await removeTagFromDashboard(dashboardId, tagId);
      setDetail((prev) =>
        prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== tagId) } : prev,
      );
    } catch {
      setTagError(true);
    }
  };

  const availableToAdd = detail
    ? allTags.filter((t) => !detail.tags.some((dt) => dt.id === t.id))
    : [];

  // ----- Loading / error states -----
  if (isLoading || loadError || !detail) {
    return (
      <Modal onClose={onClose}>
        {isLoading ? (
          <p className="m-0 text-body-sm font-medium text-content-muted text-center py-4">
            Cargando detalles…
          </p>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="m-0 text-body-sm font-medium text-content-secondary text-center">
              No se pudieron cargar los detalles.
            </p>
            <Button variant="white" size="medium" label="Reintentar" onPress={load} />
          </div>
        )}
      </Modal>
    );
  }

  // ----- Edit mode -----
  if (isEditing) {
    return (
      <Modal
        title="Editar dashboard"
        onClose={cancelEdit}
        footer={
          <>
            <Button variant="white" size="medium" label="Cancelar" onPress={cancelEdit} disabled={isSaving} />
            <Button variant="blue" size="medium" label="Guardar" onPress={handleSave} isLoading={isSaving} />
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Título"
            placeholder="Nombre del dashboard"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            error={titleError ?? undefined}
            autoFocus
          />
          <div className="flex w-full flex-col gap-2">
            <label className="text-body-sm font-semibold text-content-primary" htmlFor="edit-description">
              Descripción (opcional)
            </label>
            <textarea
              id="edit-description"
              rows={3}
              placeholder="Breve descripción del dashboard"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full resize-none rounded-md bg-surface-raised px-3.5 py-3 text-body text-content-primary shadow-xs outline-none ring-1 ring-inset ring-border placeholder:text-content-muted transition-[background-color,box-shadow,color] duration-200 ease-out focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Visibility (TODO: not persisted — PATCH /dashboard/{id} has no isPublic) */}
          {isOwner && (
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-semibold text-content-primary">Visibilidad</span>
              <SliderToggle checked={detail.isPublic} onChange={handleTogglePublic} />
            </div>
          )}

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-sm font-semibold text-content-primary">Etiquetas</span>
              {availableToAdd.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTagPicker((v) => !v)}
                  className="text-caption font-semibold text-primary hover:underline border-0 bg-transparent cursor-pointer p-0"
                >
                  {showTagPicker ? 'Cerrar' : '+ Agregar'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 min-h-[28px]">
              {detail.tags.length > 0 ? (
                detail.tags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} onRemove={() => handleRemoveTag(tag.id)} />
                ))
              ) : (
                <span className="text-caption font-medium text-content-muted italic">Sin etiquetas</span>
              )}
            </div>

            {showTagPicker && availableToAdd.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 rounded-lg bg-surface-sunken p-3 ring-1 ring-inset ring-border-subtle">
                {availableToAdd.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 bg-surface-raised text-caption font-semibold text-content-secondary ring-1 ring-inset ring-border-subtle hover:bg-primary-subtle hover:text-primary hover:ring-primary/20 border-0 cursor-pointer transition-colors duration-150"
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color.hex }}
                      aria-hidden="true"
                    />
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {tagError && (
              <p className="mt-2 m-0 text-caption font-medium text-danger">
                No se pudo actualizar la etiqueta. Inténtalo de nuevo.
              </p>
            )}
          </div>

          {saveError && (
            <p className="m-0 text-body-sm font-medium text-danger">{saveError}</p>
          )}
        </div>
      </Modal>
    );
  }

  // ----- View mode -----
  return (
    <Modal title={detail.title} onClose={onClose}>
      {detail.description && (
        <p className="m-0 mb-5 text-body-sm font-medium text-content-secondary leading-relaxed">
          {detail.description}
        </p>
      )}

      <div className="flex flex-col divide-y divide-border-subtle border-t border-border-subtle">
        {detail.ownerName && (
          <div className="flex items-center justify-between py-3">
            <span className="text-body-sm font-medium text-content-secondary">Autor</span>
            <span className="text-body-sm font-semibold text-content-primary">{detail.ownerName}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-3">
          <span className="inline-flex items-center gap-2 text-body-sm font-medium text-content-secondary">
            <CalendarIcon size={15} aria-hidden="true" />
            Creado
          </span>
          <span className="text-body-sm font-semibold text-content-primary tabular-nums">
            {formatDate(detail.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-body-sm font-medium text-content-secondary">Visibilidad</span>
          <span className="text-body-sm font-semibold text-content-primary">
            {detail.isPublic ? 'Público' : 'Privado'}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="m-0 mb-2 text-caption font-semibold uppercase tracking-wide text-content-muted">
          Etiquetas
        </p>
        <div className="flex flex-wrap gap-2">
          {detail.tags.length > 0 ? (
            detail.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)
          ) : (
            <span className="text-caption font-medium text-content-muted italic">Sin etiquetas</span>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="mt-5 pt-4 border-t border-border-subtle flex justify-end">
          <Button variant="blue" size="medium" label="Editar" onPress={enterEditMode} />
        </div>
      )}
    </Modal>
  );
};
