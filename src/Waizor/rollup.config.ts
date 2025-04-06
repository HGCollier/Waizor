import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "Scripts/main.ts",
    name: "waizor",
    output: {
        file: "wwwroot/js/main.bundle.js",
        format: "iife",
    },
    plugins: [typescript(), nodeResolve()],
};
