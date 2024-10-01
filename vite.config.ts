import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  if (command === "build") {
    plugins.push(nodePolyfills() as any);
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Add buffer alias to make it browser-compatible
        buffer: "buffer/",
      },
    },
    define: {
      "process.env": process.env,
    },
    build: {
      modulePreload: true,
      rollupOptions: {
        plugins: [
          // Inject Buffer global into your build for browser compatibility
          inject({
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Polyfill Node.js global variables for Buffer
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
        ],
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  };
});
