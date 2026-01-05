import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    base: "./",
    build: {
        outDir: "../dist",
        emptyOutDir: true
    },
    server: {
        port: 5173,
        strictPort: true
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "app"),
            "@styles": path.resolve(__dirname, "app/styles"),
            "@context": path.resolve(__dirname, "app/context"),
            "@app-types": path.resolve(__dirname, "api/types"),
            "@app-api": path.resolve(__dirname, "app/api"),
            "@components": path.resolve(__dirname, "app/components")
        }
    }
});