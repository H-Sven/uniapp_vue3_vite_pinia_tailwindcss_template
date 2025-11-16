// stores/counter.ts
import { defineStore } from 'pinia';

import { loginApi, logoutApi, getUserInfoApi, checkMobileApi, updateUserInfoApi } from "@/api/user";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || {}
  }),
  actions: {
    setToken(data) {
      this.token = data.token;
      uni.setStorageSync('token', this.token)
    },
    setUserInfo(data) {
      this.userInfo = { ...this.userInfo, ...data };
      uni.setStorageSync('userInfo', this.userInfo);
    },
    async getUserInfo() {
      const res = await getUserInfoApi();
      this.setUserInfo(res.data);
      return res.data;
    },
    async login(params) {
      const { data } = await loginApi(params)
      this.setUserInfo(data.userInfo)
      this.setToken(data.token)
      return data
    },
    async logout(noNeedApi = false) {
      console.log('清除登录')
      try {
        if (!noNeedApi) {
          await logoutApi()
        }
        this.userInfo = null;
        this.token = null
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
      } catch (error) {
        console.log('--------------↓↓↓↓↓---------------------')
        console.log(error)
        console.log('--------------↑↑↑↑↑---------------------')
      }
    },
    // 检查手机号是否已注册
    async checkMobile(params) {
      const res = await checkMobileApi(params);
      return res.data;
    },
    // 更新当前用户信息
    async updateUserInfo(params) {
      const res = await updateUserInfoApi(params);
      if (res?.code === 1) {
        await this.getUserInfo()
        uni.showToast({ title: '保存成功', icon: 'success' })
      }
      return res
    },
  },
});