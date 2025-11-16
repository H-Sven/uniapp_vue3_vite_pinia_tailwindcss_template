
<template>
  <PageWrapper title="我的" hideBackIcon>
    <view class="h-full overflow-auto px-4">
      <!-- 用户信息区域 -->
      <view class="flex justify-between items-center py-6">
        <view class="flex items-center gap-3" @click="toLogin">
          <up-avatar
            :src="userInfo?.avatar"
            bg-color="#f0f0f0"
            size="48"
            font-size="16"
          />
          <view class="flex flex-col flex-1">
            <view v-if="userInfo?.nickname" class="w-full flex flex-col">
              <view class="text-lg font-medium">
                {{ userInfo?.nickname }}
              </view>
              <view class="text-xs text-gray-500">
                UID: {{ userInfo?.uid }}
              </view>
            </view>
            <view v-else class="flex flex-col">
              <text class="text-primary text-base">点击登录</text>
              <text class="text-gray-500 text-sm">登录后享受更多功能</text>
            </view>
          </view>
        </view>
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
    </view>
  </PageWrapper>
</template>

<script setup>
import { ref,computed } from "vue";
import { useUserStore } from "@/stores/user";
import PageWrapper from '@/components/PageWrapper/index.vue'

// 获取用户信息
const userStore = useUserStore()

/**
 * 我的页面组件
 * @description 用户中心页面
 */

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 版本信息
const version = "1.0.0";

// 菜单列表
const menuList = computed(() => {
  const menu = [
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
  ]
  if(userStore.token) {
    menu.push({
      icon: "🔒",
      title: "退出登录",
      action: "logout",
    })
  }
  return menu
})

/**
 * 跳转到登录页
 */
const toLogin = () => {
  if(!userStore.token) {
    uni.navigateTo({
      url: "/pages/login/index",
    });
  }
};

/**
 * 处理菜单点击
 * @param menu 菜单项
 */
const handleMenuClick = (menu) => {
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
    case "logout":
      uni.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (res.confirm) {
            await userStore.logout()
            uni.showToast({
              title: "退出登录成功",
              icon: "success",
            });
          }
        },
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
