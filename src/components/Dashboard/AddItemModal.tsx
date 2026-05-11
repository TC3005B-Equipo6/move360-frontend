import { Modal } from "../Modal/Modal";
import { icons } from "../../icons";
import type { ItemType } from "./grid.config";
import { ITEM_SIZES } from "./grid.config";

interface Props {
  onSelect: (type: ItemType) => void;
  onClose: () => void;
}

const options: { type: ItemType; label: string; iconName: keyof typeof icons }[] = [
  { type: "indicator", label: "Indicador", iconName: "checkCircle" },
  { type: "chartSm", label: "Gráfica pequeña", iconName: "piechart" },
  { type: "chartMd", label: "Gráfica mediana", iconName: "barchart" },
  { type: "chartLg", label: "Gráfica grande", iconName: "barchart" },
];

export const AddItemModal = ({ onSelect, onClose }: Props) => {
  return (
    <Modal title="Agregar elemento" onClose={onClose} className="w-[520px]">
      <div className="grid grid-cols-2 gap-4 font-[Inter,sans-serif]">
        {options.map((opt) => {
          const Icon = icons[opt.iconName];
          const { w, h } = ITEM_SIZES[opt.type];
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onSelect(opt.type)}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-[#E7EEF6] hover:border-[#1F4E79] hover:bg-[#E7EEF6]/40 transition-colors cursor-pointer"
            >
              <Icon size={32} className="text-[#1F4E79]" />
              <span className="text-[#1F4E79] font-semibold text-base">{opt.label}</span>
              <span className="text-xs text-[#5f6f8a]">{w}×{h}</span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
