/**
 * 通用类型定义
 */

/**
 * 响应数据接口
 */
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页参数
 */
export interface PageParams {
  page: number;
  size: number;
}

/**
 * 分页响应
 */
export interface PageResponse<T = any> {
  records: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  createTime?: string;
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}
