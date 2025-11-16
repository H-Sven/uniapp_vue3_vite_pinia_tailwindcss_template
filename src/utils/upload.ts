import type { APIResponse } from './request';
import { GET_CONFIG_ENV } from '@/utils/config';

/**
 * 文件上传请求
 * 支持小程序和H5
 * @param filePath 文件路径
 * @returns Promise<APIResponse<{ url: string }[]>>
 */
export const commonUploadFile = (
  filePath: string,
): Promise<APIResponse<{ url: string }[]>> => {
  const { API_BASE_URL } = GET_CONFIG_ENV()
  return new Promise((resolve) => {
    uni.uploadFile({
      url: API_BASE_URL + '/upload/image/upload',
      filePath,
      name: 'file',
      formData: {},
      header: {
        token: uni.getStorageSync<string>('token'),
      },
      success: (res) => {
        console.log('res', res);
        setTimeout(() => {
          resolve(JSON.parse(res.data));
        }, 1000);
      },
    });
  });
};
