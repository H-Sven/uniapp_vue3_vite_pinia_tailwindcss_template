# UniApp 开发模板

## 📖 简介

这是一个基于 **Vue3 + TypeScript + TailwindCSS + uv-ui** 的 UniApp 开发模板，集成了现代化的开发工具和最佳实践，帮助您快速启动跨平台应用开发。

## ✨ 特性

- 🚀 **Vue3 + Composition API** - 现代化的 Vue.js 开发体验
- 🔧 **TypeScript** - 完整的类型支持，提升开发效率和代码质量
- 🎨 **TailwindCSS** - 原子化 CSS 框架，快速构建美观界面
- 🧩 **uv-ui 组件库** - 丰富的 UniApp 专用组件
- 📦 **Pinia** - 轻量级状态管理
- ⚡ **Vite** - 快速的构建工具
- 📱 **多端支持** - H5、小程序、App 一套代码多端运行
- 🛠️ **开发工具** - ESLint、Prettier、Git Hooks 等完整工具链

## 🏗️ 项目结构

```
├── src/
│   ├── api/                 # API 接口
│   ├── components/          # 公共组件
│   ├── pages/              # 页面文件
│   ├── stores/             # Pinia 状态管理
│   ├── styles/             # 样式文件
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── App.vue             # 应用入口组件
│   ├── main.ts             # 应用入口文件
│   ├── manifest.json       # 应用配置
│   └── pages.json          # 页面路由配置
├── static/                 # 静态资源
├── uni_modules/            # uni_modules 依赖
├── package.json
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # TailwindCSS 配置
└── vite.config.ts          # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 7 (推荐) / npm / yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发运行

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# App 开发
pnpm dev:app

# 支付宝小程序开发
pnpm dev:mp-alipay

# 百度小程序开发
pnpm dev:mp-baidu

# 头条小程序开发
pnpm dev:mp-toutiao
```

### 生产构建

```bash
# H5 构建
pnpm build:h5

# 微信小程序构建
pnpm build:mp-weixin

# App 构建
pnpm build:app

# 其他平台构建
pnpm build:mp-alipay
pnpm build:mp-baidu
pnpm build:mp-toutiao
```

## 📝 开发指南

### 1. 页面开发

在 `src/pages` 目录下创建新页面，并在 `src/pages.json` 中配置路由：

```json
{
  "pages": [
    {
      "path": "pages/example/index",
      "style": {
        "navigationBarTitleText": "示例页面"
      }
    }
  ]
}
```

### 2. 组件开发

在 `src/components` 目录下创建公共组件：

```vue
<template>
  <view class="example-component">
    <text>{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 示例组件
 * @description 这是一个示例组件
 */
interface Props {
  title: string;
}

defineProps<Props>();
</script>

<style scoped>
.example-component {
  /* 组件样式 */
}
</style>
```

### 3. API 开发

在 `src/api` 目录下创建 API 模块：

```typescript
import { request } from '@/utils/request';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

/**
 * 获取用户信息
 * @param id 用户ID
 */
export function getUserInfo(id: number): Promise<UserInfo> {
  return request.get(`/user/${id}`);
}
```

### 4. 状态管理

使用 Pinia 进行状态管理：

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    isLogin: false,
  }),

  actions: {
    async login(username: string, password: string) {
      // 登录逻辑
    },

    logout() {
      this.userInfo = null;
      this.isLogin = false;
    },
  },
});
```

## 🎨 样式开发

项目使用 TailwindCSS 进行样式开发，支持响应式设计和深色模式：

```vue
<template>
  <view class="flex items-center justify-center p-4 bg-white dark:bg-gray-800">
    <text class="text-lg font-semibold text-gray-900 dark:text-white">
      Hello World
    </text>
  </view>
</template>
```

## 📦 依赖说明

### 核心依赖

- `@dcloudio/uni-app` - UniApp 核心框架
- `vue` - Vue.js 框架
- `pinia` - 状态管理
- `vue-i18n` - 国际化支持

### 开发依赖

- `@dcloudio/vite-plugin-uni` - UniApp Vite 插件
- `@uni-helper/vite-plugin-uni-tailwind` - TailwindCSS 支持
- `typescript` - TypeScript 支持
- `tailwindcss` - CSS 框架
- `sass` - CSS 预处理器

## 🔧 配置说明

### TypeScript 配置

项目已配置完整的 TypeScript 支持，类型定义文件位于 `src/types` 目录。

### TailwindCSS 配置

`tailwind.config.js` 中包含了 UniApp 的特殊配置，支持 rpx 单位和小程序兼容性。

### Vite 配置

`vite.config.ts` 中配置了 UniApp 插件和 TailwindCSS 支持。

## 📋 开发规范

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 Vue3 Composition API 规范
- 使用 JSDoc 注释函数和组件
- 保持代码格式化和 ESLint 规则

### 命名规范

- 文件名：kebab-case (如: `user-info.vue`)
- 组件名：PascalCase (如: `UserInfo`)
- 变量名：camelCase (如: `userInfo`)
- 常量名：UPPER_CASE (如: `API_BASE_URL`)

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建工具、依赖更新等
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [UniApp](https://uniapp.dcloud.io/) - 跨平台应用开发框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [uv-ui](https://www.uvui.cn/) - UniApp UI 组件库

---

如果这个模板对您有帮助，请给个 ⭐️ 支持一下！
