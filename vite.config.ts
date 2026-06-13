/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          setupFiles: "./src/test/setup.ts",
          include: ["tests/**/*.{test,spec}.tsx"],
        },
      },
      {
        extends: true,
        plugins: [],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});