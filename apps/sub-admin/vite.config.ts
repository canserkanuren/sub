/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,

    build: {
      outDir: '../../dist/apps/sub-admin/client',
      reportCompressedSize: true,
      target: ['es2020']
    },
    server: {
      port: 4300,
      fs: {
        allow: ['.']
      }
    },
    plugins: [analog(), nxViteTsPaths(), splitVendorChunkPlugin()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default']
    },
    define: {
      'import.meta.vitest': mode !== 'production'
    },
    ssr: {
      noExternal: ['ngx-sonner']
    }
  };
});
