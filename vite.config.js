import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  // Plugins and additional configurations
  plugins: [glsl()],
});
