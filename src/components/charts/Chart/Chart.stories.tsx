import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "./Chart";

const meta: Meta<typeof Chart> = {
  title: "Components/Chart",
  component: Chart,
};

export default meta;

type Story = StoryObj<typeof Chart>;

export const UsuariosPorLinea: Story = {
  args: {
    type: "donut",
    title: "Usuarios por línea",
    size: "sm",
    data: [
      { name: "Línea 1", value: 35, fill:"#0b4d94" },
      { name: "Línea 2", value: 25, fill:"#ef2b2d" },
      { name: "Línea 3", value: 20, fill:"#78d7fd" },
      { name: "Línea 4", value: 12, fill:"#9cc52b" },
      { name: "Línea 5", value: 8, fill:"#ff7f18" },
    ],
    
  },
};

export const UsuariosRegulares: Story = {
  args: {
    type: "line",
    title: "Usuarios Regulares",
    size: "lg",
    data: [
      { name: "Ene", value: 200 },
      { name: "Feb", value: 450 },
      { name: "Mar", value: 800 },
      { name: "Abr", value: 1200 },
      { name: "May", value: 1600 },
    ],
      series: [
      {
        key: "value",
        color: "var(--chart-1)",
        label: "Usuarios",
      },
    ],
  },
};

export const UsuariosPorTipoDePago: Story = {
  args: {
    
    type: "bar",
    title: "Usuarios por tipo de pago",
    size: "md",
    data: [
      { name: "Tarjeta", value: 300,  },
      { name: "TDC", value: 500 },
      { name: "Celular", value: 700 },
      { name: "Reloj", value: 900 },
      { name: "CoDi", value: 1100 },
      ],
      series: [
      {
        key: "value",
        color: "var(--chart-2)",
        label: "Usuarios",
      },

    ],
  },
};

export const DosLineas: Story = {
  args: {
    type: "line",
    title: "Linea 1 vs Linea 2",
    size: "lg",
    data: [
      {
        name: "Ene",
        linea1: 200,
        linea2: 500,
      },
      {
        name: "Feb",
        linea1: 350,
        linea2: 650,
      },
      {
        name: "Mar",
        linea1: 500,
        linea2: 900,
      },
      {
        name: "Abr",
        linea1: 800,
        linea2: 1200,
      },
      {
        name: "May",
        linea1: 1100,
        linea2: 1600,
      },
    ],

    series: [
      {
        key: "linea1",
        color: "var(--chart-1)",
        label: "Linea 1",
      },
      {
        key: "linea2",
        color: "var(--chart-2)",
        label: "Linea 2",
      },
    ],
  },
};

export const SinDatos: Story = {
  args: {
    type: "bar",
    title: "Usuarios por tipo de pago",
    size: "md",
    data: [],
  },
};

export const ConSubtitulo: Story = {
  args: {
    type: "line",
    title: "Afluencia mensual",
    subtitle: "Metro · Marzo 2025 – Febrero 2026",
    size: "md",
    data: [
      { name: "Ene", value: 220 },
      { name: "Feb", value: 460 },
      { name: "Mar", value: 810 },
      { name: "Abr", value: 1180 },
      { name: "May", value: 1620 },
    ],
    series: [
      {
        key: "value",
        color: "var(--chart-1)",
        label: "Afluencia",
      },
    ],
  },
};

export const Cargando: Story = {
  args: {
    type: "line",
    title: "Usuarios Regulares",
    size: "md",
    data: [],
    isLoading: true,
  },
};
