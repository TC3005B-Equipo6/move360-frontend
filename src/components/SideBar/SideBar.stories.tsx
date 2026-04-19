import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar, type SidebarProps, type SidebarItem } from "./SideBar";
import type { SideBarButtonProps } from "../SideBarButton/SideBarButton";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <div
      style={{
        minHeight: "100vh", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EEF2F7",
        padding: 10}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const TOP: SidebarItem[] = [
  { id: "home", props: { tooltip: "Home", iconName: "home", selected: false } as SideBarButtonProps },
  { id: "explore", props: { tooltip: "Explore", iconName: "explore", selected: false } as SideBarButtonProps },
  { id: "favorites", props: { tooltip: "Favorites", iconName: "star", selected: false } as SideBarButtonProps },
];

const BOTTOM: SidebarItem[] = [
  { id: "help", props: { tooltip: "Help", iconName: "help", selected: false } as SideBarButtonProps },
  { id: "logout", props: { tooltip: "Log out", iconName: "logout", selected: false } as SideBarButtonProps },
];

export const Default: Story = {
  render: (args: SidebarProps) => {
    const [topItems, setTopItems] = useState<SidebarItem[]>(
      args.topItems?.map((it, i) => (i === 0 ? { ...it, props: { ...it.props, selected: true } } : it)) ?? []
    );
    const [bottomItems, setBottomItems] = useState<SidebarItem[]>(args.bottomItems ?? []);

    const select = (id: string) => {
      setTopItems((prev) =>
        prev.map((it) => ({ ...it, props: { ...it.props, selected: it.id === id } }))
      );
      setBottomItems((prev) =>
        prev.map((it) => ({ ...it, props: { ...it.props, selected: it.id === id } }))
      );
    };

    const mapWithHandler = (items: SidebarItem[]) =>
      items.map((it) => ({ ...it, props: { ...it.props, onPress: () => select(it.id) } }));

    return <Sidebar topItems={mapWithHandler(topItems)} bottomItems={mapWithHandler(bottomItems)} />;
  },
  args: {
    topItems: TOP,
    bottomItems: BOTTOM,
  } as SidebarProps,
};