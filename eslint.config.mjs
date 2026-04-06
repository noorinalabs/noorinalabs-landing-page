import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {},
  },
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
];
