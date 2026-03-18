import { resolve } from "path";
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  resolve: {
    alias: {
      "@plugin": resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    exclude: ["e2e/**", "**/node_modules/**"],
  },
});
