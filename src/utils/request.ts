/**
 * HTTP请求工具
 * @description 基于uni.request封装的HTTP请求工具
 */

import { RESPONSE_CODE, APP_CONFIG,GET_CONFIG_ENV } from '@/utils/config';
import { useUserStore } from '@/stores/user'

/**
 * 请求配置接口
 */
interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

/**
 * 请求拦截器
 */
function requestInterceptor(config: RequestConfig) {
  const { API_BASE_URL } = GET_CONFIG_ENV()
  console.log('--------------↓↓↓↓↓---------------------')
  console.log(API_BASE_URL)
  console.log('--------------↑↑↑↑↑---------------------')
  // 添加基础URL
  if (!config.url.startsWith('http')) {
    config.url = API_BASE_URL + config.url;
  }

  // 添加请求头
  config.header = {
    'Content-Type': 'application/json',
    ...config.header,
  };

  // 添加token
  const token = uni.getStorageSync(APP_CONFIG.TOKEN_KEY);
  if (token) {
    config.header.token = `${token}`;
  }

  return config;
}

/**
 * 响应拦截器
 */
function responseInterceptor<T>(
  response: UniApp.RequestSuccessCallbackResult,
): Promise<T> {
  const { statusCode, data } = response;

  // HTTP状态码检查
  if (statusCode !== RESPONSE_CODE.SUCCESS) {
    const errorMessage = `请求失败：${statusCode}`;
    uni.showToast({
      title: errorMessage,
      icon: 'none',
    });
    return Promise.reject(new Error(errorMessage));
  }

  const userStore = useUserStore()
  const responseData = data as any

  // 业务状态码检查
  if (responseData.code !== 1) {
    const errorMessage = responseData.message || '请求失败';

    // 特殊状态码处理
    if (responseData.code === 3) {
      userStore.logout(true)
      // uni.reLaunch({
      //   url: '/pages/login/index',
      // });
    } else {
      uni.showToast({
        title: errorMessage,
        icon: 'none',
      });
    }
  }

  return Promise.resolve(responseData);
}

/**
 * 通用请求方法
 */
function request<T = any>(config: RequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    // 请求拦截
    const requestConfig = requestInterceptor(config);

    uni.request({
      ...requestConfig,
      success: (response) => {
        responseInterceptor<T>(response).then(resolve).catch(reject);
      },
      fail: (error) => {
        console.error('请求失败:', error);
        uni.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none',
        });
        reject(error);
      },
    });
  });
}

/**
 * GET请求
 */
function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  let requestUrl = url;
  if (params) {
    const queryString = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
    requestUrl += `?${queryString}`;
  }

  return request<T>({
    url: requestUrl,
    method: 'GET',
  });
}

/**
 * POST请求
 */
function post<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({
    url,
    method: 'POST',
    data,
  });
}

/**
 * PUT请求
 */
function put<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({
    url,
    method: 'PUT',
    data,
  });
}

/**
 * DELETE请求
 */
function del<T = any>(url: string): Promise<T> {
  return request<T>({
    url,
    method: 'DELETE',
  });
}

export { request, get, post, put, del };
