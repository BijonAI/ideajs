import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: true,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  esbuildOptions(options) {
    options.charset = 'utf8';
    options.legalComments = 'none';
  }
});
