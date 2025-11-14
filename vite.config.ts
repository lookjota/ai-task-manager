import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const plugins: any[] = [tailwindcss(), reactRouter(), tsconfigPaths()];

  return {
    plugins,
    build: {
      // Increase chunk size limit to avoid warnings for larger chunks
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: ['@react-router/dev'], // Exclude dev dependencies
        output: {
          manualChunks: (id) => {
            // Create chunks based on dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              if (id.includes('@radix-ui') || id.includes('@shadcn')) {
                return 'vendor-ui';
              }
              if (id.includes('@prisma') || id.includes('@libsql')) {
                return 'vendor-db';
              }
              return 'vendor'; // Other dependencies
            }
          }
        }
      }
    },
    define: {
      // Expose environment variables to the client
      'process.env.TURSO_DATABASE_URL': JSON.stringify(env.TURSO_DATABASE_URL),
      'process.env.TURSO_AUTH_TOKEN': JSON.stringify(env.TURSO_AUTH_TOKEN),
    },
  };
});
