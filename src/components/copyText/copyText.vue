<template>
  <view
    class="bg-base-200 rounded flex items-center justify-center p-2 gap-2 mt-4 text-secondary text-sm"
    @click="copy"
  >
    <uv-image
      src="/static/copy.png"
      width="14"
      height="14"
      color="var(--text-secondary)"
    />
    <text>复制</text>
  </view>
</template>

<script setup lang='ts'>
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});

const copy = () => {
  uni.setClipboardData({
    data: props.text,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "none",
      });
    },
  });
};
</script>

<style scoped lang="scss"></style>
