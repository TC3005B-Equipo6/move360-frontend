import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IndicatorCard } from "./IndicatorCard";
import { ActionMenu } from "../ActionMenu/ActionMenu";

const meta: Meta<typeof IndicatorCard> = {
  title: "Components/IndicatorCard",
  component: IndicatorCard,
};

export default meta;

type Story = StoryObj<typeof IndicatorCard>;

export const Positivo: Story = {
  args: {
    value: "+12%",
    label: "Usuarios con descuento",
    tone: "positive",
  },
};

export const Negativo: Story = {
  args: {
    value: "+10%",
    label: "Tiempo de recorrido promedio",
    tone: "negative",
  },
};

export const Neutro: Story = {
  args: {
    value: "-2%",
    label: "Promedio de usuarios mensuales",
    tone: "neutral",
  },
};

export const ConMenu: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <IndicatorCard
          value="+5%"
          label="Usuarios en línea 4"
          tone="positive"
          isMenuOpen={isOpen}
          onMenuClick={() => setIsOpen((prev) => !prev)}
        />
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: 30,
              left: "calc(100% - 20px)",
              zIndex: 10,
            }}
          >
            <ActionMenu
              onClose={() => setIsOpen(false)}
              onDelete={() => {
                console.log("Eliminar");
                setIsOpen(false);
              }}
              onEdit={() => {
                console.log("Editar");
                setIsOpen(false);
              }}
            />
          </div>
        )}
      </div>
    );
  },
};
