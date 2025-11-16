<template>
  <NavBar :title="title" :hideBackIcon="hideBackIcon">
    <template #left v-if="$slots.left">
      <slot name="left" />
    </template>
    <template #title v-if="$slots.title">
      <slot name="title" />
    </template>
    <template #right v-if="$slots.right">
      <slot name="right" />
    </template>
  </NavBar>
  <view class="bg-[#f5f5f5] overflow-hidden"
    :style="{
      marginTop: statusBarHeight + 44 + 'px',
      height: 'calc(100% - ' + (statusBarHeight + 44 + (isTabbar ? 0 : 0)) + 'px)'
    }"
  >
    <slot />
  </view>
</template>
<script setup>
import NavBar from '@/components/navbar/index.vue'
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app";

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  hideBackIcon: {
    type: Boolean,
    default: false
  },
  isTabbar: {
    type: Boolean,
    default: false
  }
})

const statusBarHeight = ref(0)

onLoad(() => {
  statusBarHeight.value =  uni.getSystemInfoSync().statusBarHeight;
});
</script>