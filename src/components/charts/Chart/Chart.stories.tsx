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

export const TopLineas: Story = {
  args: {
    type: "ranking",
    title: "Top 10 lineas",
    subtitle: "Periodo completo",
    size: "lg",
    data: [
      { name: "Metro L2", value: 214_251_551 },
      { name: "Metro L3", value: 174_541_303 },
      { name: "Metrobus L1", value: 150_873_348 },
      { name: "Metro L1", value: 132_638_596 },
      { name: "Metro LB", value: 124_955_025 },
      { name: "Metro L12", value: 119_912_616 },
      { name: "Metro L8", value: 118_200_792 },
      { name: "Metro L9", value: 93_362_377 },
      { name: "Metro L7", value: 87_910_841 },
      { name: "Metrobus L5", value: 86_233_112 },
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
