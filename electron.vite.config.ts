import { defineConfig } from "electron-vite";
import path from "path";

export default defineConfig({
  main: {
    build: {
      outDir: "dist/electron",
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve(__dirname, "electron/main.ts"),
      },
    },
  },

  preload: {
    build: {
      outDir: "dist/electron",
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve(__dirname, "electron/preload.ts"),
      },
    },
  },
});
