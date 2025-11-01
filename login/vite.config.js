import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fallbackAlias = {};

try {
  require.resolve("recharts");
} catch (error) {
  fallbackAlias.recharts = path.resolve(__dirname, "src/recharts-fallback");
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: fallbackAlias,
  },
});
