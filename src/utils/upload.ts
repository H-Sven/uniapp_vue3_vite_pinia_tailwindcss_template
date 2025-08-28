import type { APIResponse } from './request';

/**
 * 文件上传请求
 * 支持小程序和H5
 * @param filePath 文件路径
 * @returns Promise<APIResponse<{ url: string }[]>>
 */
export const commonUploadFile = (
  filePath: string,
): Promise<APIResponse<{ url: string }[]>> => {
  console.log('filePath', filePath);
  return new Promise((resolve) => {
    uni.uploadFile({
      url: 'xxxxxxxxxx/api//upload',
      filePath,
      name: 'files',
      formData: {
        group: 'resource',
      },
      header: {
        Authorization: uni.getStorageSync<string>('token'),
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
