
<template>
  <view class="h-full overflow-auto px-4">
    <!-- 用户信息区域 -->
    <view class="flex justify-between items-center py-6">
      <view class="flex items-center gap-3">
        <uv-avatar
          src="/static/logo.png"
          bg-color="#f0f0f0"
          size="48"
          font-size="16"
        />
        <view class="flex flex-col">
          <text v-if="userInfo.nickname" class="text-lg font-medium">{{
            userInfo.nickname
          }}</text>
          <view v-else @click="toLogin" class="flex flex-col">
            <text class="text-primary text-base">点击登录</text>
            <text class="text-gray-500 text-sm">登录后享受更多功能</text>
          </view>
        </view>
      </view>
      <navigator open-type="navigate" url="/pages/mine/settings/index">
        <uni-icons type="gear" size="24" color="#666" />
      </navigator>
    </view>

    <!-- 功能菜单 -->
    <view class="bg-white rounded-lg overflow-hidden mb-6">
      <view
        v-for="(menu, index) in menuList"
        :key="index"
        class="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
        @click="handleMenuClick(menu)"
      >
        <view class="flex items-center gap-3">
          <view class="text-xl">{{ menu.icon }}</view>
          <text>{{ menu.title }}</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#ccc" />
      </view>
    </view>

    <view class="bg-white rounded-lg p-4">
      <view class="text-center">
        <view class="text-lg font-medium mb-2">UniApp 开发模板</view>
        <view class="text-sm text-gray-600 mb-4">Version {{ version }}</view>
        <view class="text-xs text-gray-500 leading-relaxed">
          这是一个基于 Vue3 + TypeScript + TailwindCSS 的 UniApp 开发模板，
          集成了常用的开发工具和组件库，帮助您快速开始项目开发。
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

/**
 * 我的页面组件
 * @description 用户中心页面
 */

// 用户信息
const userInfo = ref({
  nickname: "", // 可以从本地存储或接口获取
});

// 版本信息
const version = "1.0.0";

// 菜单列表
const menuList = [
  {
    icon: "👤",
    title: "个人资料",
    action: "profile",
  },
  {
    icon: "🛡️",
    title: "隐私设置",
    action: "privacy",
  },
  {
    icon: "📝",
    title: "意见反馈",
    action: "feedback",
  },
  {
    icon: "ℹ️",
    title: "关于我们",
    action: "about",
  },
];

/**
 * 跳转到登录页
 */
const toLogin = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

/**
 * 处理菜单点击
 * @param menu 菜单项
 */
const handleMenuClick = (menu: any) => {
  switch (menu.action) {
    case "profile":
      uni.showToast({
        title: "个人资料功能待开发",
        icon: "none",
      });
      break;
    case "privacy":
      uni.showToast({
        title: "隐私设置功能待开发",
        icon: "none",
      });
      break;
    case "feedback":
      uni.showToast({
        title: "意见反馈功能待开发",
        icon: "none",
      });
      break;
    case "about":
      uni.showToast({
        title: "关于我们功能待开发",
        icon: "none",
      });
      break;
    default:
      uni.showToast({
        title: "功能开发中",
        icon: "none",
      });
  }
};
</script>

<style scoped lang="scss">
</style>
