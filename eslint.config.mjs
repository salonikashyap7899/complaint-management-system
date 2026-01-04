import js from "@eslint/js";
import next from "eslint-config-next";

export default [
  js.configs.recommended,
  next,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];
