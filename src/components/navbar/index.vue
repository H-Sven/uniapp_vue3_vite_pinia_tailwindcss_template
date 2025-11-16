<template>
  <view class="navbar" :style="{ height: statusBarHeight + navBarHeight + 'px' }">
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 导航栏内容 -->
    <view class="nav-content" :style="{ height: navBarHeight + 'px' }">
      <slot v-if="$slots.left" name="left" />
      <view v-else class="left w-5" @click="onBack">
        <uni-icons type="left" size="20" v-if="!hideBackIcon"></uni-icons>
      </view>
      <slot v-if="$slots.title" name="title" />
      <view v-else class="title">{{ title }}</view>
      <slot v-if="$slots.right" name="right" />
      <view v-else class="right">{{ rightText }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app";
const props = defineProps({
   title: {
      type: String,
      default: '标题'
    },
    rightText: {
      type: String,
      default: ''
    },
    hideBackIcon: {
      type: Boolean,
      default: false
    }
})
const statusBarHeight = ref(0) // 状态栏高度
const navBarHeight = ref(44) // 导航栏高度（可自定义）
onLoad(() => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight;
});

const onBack = () => {
  if (props.hideBackIcon) {
    return
  }
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }
}
</script>

<style scoped lang="scss">
.navbar {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.is-desktop {
  .navbar {
    width: 400px;
    left: auto;
  }
}
.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.left, .right {
  min-width: 20px;
  text-align: center;
}
.title {
  flex: 1;
  text-align: center;
  font-weight: bold;
}
</style>