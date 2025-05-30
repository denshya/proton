import path from "path"
import { defineConfig } from "vite"
import { externalizeDeps } from "vite-plugin-externalize-deps"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [externalizeDeps({ peerDeps: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: false,
    outDir: "build",

    minify: false,
    sourcemap: true,
    emptyOutDir: true,
    modulePreload: false,

    lib: {
      entry: [
        path.resolve(__dirname, "./src/index.ts"),
        path.resolve(__dirname, "./src/jsx/jsx-runtime.ts"),
        path.resolve(__dirname, "./src/jsx/ProtonJSX.ts"),
        path.resolve(__dirname, "./src/utils/WebNodeBinding.ts"),
      ],
      formats: ["es"]
    }
  },
  esbuild: {
    treeShaking: true,
    minifyIdentifiers: false,
    keepNames: false
  },
})
