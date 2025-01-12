// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "https://galateapolymorph.github.io",
  base: "/chloenyx-analytics",
  output: "static",
});
