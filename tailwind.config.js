/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // 兼容小程序，将 : 替换成 __
  separator: '__',
  theme: {
    // 兼容小程序，将默认配置里带 .和/ 清除
    extend: {
      // 其他颜色
      colors: {
        base: 'var(--color-base)',
        primary: 'var(--primary-100)',
        accent: 'var(--accent-100)',
      },
      // 文本颜色
      textColor: {
        secondary: 'var(--text-secondary)',
        primary: 'var(--text-primary)',
        accent: 'var(--text-accent)',
        'primary-content': 'var(--text-primary-content)',
        'secondary-content': 'var(--text-secondary-content)',
        'accent-content': 'var(--text-accent-content)',
      },
      // 背景颜色
      backgroundColor: {
        base: {
          100: 'var(--bg-base-100)',
          200: 'var(--bg-base-200)',
          300: 'var(--bg-base-300)',
        },
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        accent: 'var(--bg-accent)',
      },
      // 边框颜色
      borderColor: {
        primary: 'var(--border-primary)',
        secondary: 'var(--border-secondary)',
        accent: 'var(--border-accent)',
        base: 'var(--border-base)',
        neutral: 'var(--border-neutral)',
      },
      // 比例
      aspectRatio: {
        '1/1': '1 / 1',
        '16/9': '16 / 9',
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '3/4': '3 / 4',
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      // 样式重置
      // addBase({
      //   button: { color: 'red !important' },
      // });
    }),
    ({ addComponents, theme }) => {
      // 自定义组件类
      addComponents({
        '.form-item-mb': {
          marginBottom: '1.5rem',
        },
        '.bg-gradient': {
          background: `linear-gradient(to right, var(--color-accent), var(--color-primary))`,
        },
      });
    },
  ],
  variants: {},
  corePlugins: {
    // 兼容小程序，将带有 * 选择器的插件禁用
    preflight: false,
    space: false,
    divideColor: false,
    divideOpacity: false,
    divideStyle: false,
    divideWidth: false,
  },
};
