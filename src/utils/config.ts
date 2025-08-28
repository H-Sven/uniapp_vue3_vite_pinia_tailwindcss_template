/**
 * 配置文件
 */

// API基础URL
export const API_BASE_URL = 'https://api.example.com/v1';

// 响应状态码
export const RESPONSE_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 应用配置
export const APP_CONFIG = {
  // 应用名称
  APP_NAME: 'UniApp模板',

  // 版本号
  VERSION: '1.0.0',

  // 默认分页大小
  PAGE_SIZE: 20,

  // 请求超时时间(毫秒)
  REQUEST_TIMEOUT: 60000,

  // Token存储键名
  TOKEN_KEY: 'token',

  // 用户信息存储键名
  USER_INFO_KEY: 'userInfo',
};
