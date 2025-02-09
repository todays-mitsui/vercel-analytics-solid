import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'

const preset_options: preset.PresetOptions = {
  entries: [
    {
      entry: 'src/solid.tsx',
    },
    {
      name: 'solidstart',
      entry: 'src/solidstart.tsx',
    },
  ],
  cjs: false,
};

export default defineConfig(config => {
  const watching = !!config.watch
  const parsed_data = preset.parsePresetOptions(preset_options, watching)

  if (!watching) {
      const package_fields = preset.generatePackageExports(parsed_data)

      console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`)

      preset.writePackageJson(package_fields)
  }

  return preset.generateTsupOptions(parsed_data)
});

// export default defineConfig({
//   entry: ['src/solid.tsx', 'src/solidstart.tsx'],
//   format: 'esm',
//   splitting: false,
//   sourcemap: true,
//   clean: true,
// });
