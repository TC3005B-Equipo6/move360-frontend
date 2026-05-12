import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import SegmentedControl from "../SegmentedControl/SegmentedControl";
import { TrendingUp, BarChart2} from "lucide-react";
import { IndicatorModal } from "./IndicatorModal";
import { ChartModal } from "./ChartModal";

interface Props {
  onClose: () => void;
  onAddWidget: (widget: any) => void;
}

export const AddWidgetModal = ({
  onClose,
  onAddWidget,
}: Props) => {
    const [type, setType] =
    useState("indicador");
    const [showIndicatorModal, setShowIndicatorModal] =
    useState(false);
    const [showChartModal, setShowChartModal] =
    useState(false);

  return (
    <>
      <Modal title="Selecciona un tipo" onClose={onClose} className="w-[320px]">
        <div className="flex flex-col items-center gap-4 py-1" >
          <SegmentedControl
            value={type}
            onChange={setType}
            options={[
              {
                label: "Indicador",
                value: "indicador",
                icon: <TrendingUp size={18} />,
              },
              {
                label: "Gráfica",
                value: "grafica",
                icon: <BarChart2 size={18} />,
              },
            ]}
          />
          <Button
            label="Continuar"
            onPress={() => {
                if (type === "indicador") {setShowIndicatorModal(true);}
                if (type === "grafica") {setShowChartModal(true);}
            }}
            />
        </div>
      </Modal>
      {showIndicatorModal && ( <IndicatorModal onClose={() =>  setShowIndicatorModal(false) } onSave={(widget) => { onAddWidget(widget); onClose(); }}
        />
      )}
      {showChartModal && (<ChartModal onClose={() => setShowChartModal(false)} onSave={(widget) => { onAddWidget(widget); onClose();}}
        />
      )}
    </>
  );
};