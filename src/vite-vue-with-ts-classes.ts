import type { Plugin as VitePlugin } from "vite";
import type { Options } from "@vitejs/plugin-vue";
import type { LoadResult, PluginContext } from "rollup";

import vue from "@vitejs/plugin-vue";

// the export helper's ID from Vite's Vue plugin, which need to be overridden
export const EXPORT_HELPER_ID = "\0plugin-vue:export-helper";

/**
 * Create a patched version of the Vite vue plugin to support TypeScript classes as Vue components.
 *
 * @param rawOptions
 */
export function createPatchedViteVuePlugin(rawOptions?: Options): VitePlugin {
    // create the Vite plugin for vue first
    const vitePlugin = vue(rawOptions);

    // original plugin load.
    const vitePluginLoad = vitePlugin.load as (id: string, opts?: { ssr: boolean}) => Promise<LoadResult> | LoadResult;

    // patch the plugin loader to override the export helper code
    vitePlugin.load = function patchedVuePluginLoader(
        this: PluginContext,
        id: string,
        options?: { ssr: boolean},
    ): Promise<LoadResult> | LoadResult {
        if (id === EXPORT_HELPER_ID) {
            const exportHelper = "" + vitePluginLoad.call(this, id, options);
            if (
                exportHelper.indexOf("export default (sfc, props) =>") >= 0
                && exportHelper.indexOf("return target") > 0
            ) {
                return exportHelper.replace(/(return\s+)target/, "$1sfc");
            } else {
                return `
                export default (sfc, props) => {
                    const target = sfc.__vccOpts || sfc;
                    for (const [key, val] of props) {
                      target[key] = val;
                    }
                    return sfc;
                }
            `;
            }
        } else {
            return vitePluginLoad.call(this, id, options);
        }
    } as unknown as VitePlugin["load"];

    return vitePlugin;
}
