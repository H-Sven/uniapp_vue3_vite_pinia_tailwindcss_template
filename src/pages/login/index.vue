<template>
  <PageWrapper title="登录">
    <view
      class="h-full bg-[#f5f5f5] p-4 flex flex-col"
    >
      <!-- 头部Logo区域 -->
      <view class="text-center mt-28 mb-8">
        <view style="font-size: 48rpx" class="font-bold text-black mb-2">
          欢迎登录
        </view>
      </view>

      <!-- 登录表单 -->
      <view class="bg-white rounded-3xl p-8 shadow-2xl">
        <!-- 手机号输入框 -->
          <up-input
            v-model="mobile"
            placeholder="请输入手机号"
            border="surround"
            type="number"
            maxlength="11"
            class="transition-all duration-200"
          />

        <!-- 验证码输入框 -->
        <up-input
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          border="surround"
          maxlength="6"
          class="transition-all duration-200 mt-6"
        >
        <template #suffix>
          <up-code
            ref="uCodeRef"
            @change="codeChange"
            seconds="60"
            changeText="X秒重新获取"
          ></up-code>
          <up-button
            @tap="getCode"
            :text="tips"
            type="success"
            size="mini"
          ></up-button>
        </template>
        </up-input>
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
      </view>
    </view>
  </PageWrapper>
</template>

<script setup lang="ts">
/**
 * 登录页面
 * @description 用户登录界面
 */
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { twMerge } from "tailwind-merge";
import { getCodeApi } from "@/api/user";
import { isValidPhone } from '@/utils/index'
import { useUserStore } from '@/stores/user'
import PageWrapper from '@/components/PageWrapper/index.vue'


const userStore = useUserStore()

const mobile = ref('')
const code = ref('')

const tips = ref('');
const uCodeRef = ref(null);

const codeChange = (text) => {
  tips.value = text;
};

// 检查手机号是否已注册
const isFirstLogin = ref(false)
const checkMobileFirstLogin = async () => {
  try {
     isFirstLogin.value = false
    const res = await userStore.checkMobile({
      mobile: mobile.value
    })
    isFirstLogin.value = !res
  } catch (error) {
    isFirstLogin.value = false
  }
}

const getCode = async () => {
  try {
    if(!isValidPhone(mobile.value)){
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
    });
    return false
  }
  if (uCodeRef.value?.canGetCode) {
    // 模拟向后端请求验证码
    uni.showLoading({
      title: '正在获取验证码',
    });
    const res = await getCodeApi({ mobile: mobile.value })
    if(res.code === 1) {
      uni.hideLoading();
      uni.showToast({
        title: "验证码已发送",
        icon: "none",
      });
      uCodeRef.value?.start();
    }
    checkMobileFirstLogin()
  } else {
    uni.showToast({
      title: "倒计时结束后再发送",
      icon: "none",
    });
  }
  } catch (error) {
    isFirstLogin.value = false
  }
};


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
  if (!isValidPhone(mobile.value)) {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
    });
    return;
  }

  if (code.value.length !== 6) {
    uni.showToast({
      title: "请输入6位验证码",
      icon: "none",
    });
    return;
  }

  try {
    if(isLoading.value) {
      return false
    }
    isLoading.value = true;
    await userStore.login({
      mobile: mobile.value,
      code: code.value
    });
    uni.showToast({
      title: isFirstLogin.value ? "注册成功" : "登录成功",
      icon: "success",
    });
    // 跳转页面
    setTimeout(() => {
      const targetUrl = redirectUrl.value || "/pages/index/index";
      const editUserUrl = "/pages/editUser/index"
      uni.reLaunch({ url: isFirstLogin.value ? editUserUrl : targetUrl });
    }, 1000);

  } catch (error) {
    console.error("登录失败:", error);
    uni.showToast({
      title: `登录失败:${error.message}`,
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

</script>
