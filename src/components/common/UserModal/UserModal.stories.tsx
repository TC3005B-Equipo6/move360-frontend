import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserModal } from "./UserModal";



const meta: Meta<typeof UserModal> = {
  title: "Components/UserModal",
  component: UserModal,
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
};


export default meta;

type Story = StoryObj<typeof UserModal>;
 


export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    user: { 
      name: "Andrés García",
      email: "andres@email.com",
    },
  },
};
