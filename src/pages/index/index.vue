<template>
  <PageWrapper :title="title" hideBackIcon>
    <template #right>
      <up-icon name="pushpin-fill" color="red" size="20" @click="showDesktop = true"></up-icon>
    </template>
    <view class="h-full overflow-hidden flex flex-col">
      <view>
        <up-notice-bar :text="noticeBarText"></up-notice-bar>
      </view>
      <view>
        <up-tabs v-model:current="plateTypeIndex" :list="tabList" keyName="label" :scrollable="false" @click="handleTypeClick">
          <template #content="{item, keyName, index}">
            <up-icon name="star-fill" color="red" v-if="item.plateType === 4" class="mr-1"></up-icon>
            {{item[keyName]}}
          </template>
        </up-tabs>
      </view>
      <template v-if="userInfo.id">
        <view class="px-4 flex items-center justify-between text-xs">
          <view class="flex items-center">
            <text>日期：</text>
            <text v-if="startTime && endTime">{{ formatTime(startTime, 'YYYY-MM-DD') }} 至 {{ formatTime(endTime, 'YYYY-MM-DD') }}</text>
            <up-icon v-if="startTime && endTime" name="close-circle-fill" color="red" class="ml-2" size="14" @click="initData()"></up-icon>
          </view>
          <view @click="handleShowCalendar">请选择日期</view>
        </view>
        <view class="mt-4 flex-1 px-4 overflow-hidden">
          <scroll-view
            id="msg-scroll"
            class="h-full"
            scroll-y
            :scroll-with-animation="true"
            :scroll-into-view="scrollIntoViewId"
            ref="msgListRef"
            @scroll="handleScroll"
            @scrolltoupper="handleScrollToUpper"
            @scrolltolower="handleScrollToLower"
          >
            <message-item
              v-for="item in msgList"
              :key="item.id"
              :item="item"
              :plateType="plateType"
              @gotoPrivateChat="gotoPrivateChat"
            ></message-item>
            <!-- 底部锚点，用于滚动到视图底部 -->
            <view id="msg-bottom" style="height: 1px;"></view>
          </scroll-view>
        </view>
        <view class="flex items-center justify-between px-2 py-2" v-if="[1,3].includes(plateType)">
          <up-input v-model="content" border="surround" class="bg-white flex-1"></up-input>
          <view class="ml-2 h-9 flex items-center justify-center bg-[#4b6bc1] text-white rounded px-2" @click="sendMessage">
            <text>发送</text>
          </view>
        </view>
      </template>
      <view v-else>
        <view class="flex items-center justify-center h-[70vh]">
          <view @click="handleLogin" class="w-[150rpx] h-[80rpx] flex items-center justify-center bg-[#4b6bc1] text-white rounded px-2">请先登录</view>
        </view>
      </view>
    </view>
    <dateRangePicker
      :show="showDatePicker"
      :minYear="2025"
      :bottom="datePickerBottom"
      @close="closeDatePicker"
      @confirm="confirmDate"
    />
  </PageWrapper>

  <up-popup :show="showDesktop" mode="center">
    <pushpinDoc />
    <template #bottom>
      <view  class="rounded" style="margin-top: 20px;" @click="showDesktop = false">
        <up-icon name="close" color="#fff"></up-icon>
      </view>
    </template>
  </up-popup>
</template>

<script setup >
import PageWrapper from '@/components/PageWrapper/index.vue'
import MessageItem from './messageItem.vue'
import { liveDetailApi, visitMarkdownApi, readMarkdownApi, getMsgListApi, msgEventsApi,sendMsgListApi } from '@/api/live'
import { formatTime } from '@/utils/index'
import { ref, nextTick,computed, onMounted } from 'vue'
import { onLoad, onShow,onHide, onShareAppMessage } from "@dcloudio/uni-app";
import dateRangePicker from '@/components/date-range-picker/index.vue'
import pushpinDoc from './pushpinDoc.vue'

const showDesktop = ref(false)

import { useUserStore } from "@/stores/user";
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || {})

const title = ref('')
const liveId = ref('')
const liveDetail = ref({})
const noticeBarText = ref('')
const timer = ref(null)

onLoad(async (options) => {
  liveId.value = options.liveId || uni.getStorageSync('liveId')
  uni.setStorageSync('liveId', liveId.value)
  getLiveDetail()
  visitMarkdown()
});


onShow(() => {
  const liveId = uni.getStorageSync('liveId')
   // 将liveId添加到url中
  /**
   * 在 H5 环境为当前地址追加/更新 liveId 查询参数
   * - 目的：使分享链接或刷新后仍保留当前直播间标识
   * - 仅在桌面/浏览器端执行，避免非 H5 端报错
   */
  // #ifdef H5
  if (liveId) {
    addLiveIdQueryToUrl(liveId)
  }
  // #endif


  timer.value = null
  timer.value = setInterval(() => {
    pollMessageEvents()
  }, 3000)
});

onHide(() => {
  clearInterval(timer.value)
})

onShareAppMessage(() => {
  return {
    title: title.value,
    path: `/pages/index/index?liveId=${liveId.value}`
  }
})

/**
 * 添加或更新 URL 中的 liveId 查询参数（H5）
 * - 若已有 `liveId`，则更新其值；否则追加该参数
 * - 使用 History API 替换地址，不触发页面跳转
 * @param {string|number} id - 直播间标识
 */
const addLiveIdQueryToUrl = (id) => {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('liveId', String(id))
    window.history.replaceState(null, '', url.toString())
  } catch (err) {
    console.error('更新URL liveId失败:', err)
  }
}

const handleLogin = () => {
  const pages = getCurrentPages();
  const options = pages[pages.length - 1].options
  const redirect =`/${pages[pages.length - 1].route}?${Object.keys(options).map(key => `${key}=${options[key]}`).join('&')}`
  uni.navigateTo({
    url: `/pages/login/index?redirect=${encodeURIComponent(redirect)}`
  })
}

const visitMarkdown = async () => {
  if(!userInfo.value.id) {
    return
  }
  await visitMarkdownApi({})
}

const readMarkdown = async () => {
  if(!userInfo.value.id) {
    return
  }
  try {
    const lastMsg = msgList.value[msgList.value.length - 1]
    await readMarkdownApi({
      msgId: lastMsg.id,
      channelId: lastMsg?.channelId
    })
  } catch (error) {
    console.log('--------------↓↓↓↓↓---------------------')
    console.log(error)
    console.log('--------------↑↑↑↑↑---------------------')
  }
}



const pollMessageEvents = async () => {
  if(!userInfo.value.id) {
    return false
  }
  const { data } = await msgEventsApi({
    liveId: +liveId.value
  })
  if(
    !startTime.value &&
    (isAtBottom.value || !hasScrollbar.value) &&
    ((data.forum && plateType.value === 1) ||
    (data.teacher && plateType.value === 2) ||
    (data.privateChat && plateType.value === 3) ||
    (data.highQuality && plateType.value === 4))
  ) {
    console.log('--------------↓↓↓↓↓---------------------')
    console.log('收到新消息，刷新消息列表')
    console.log('--------------↑↑↑↑↑---------------------')
    await initData(false, true)
    readMarkdown()
  }
}

const getLiveDetail = async () => {
  const { data } = await liveDetailApi({
    id: +liveId.value
  })
  liveDetail.value = data || {}
  title.value = liveDetail.value?.name || '量化财经指标'
  noticeBarText.value = liveDetail.value?.notificationMsg || ''
  await initData()
}

const lastMsgId = ref(undefined)
const msgList = ref([])
const startTime = ref(undefined)
const endTime = ref(undefined)
const showDatePicker = ref(false)
// 日期选择器底部偏移，按平台动态设置
const datePickerBottom = ref('90rpx')
/**
 * 设置日期选择器底部偏移（平台兼容）
 * - H5: 使用 '90rpx'，通常用于避让底部区域
 * - 小程序 (MP): 使用 '0rpx'，贴底显示以获得更自然的交互
 */
// #ifdef MP
datePickerBottom.value = '0rpx'
// #endif

const handleShowCalendar = () => {
  showDatePicker.value = true
}
const closeDatePicker = () => {
  showDatePicker.value = false
}
const confirmDate = async (dates) => {
  showDatePicker.value = false
  // 将dates的第一个和最后一个元素赋值给startTime和endTime
  // 注意：dates的元素是字符串类型，需要转换为毫秒时间戳， 开始时间从00:00:00开始，结束时间从23:59:59结束
  if(dates?.length >= 2) {
    startTime.value = new Date(dates[0] + ' 00:00:00').getTime()
    endTime.value = new Date(dates[dates.length - 1] + ' 23:59:59').getTime()
    lastMsgId.value = undefined
    await getMsgList(true)
    scrollToBottom()
  }
}

const plateType = ref(1)
const plateTypeIndex = ref(0)
const tabList = ref([
  { label: '互动', plateType: 1 },
  { label: '老师', plateType: 2 },
  { label: '私聊', plateType: 3 },
  { label: '精选', plateType: 4 }
])

const handleTypeClick = async (item,index) => {
  if(index === plateTypeIndex.value) {
    return
  }
  plateType.value = item.plateType
  plateTypeIndex.value = index
  initData()
}

const gotoPrivateChat = () => {
  handleTypeClick(tabList.value[2], 2)
}



const initData = async (clearList = true, initScroll = true) => {
  lastMsgId.value = undefined
  startTime.value = undefined
  endTime.value = undefined
  if (clearList) {
    msgList.value = []
  }
  await getMsgList(true)
  if(initScroll) {
    scrollToBottom()
  }
}

const msgListRef = ref(null)
const scrollIntoViewId = ref('')
const bottomAnchorId = 'msg-bottom'
const loading = ref(false)

// 是否处于底部的状态标识
const isAtBottom = ref(false)
// 判断 msg-scroll 是否存在滚动条
const hasScrollbar = ref(false)
// 当前滚动容器（scroll-view）的可视高度，用于计算是否在底部
const scrollContainerHeight = ref(0)
// 底部判断阈值（像素），允许一定误差
const BOTTOM_THRESHOLD = 50

/**
 * 测量滚动容器高度
 * - 仅在未测量或布局变化后调用，减少频繁测量
 * @returns {Promise<number>} 返回容器高度
 */
const measureScrollContainer = () => {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
      .select('#msg-scroll')
      .boundingClientRect((rect) => {
        scrollContainerHeight.value = rect?.height || 0
        resolve(scrollContainerHeight.value)
      })
      .exec()
  })
}

/**
 * 监听滚动事件，实时判断是否处于底部
 * - 依据 scrollTop 与 scrollHeight 以及容器高度进行计算
 * - 距离底部小于阈值则认为在底部
 * @param {Object} e - 滚动事件对象，来自 scroll-view 的 @scroll
 */
const handleScroll = async (e) => {
  const { detail = {} } = e || {}
  const { scrollTop = 0, scrollHeight = 0 } = detail
  if (!scrollContainerHeight.value) {
    await measureScrollContainer()
  }
  const distanceToBottom = scrollHeight - (scrollTop + scrollContainerHeight.value)
  isAtBottom.value = distanceToBottom <= BOTTOM_THRESHOLD
  // 同步更新是否存在滚动条（scrollHeight 大于容器可视高度表示有滚动条）
  hasScrollbar.value = scrollHeight > (scrollContainerHeight.value + 1)
}

onMounted(async () => {
  await nextTick()
  await measureScrollContainer()
})

const scrollToBottom = async () => {
  // 先清空以触发后续变更
  scrollIntoViewId.value = ''
  await nextTick()
  // 设置到底部锚点，scroll-view 将滚动到底部
  scrollIntoViewId.value = bottomAnchorId
}

const handleScrollToUpper = () => {
  getMsgList()
}

const handleScrollToLower = async () => {
  await initData(false, false)
}

/**
 * 获取消息列表并更新视图
 * @param {boolean} init - 是否为初始化加载
 */
const getMsgList = async (init = false) => {
  try {
    if(loading.value) {
      return
    }
    loading.value = true
    const res = await getMsgListApi({
      bizPlateType: plateType.value,
      lastMsgId: lastMsgId.value || undefined,
      liveId: +liveId.value,
      startTime: startTime.value || undefined,
      endTime: endTime.value || undefined,
    })
    const newBatch = res.data || []
    msgList.value = init ? newBatch : [ ...newBatch, ...msgList.value]
    lastMsgId.value = msgList.value[0]?.id || undefined
    await nextTick()
    // 新数据渲染后，更新容器高度（避免布局改变导致判断不准）
    await measureScrollContainer()
    // 渲染结束后主动检测是否存在滚动条
    await checkScrollbar()
  } catch (error) {
    console.error("获取消息列表失败:", error);
    uni.showToast({
      title: `获取消息列表失败:${error.message}`,
      icon: "none",
    });
  } finally {
    loading.value = false
  }
}

/**
 * 检测 msg-scroll 是否存在垂直滚动条
 * - H5 环境使用原生 DOM 获取 `scrollHeight` 与 `clientHeight`
 * - 其他平台保守兜底，依赖滚动事件实时更新（handleScroll 内已更新）
 * @returns {Promise<boolean>} 是否存在滚动条
 */
const checkScrollbar = async () => {
  if (!scrollContainerHeight.value) {
    await measureScrollContainer()
  }
  // #ifdef H5
  try {
    const el = document.getElementById('msg-scroll')
    if (el) {
      hasScrollbar.value = (el.scrollHeight - el.clientHeight) > 1
      return hasScrollbar.value
    }
  } catch (err) {
    console.warn('检测滚动条失败(H5):', err)
  }
  // #endif
  // 非 H5 环境：保持当前状态，不做覆盖
  return hasScrollbar.value
}

const content = ref('')

const sendMessage = async () => {
  if(!userInfo.value.id) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }
  if(!content.value) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }
  try {
    const res = await sendMsgListApi({
      plateType: plateType.value,
      content: content.value,
      liveId: +liveId.value,
    })
    if(res.code === 1) {
      msgList.value.push({
        senderAvatar: userInfo.value?.avatar || '',
        senderNickname: userInfo.value?.nickname || '',
        createTime: Date.now(),
        selfFlag: true,
        content: content.value,
      })
      content.value = ''
      await scrollToBottom()
    }
  } catch (error) {
    console.error("发送消息失败:", error);
    uni.showToast({
      title: `发送消息失败:${error.message}`,
      icon: "none",
    });
  }
}

</script>

<style lang="scss">
</style>
