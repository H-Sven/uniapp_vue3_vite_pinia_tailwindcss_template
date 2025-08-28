<script setup lang="ts">
/**
 * 应用入口组件
 * @description UniApp应用的根组件
 */
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style>
@import url("styles/tailwind.css");

/* 全局样式 */
:root {
  --dynamic-font-scale: 1;
  --dynamic-base-size: calc(1rem * var(--dynamic-font-scale));
}

body {
  font-size: 1rem;
}

body,
uni-page-body {
  background-color: #f8f8f8;
  color: #333;
  height: 100%;
}

.text-dynamic {
  font-size: var(--dynamic-base-size);
}

.animation-paused {
  animation-play-state: paused;
}

/* 适配安全区域 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* uv-ui组件样式优化 */
.uv-button--primary {
  background-color: #007aff !important;
  border-style: none !important;
}

.uv-button--mini {
  height: 52rpx !important;
  padding: 8rpx 20rpx !important;
}

/* 列表组件 */
.uv-list {
  background-color: transparent !important;
}

/* 弹出层 */
.uv-popup .uv-popup__content {
  background-color: #ffffff !important;
}

/* 模态框 */
.uv-modal__title {
  color: #333 !important;
  padding-top: 20rpx !important;
}

.uv-modal__content__text {
  color: #666 !important;
}

.uv-modal__button-group__wrapper--confirm {
  color: #007aff !important;
}

.uv-modal__button-group,
.uv-modal__button-group__wrapper {
  height: 80rpx !important;
}

/* 输入框 */
uni-input {
  font-size: 28rpx !important;
}

.uni-input-placeholder {
  color: #999 !important;
  line-height: 40rpx !important;
  font-size: 24rpx !important;
}

/* 文本域 */
.uv-textarea {
  background-color: #f5f5f5 !important;
  border: none !important;
  padding: 26rpx !important;
}

.uv-textarea__field {
  color: #333 !important;
  font-size: 28rpx !important;
}

.uni-textarea-placeholder {
  color: #999 !important;
  line-height: 40rpx !important;
  font-size: 26rpx !important;
}

/* 标签页 */
.uv-tabs__wrapper__nav__line {
  bottom: 6px !important;
  background-color: #007aff !important;
}
</style>
