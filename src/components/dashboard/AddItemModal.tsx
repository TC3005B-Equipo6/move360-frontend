import { useState } from "react";
import { TrendingUp, BarChart2 } from "lucide-react";
import { Modal } from "../common/Modal/Modal";
import { Button } from "../common/Button/Button";
import SegmentedControl from "../common/SegmentedControl/SegmentedControl";

export type AddItemChoice = "indicator" | "chart";

interface Props {
  onSelect: (choice: AddItemChoice) => void;
  onClose: () => void;
}

export const AddItemModal = ({ onSelect, onClose }: Props) => {
  const [choice, setChoice] = useState<AddItemChoice>("indicator");

  return (
    <Modal title="Selecciona un tipo" onClose={onClose} className="w-[320px]">
      <div className="flex flex-col items-center gap-4 py-1">
        <SegmentedControl
          value={choice}
          onChange={(v) => setChoice(v as AddItemChoice)}
          options={[
            { label: "Indicador", value: "indicator", icon: <TrendingUp size={18} /> },
            { label: "Gráfica", value: "chart", icon: <BarChart2 size={18} /> },
          ]}
        />
        <Button label="Continuar" onPress={() => onSelect(choice)} />
      </div>
    </Modal>
  );
};
