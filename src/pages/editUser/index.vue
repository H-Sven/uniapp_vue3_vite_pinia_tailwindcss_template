<template>
  <PageWrapper title="编辑用户信息" :hideBackIcon="hideBackIcon">
    <view class="mt-10 flex flex-col items-center p-4">
      <up-avatar
        :src="avatar"
        bg-color="#f0f0f0"
        size="100"
        shape="circle"
        @click="gotoPrivateChat(item)"
      />
      <button class="mt-4 text-base py-1.5" @click="onChangeAvatar">上传头像</button>

      <view class="mt-10 flex items-center w-full">
        <view class="label mr-4 text-lg">昵称:</view>
        <up-input
          v-model="nickname"
          placeholder="请输入昵称"
          maxlength="20" border="surround" class="bg-white flex-1" />
      </view>

      <button class="mt-10 w-full rounded-full bg-[#007AFF] text-white" @click="onSave">保存</button>
    </view>
  </PageWrapper>
</template>

<script setup>
import PageWrapper from '@/components/PageWrapper/index.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { commonUploadFile } from '@/utils/upload'
import { onLoad} from "@dcloudio/uni-app";

const userStore = useUserStore()

const hideBackIcon = ref(true)
onLoad(async (options) => {
  if (options?.from === 'mine') {
    hideBackIcon.value = false
  }
});


const avatar = ref('')
const nickname = ref(userStore.userInfo?.nickname || '')


/**
 * 选择并上传头像
 * - 支持相册/拍照选择图片
 * - 上传成功后设置为新的头像 URL
 */
const onChangeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      try {
        const filePath = res?.tempFilePaths?.[0]
        if (!filePath) return
        const uploadRes = await commonUploadFile(filePath)
        const url = uploadRes?.data?.[0]
        if (url) {
          avatar.value = url
        } else {
          uni.showToast({ title: '上传失败', icon: 'none' })
        }
      } catch (error) {
        console.error('上传头像失败:', error)
        uni.showToast({ title: '上传失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.showToast({ title: '未选择图片', icon: 'none' })
    }
  })
}

/**
 * 保存用户信息
 */
const onSave = async () => {
  const name = (nickname.value || '').trim()
  if (!avatar.value) {
    uni.showToast({ title: '请上传头像', icon: 'none' })
    return
  }
  if (!name) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  if (name.length < 2) {
    uni.showToast({ title: '昵称至少 2 个字符', icon: 'none' })
    return
  }

  try {
    const res = await userStore.updateUserInfo({ avatar: avatar.value, nickname: name })
    if (res?.code === 1) {
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 1000);
    } else {
      uni.showToast({ title: res?.message || '保存失败', icon: 'none' })
    }
  } catch (error) {
    console.error('保存用户信息失败:', error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}
</script>
