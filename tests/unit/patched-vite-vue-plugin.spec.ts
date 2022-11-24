import type { LoadResult } from "rollup";

import { describe, expect, it } from "vitest";
import { createPatchedViteVuePlugin, EXPORT_HELPER_ID } from "../../src/";

type LoadFunction = (id: string, opts?: { ssr: boolean}) => Promise<LoadResult> | LoadResult;

describe("Patched Vite Vue plugin", () => {
    it("exposes full class", async () => {

        class TestVueComponent {
            static id = "TestVueComponent";

            public helloWorld() {
                return "Hello World!";
            }

            static __vccOpts = {
                id: "__vccOpts",
            };
        }

        const pluginLoader = createPatchedViteVuePlugin();
        const exportHelper = await (pluginLoader.load as unknown as LoadFunction)(EXPORT_HELPER_ID);
        expect(exportHelper).to.be.a("string");

        if (typeof exportHelper === "string") {
            const exportHelperModule = await import(`data:text/javascript;base64,${btoa(exportHelper)}`);
            const vuePluginExportedClass = exportHelperModule.default(TestVueComponent, []);

            expect(vuePluginExportedClass.__vccOpts).to.not.be.undefined;
            expect(vuePluginExportedClass.__vccOpts.id).to.eq(TestVueComponent.__vccOpts.id);
            expect(vuePluginExportedClass.id).to.eq(TestVueComponent.id);

        } else {
            throw new Error("Returned export helper is not a string value.");
        }
    });
});
