import { defineConfig } from 'vite';
import postcssConfig from './postcss.config';
import uni from '@dcloudio/vite-plugin-uni';
import uvtw from '@uni-helper/vite-plugin-uni-tailwind';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: postcssConfig,
    preprocessorOptions: {
      scss: {
        // 取消sass废弃API的报警
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
      },
    },
  },
  plugins: [uni(), uvtw()],
});
