import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { IndicatorColorPicker } from "../IndicatorColorPicker/IndicatorColorPicker";
import { colorOptions, type ColorKey } from "../IndicatorColorPicker/colors";
import { IndicatorTypeToggle } from "../IndicatorTypeToggle/IndicatorTypeToggle";
import { IndicatorPreview } from "../IndicatorPreview/IndicatorPreview";
import type { IndicatorWidget } from "../Dashboard/types";
import type { IndicatorTone } from "../Indicator/Indicator";

interface Props {
  onClose: () => void;
  onSave: (widget: IndicatorWidget) => void;
}

export const IndicatorModal = ({ onClose, onSave }: Props) => {
  const [value, setValue] = useState(12);
  const [label, setLabel] = useState("Usuarios con ");
  const [isPositive, setIsPositive] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ColorKey>("green");

  const currentColors = colorOptions[selectedColor];
  const toneByColor: Record<ColorKey, IndicatorTone> = {
    green: "positive",
    red: "negative",
    yellow: "neutral",
  };

  const handleSave = () => {
    const newIndicator: IndicatorWidget = {
      id: crypto.randomUUID(),
      type: "indicator",
      value,
      label,
      tone: toneByColor[selectedColor],
    };
    onSave(newIndicator);
  };

  return (
    <Modal
      title="Crear indicador"
      onClose={onClose}
      className="w-[950px] rounded-[32px]"
    >
      <div className="flex items-start gap-10 pt-2">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[#1F4E79]">Valor (%)</label>
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(Math.abs(Number(e.target.value)))}
              className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[#1F4E79]">Texto</label>
            <input
              type="text"
              maxLength={40}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
            />
          </div>
          <IndicatorTypeToggle isPositive={isPositive} onChange={setIsPositive} />
          <IndicatorColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
          <div className="flex justify-end gap-4 pt-6">
            <Button label="Cancelar" variant="white" onPress={onClose} />
            <Button label="Guardar" onPress={handleSave} />
          </div>
        </div>
        <div className="flex items-center justify-center min-w-[320px]">
          <IndicatorPreview
            value={value}
            label={label}
            isPositive={isPositive}
            backgroundColor={currentColors.background}
            textColor={currentColors.text}
          />
        </div>
      </div>
    </Modal>
  );
};
