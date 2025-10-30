<template>
  <view class="h-full bg-base-100 overflow-auto">
    <!-- 欢迎区域 -->
    <view
      class="mx-4 my-6 p-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
    >
      <view class="text-2xl font-bold mb-2">欢迎使用 UniApp 模板</view>
      <view class="text-sm opacity-90"
        >基于 Vue3 + TypeScript + TailwindCSS + uv-ui</view
      >
    </view>

    <!-- 功能特性 -->
    <view class="mx-4 mb-6">
      <view class="text-lg font-semibold mb-4 text-center">🚀 模板特性</view>
      <view class="grid grid-cols-2 gap-3">
        <view
          v-for="(feature, index) in features"
          :key="index"
          class="p-4 rounded-lg bg-white shadow-sm border border-gray-100"
        >
          <view class="text-2xl mb-2">{{ feature.icon }}</view>
          <view class="font-medium text-sm">{{ feature.title }}</view>
          <view class="text-xs text-gray-600 mt-1">{{
            feature.description
          }}</view>
        </view>
      </view>
    </view>
    <!-- 快速开始 -->
    <view class="mx-4 mb-6">
      <view class="text-lg font-semibold mb-4 text-center">⚡ 快速开始</view>
      <view class="bg-white rounded-lg p-4 shadow-sm">
        <view
          v-for="(step, index) in quickStart"
          :key="index"
          class="flex items-center mb-3 last:mb-0"
        >
          <view
            class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-3"
          >
            {{ index + 1 }}
          </view>
          <view class="text-sm">{{ step }}</view>
        </view>
      </view>
    </view>

    <!-- 技术栈 -->
    <view class="mx-4 mb-6">
      <view class="text-lg font-semibold mb-4 text-center">🛠️ 技术栈</view>
      <view class="flex flex-wrap gap-2">
        <view
          v-for="(tech, index) in techStack"
          :key="index"
          class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
        >
          {{ tech }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 首页组件
 * @description 展示模板特性和使用指南
 */

// 功能特性
const features = [
  {
    icon: "🎨",
    title: "现代化 UI",
    description: "TailwindCSS + uv-ui",
  },
  {
    icon: "⚡",
    title: "高性能",
    description: "Vue3 + Vite 构建",
  },
  {
    icon: "🔧",
    title: "TypeScript",
    description: "类型安全开发",
  },
  {
    icon: "📱",
    title: "多端支持",
    description: "H5/小程序/App",
  },
];

// 快速开始步骤
const quickStart = [
  "克隆项目到本地",
  "安装依赖: pnpm install",
  "启动开发服务器: pnpm dev:h5",
  "开始你的开发之旅",
];

// 技术栈
const techStack = [
  "Vue3",
  "TypeScript",
  "TailwindCSS",
  "uv-ui",
  "Pinia",
  "Vite",
  "UniApp",
];
</script>

<style scoped>
</style>
