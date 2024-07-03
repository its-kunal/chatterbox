import typescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const config: RollupOptions = {
  input: "index.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    commonjs(),
    typescript(),
    json(),
    resolve({ preferBuiltins: true }),
  ],
};

export default config;
