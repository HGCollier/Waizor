import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const config = {
    input: "Scripts/main.ts",
    output: {
        file: "wwwroot/js/main.bundle.js",
        format: "iife",
    },
    plugins: [typescript(), nodeResolve()],
};

export { config as default };
