<template>
  <view
    class="min-h-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex flex-col"
  >
    <!-- 头部Logo区域 -->
    <view class="text-center mt-10 mb-8">
      <image
        class="w-24 h-24 mx-auto mb-6 rounded-full"
        src="/static/logo.png"
        mode="aspectFit"
      />
      <view style="font-size: 48rpx" class="font-bold text-white mb-2">
        UniApp 模板
      </view>
      <view style="font-size: 28rpx" class="text-white opacity-80">
        欢迎使用开发模板
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="bg-white rounded-3xl p-8 shadow-2xl">
      <up-form :model="form" ref="formRef" label-width="0">
        <!-- 用户名输入框 -->
        <up-form-item>
          <up-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="account"
            border="surround"
            clearable
            class="transition-all duration-200"
          />
        </up-form-item>

        <!-- 密码输入框 -->
        <up-form-item class="mt-4">
          <up-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="lock"
            border="surround"
            clearable
            class="transition-all duration-200"
          />
        </up-form-item>

        <!-- 登录按钮 -->
        <up-button
          type="primary"
          :loading="isLoading"
          :class="
            twMerge(
              'w-full mt-8 transition-all duration-200',
              isLoading && 'opacity-70'
            )
          "
          :custom-style="{ height: '88rpx', borderRadius: '44rpx' }"
          @click="handleLogin"
        >
          {{ isLoading ? "登录中..." : "登录" }}
        </up-button>
      </up-form>

      <!-- 底部注册 -->
      <view class="text-center mt-12">
        <text class="text-sm text-gray-600">还没有账号？</text>
        <text
          class="text-sm text-blue-500 ml-2 hover:text-blue-600 transition-colors cursor-pointer"
          @click="handleRegister"
        >
          立即注册
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 登录页面
 * @description 用户登录界面
 */
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { twMerge } from "tailwind-merge";
import { login, type LoginParams } from "@/api/user";

// 表单数据
const form = ref<LoginParams>({
  username: "",
  password: "",
});

// 加载状态
const isLoading = ref(false);

// 重定向URL
const redirectUrl = ref("");

/**
 * 页面加载
 */
onLoad((options: any) => {
  if (options?.redirect) {
    redirectUrl.value = decodeURIComponent(options.redirect);
  }
});

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!form.value.username) {
    uni.showToast({
      title: "请输入用户名",
      icon: "none",
    });
    return;
  }

  if (!form.value.password) {
    uni.showToast({
      title: "请输入密码",
      icon: "none",
    });
    return;
  }

  try {
    isLoading.value = true;

    // 这里是示例，实际开发时取消注释并使用真实API
    // const response = await login(form.value);
    // uni.setStorageSync("token", response.token);
    // uni.setStorageSync("userInfo", response.userInfo);

    // 模拟登录成功
    uni.showToast({
      title: "登录成功",
      icon: "success",
    });

    // 跳转页面
    setTimeout(() => {
      const targetUrl = redirectUrl.value || "/pages/index/index";
      uni.reLaunch({ url: targetUrl });
    }, 1500);
  } catch (error) {
    console.error("登录失败:", error);
    uni.showToast({
      title: "登录失败，请检查用户名和密码",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

/**
 * 跳转注册
 */
const handleRegister = () => {
  uni.showToast({
    title: "注册功能待开发",
    icon: "none",
  });
};
</script>
