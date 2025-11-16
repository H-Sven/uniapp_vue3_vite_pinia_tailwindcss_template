<template>
  <view class="message-item flex items-start mb-4 w-full overflow-auto gap-2" :class="{'flex-row-reverse ': isSelfAndPrivateChat}">
    <up-avatar
      :src="item?.senderAvatar"
      bg-color="#f0f0f0"
      size="40"
      shape="square"
      @click="gotoPrivateChat(item)"
    />
    <view class="flex flex-col flex-1 items-start overflow-hidden" :class="{'items-end': isSelfAndPrivateChat}">
      <view class="text-xs text-[#888] mb-1 w-full truncate"
        :class="{
          'text-[red]': !item?.selfFlag,
          'text-end': isSelfAndPrivateChat
        }"
      ><text>{{ item?.selfFlag ? '我': item?.senderNickname }}</text> <text>{{ formatTime(item?.createTime, 'MM-DD HH:mm') }}</text></view>
      <view v-if="item.highQualityFlag" class="text-xs text-[red] mb-1 flex items-center ">
        <up-icon name="star-fill" color="red" class="mr-1" size="14"></up-icon>
        <text>精选</text>
      </view>
      <view :class="{'cherrypick-content':item.highQualityFlag}" class="text-base text-[#333] p-2.5 rounded bg-white w-fit  max-w-full flex flex-col items-start overflow-hidden">
        <view class="flex flex-col" :class="{ '!flex-col-reverse': item.imageAboveFlag }">
          <view>
            <view class="w-full whitespace-pre-wrap break-words overflow-hidden">{{ item?.content }}</view>
            <view class="w-full whitespace-pre-wrap break-words overflow-hidden underline hover:text-[#004499] text-[#0066cc]" @click="previewLink(item.link)">{{ item.link }}</view>
          </view>
          <image
            v-if="item.image"
            :src="item.image"
            @click="previewImage(item.image)"
            class="w-[550rpx] mt-1 mb-1"
          />
        </view>
      </view>
      <view v-if="item.refMsg?.id" class="text-xs text-[#333] p-2.5 rounded bg-[#e8e8e8] w-fit whitespace-pre-wrap break-words mt-1">
        <view>@{{ item.refMsg?.senderNickname }}</view>
        <view class="flex flex-col" :class="{ '!flex-col-reverse': item.refMsg?.imageAboveFlag }">
          <view>
            <view class="w-full whitespace-pre-wrap break-words overflow-hidden">{{ item.refMsg?.content }}</view>
            <view class="w-full whitespace-pre-wrap break-words overflow-hidden underline hover:text-[#004499] text-[#0066cc]" @click="previewLink(item.refMsg?.link)">{{ item.refMsg?.link }}</view>
          </view>
          <image
            v-if="item.refMsg?.image"
            :src="item.refMsg?.image"
            @click="previewImage(item.refMsg?.image)"
            class="w-[550rpx] mt-1 mb-1"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref,computed } from 'vue'
import { formatTime } from '@/utils/index'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  plateType: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['gotoPrivateChat'])

const isSelfAndPrivateChat = computed(() => props.item.selfFlag && props.plateType === 3)

const gotoPrivateChat = (item) => {
  if(item.canPrivateChatFlag) {
    emit('gotoPrivateChat')
  }
}

const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
  })
}

const previewLink = (url) => {
  const linkUrl = url.includes('http') ? url : `https://${url}`;
  // #ifdef H5
  window.open(linkUrl, '_blank');
  // #endif

  // #ifdef MP
  uni.setClipboardData({
    data: linkUrl,
    success: () => {
      uni.showToast({
        title: '链接已复制, 请在浏览器中打开',
        icon: 'none'
      })
    },
    fail: () => {
      uni.showToast({
        title: '复制链接失败',
        icon: 'none'
      })
    },
  })
  // #endif
}
</script>

<style scoped lang="scss">
.cherrypick-content {
  background: linear-gradient(to right, #f7efec, #efddd7);
  border: 1px solid #ff5722;
  border-left: 4px solid #ff5722;
  color: #7d4a7d !important;
}
</style>

