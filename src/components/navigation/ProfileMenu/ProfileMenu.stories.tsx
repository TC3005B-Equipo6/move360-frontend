import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";

const mockProfile = {
  firstName: "Ana",
  surname: "López",
  maternalSurname: "García",
  role: "Administrador",
  email: "ana.lopez@example.com",
};

const meta: Meta<typeof ProfileMenu> = {
  title: "Components/ProfileMenu",
  component: ProfileMenu,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="flex justify-end p-10 bg-surface-default min-h-[250px]">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProfileMenu>;

export const Default: Story = {
  args: {
    profile: mockProfile,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    profile: null,
    isLoading: true,
  },
};

export const WithoutProfile: Story = {
  args: {
    profile: null,
    isLoading: false,
  },
};