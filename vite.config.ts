import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src", "client", "main.ts"),
      name: "bundle",
      fileName: "main",
      formats: ["iife"],
    },
    outDir: "public/js",
    emptyOutDir: true,
    minify: true,
  },
});
