import { useState } from "react";
import { Modal } from "../common/Modal/Modal";
import { Button } from "../common/Button/Button";
import { Input } from "../common/Input/Input";
import SegmentedControl from "../common/SegmentedControl/SegmentedControl";
import { icons } from "../../icons";
import { createDashboard, type UserDashboardSummary } from "../../services/dashboard/dashboardService";

interface Props {
  onClose: () => void;
  onCreated: (dashboard: UserDashboardSummary) => void;
}

const EyeOn = icons.eyeOn;
const EyeOff = icons.eyeOff;

export const CreateDashboardModal = ({ onClose, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("El título es obligatorio");
      return;
    }
    setTitleError(null);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await createDashboard({
        title: trimmed,
        description: description.trim() || undefined,
        isPublic: visibility === "public",
      });
      onCreated(created);
    } catch {
      setSubmitError("No se pudo crear el dashboard. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Nuevo dashboard"
      onClose={onClose}
      footer={
        <>
          <Button variant="white" size="medium" label="Cancelar" onPress={onClose} disabled={isSubmitting} />
          <Button variant="blue" size="medium" label="Crear" onPress={handleCreate} isLoading={isSubmitting} />
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Título"
          placeholder="Movilidad 2025-2026"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError ?? undefined}
          autoFocus
        />
        <Input
          label="Descripción (opcional)"
          placeholder="Breve descripción del dashboard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <SegmentedControl
          label="Visibilidad"
          value={visibility}
          onChange={(v) => setVisibility(v as "private" | "public")}
          options={[
            { label: "Privado", value: "private", icon: <EyeOff size={18} /> },
            { label: "Público", value: "public", icon: <EyeOn size={18} /> },
          ]}
        />
        {submitError && <p className="m-0 text-body-sm font-medium text-danger">{submitError}</p>}
      </div>
    </Modal>
  );
};
