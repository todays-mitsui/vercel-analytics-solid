import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/solid.tsx', 'src/solidstart.tsx'],
  format: 'esm',
  splitting: false,
  sourcemap: true,
  clean: true,
});
