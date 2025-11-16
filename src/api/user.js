import { post, get, put } from '@/utils/request';

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function loginApi(params) {
  return post('/login/mobile/login', params);
}

/**
 * 退出登录
 */
export function logoutApi() {
  return post('/login/logout');
}

/**
 * 获取验证码
 */
export function getCodeApi(params) {
  return post('/login/send/otp', params);
}

/**
 * 获取用户信息
 * @param id 用户ID
 * @returns 用户信息
 */
export function getUserInfoApi() {
  return post('/user/cur/userInfo', {});
}

// 检查手机号是否已注册
export function checkMobileApi(params) {
  return post('/login/register/check', params);
}

// 更新当前用户信息
export function updateUserInfoApi(params) {
  return post('/user/update/info', params);
}
