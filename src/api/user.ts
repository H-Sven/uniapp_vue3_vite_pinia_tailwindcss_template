import { post, get, put } from '@/utils/request';
import type { LoginParams, LoginResponse, UserInfo } from '@/types';

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function login(params: LoginParams): Promise<LoginResponse> {
  return post('/auth/login', params);
}

/**
 * 获取用户信息
 * @param id 用户ID
 * @returns 用户信息
 */
export function getUserInfo(id?: number): Promise<UserInfo> {
  return get(id ? `/user/${id}` : '/user/info');
}

/**
 * 更新用户信息
 * @param data 用户信息
 * @returns 更新结果
 */
export function updateUserInfo(data: Partial<UserInfo>): Promise<UserInfo> {
  return put('/user/info', data);
}
