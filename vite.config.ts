import type { UserConfigExport } from "vite";

import path from "path";
import { defineConfig } from "vite";

interface PackageJson {
    name: string,
    main: string,
    module: string,
    types: string,
    version: string,
    dependencies: Record<string, string>,
    peerDependencies?: Record<string, string>,
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("./package.json") as PackageJson;


// https://vitejs.dev/config/
export const BaseConfig: UserConfigExport = {
    plugins: [],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            formats: ["cjs", "es"],
        },
        rollupOptions: {
            external: [
                ...Object.getOwnPropertyNames(pkg.dependencies || {}),
                ...Object.getOwnPropertyNames(pkg.peerDependencies || {}),
                "tslib",
            ],
        },
    },
};

export default defineConfig(BaseConfig);
