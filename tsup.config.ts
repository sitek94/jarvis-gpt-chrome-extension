import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/background.ts', 'src/content-script.ts'],
  outDir: 'build',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false, // !options.watch,
  publicDir: true,
}))
