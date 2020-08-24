import typescript from '@rollup/plugin-typescript';
import afterEffectJsx from 'rollup-plugin-ae-jsx';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/aefunctions.jsx',
    format: 'cjs',
  },
  plugins: [
    typescript({
      module: 'esnext',
      target: 'esnext',
      noImplicitAny: true,
      moduleResolution: 'node',
      strict: true,
      lib: ['esnext'],
    }),
    afterEffectJsx(),
  ],
};
