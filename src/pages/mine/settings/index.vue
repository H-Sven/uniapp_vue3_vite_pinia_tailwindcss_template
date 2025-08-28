<template>
  <view class="h-full bg-base-100 overflow-auto px-4">
    <view class="mt-2 px-4 py-2 bg-base-200 rounded-lg">
      <view
        class="flex justify-between gap-5 py-3"
        v-for="item in userInfo"
        :key="item.title"
      >
        <view class="flex-shrink-0">{{ item.title }}</view>
        <view class="flex gap-2">
          <view v-if="item.title !== '头像'" class="text-sm">{{
            item.value
          }}</view>
          <uv-avatar v-else :src="item.value" size="24"></uv-avatar>
          <!-- <uv-icon
            name="arrow-right"
            size="16"
            color="var(--text-secondary)"
          ></uv-icon> -->
        </view>
      </view>
    </view>

    <view class="mt-4 px-4 py-2 bg-base-200 rounded-lg">
      <view
        class="flex items-center justify-between py-3"
        v-for="item in systemInfo"
        :key="item.title"
        @click="clickSystemInfo(item)"
      >
        <view class="">{{ item.title }}</view>
        <view class="flex gap-2">
          <view class="text-sm">{{ item.value }}</view>
          <uv-icon
            v-if="item.title !== '软件版本'"
            name="arrow-right"
            size="16"
            color="var(--text-secondary)"
          />
        </view>
      </view>
    </view>

    <view
      class="mt-4 flex items-center justify-between text-red-500 bg-base-200 rounded-lg py-5 px-4"
      @click="logout"
    >
      <view class="">退出账号</view>
      <uv-icon
        name="arrow-right"
        size="16"
        color="var(--text-red-500)"
      ></uv-icon>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { desensitizePhone } from "@/utils";

// 用户信息
const userInfo = ref([
  {
    title: "头像",
    value: "/static/logo.png",
  },
  {
    title: "昵称",
    value: uni.getStorageSync("nickname")
      ? desensitizePhone(uni.getStorageSync("nickname"))
      : "",
  },
  {
    title: "用户ID",
    value: uni.getStorageSync("nickname").slice(-6),
  },
  {
    title: "个人简介",
    value: uni.getStorageSync("profile") || "这个人很懒,什么都没有留下",
  },
]);

// 应用信息
const systemInfo = ref([
  {
    title: "使用条款",
    value: "",
    path: "/pages/terms/index",
  },
  {
    title: "客服中心",
    value: "",
  },
  {
    title: "软件版本",
    value: "1.0.0",
  },
  // {
  //   title: "软件字体",
  //   value: "12345678@qq.com",
  // },
]);

const clickSystemInfo = (item: any) => {
  if (item.title === "客服中心") {
    return uni.showToast({
      title: "敬请期待!",
      icon: "none",
    });
  }
  if (item.path) {
    uni.navigateTo({
      url: item.path,
    });
  }
};

/**
 * 退出登录
 */
const logout = () => {
  uni.showModal({
    title: "确认退出",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        // 清除本地存储
        uni.removeStorageSync("token");
        uni.removeStorageSync("userInfo");

        // 当前url
        const currentUrl = "/" + getCurrentPages()[0].route;

        if (currentUrl) {
          uni.reLaunch({
            url: `/pages/login/index?redirect=${encodeURIComponent(
              currentUrl
            )}`,
          });
        }
      }
    },
  });
};
</script>
