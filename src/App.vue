<script setup lang="ts">
/**
 * 应用入口组件
 * @description UniApp应用的根组件
 */
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onLaunch(() => {
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
  userStore.getUserInfo()
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "uview-plus/index.scss";
@import url("styles/tailwind.css");

#app {
  overflow: hidden;
}

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
  background-color: #f5f5f5;
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
</style>
