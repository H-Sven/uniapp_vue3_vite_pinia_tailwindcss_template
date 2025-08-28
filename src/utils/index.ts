export const goBack = () => uni.navigateBack();

/**
 * 获取OSS缩略图
 * @param url 图片地址
 * @param width 目标缩放图的宽度
 * @param height 目标缩放图的宽度
 * @returns 缩略图地址
 */
export const getOSSResizeUrl = ({
  url,
  width,
  height,
}: {
  url: string;
  width?: number;
  height?: number;
}) => {
  if (!url) return '';

  const isOSS = url.includes('//xyszr.oss-cn-hangzhou.aliyuncs.com');
  if (isOSS) {
    // OSS resize 参数说明： https://help.aliyun.com/zh/oss/user-guide/resize-images-4?spm=a2c4g.11186623.0.0.2379737146ZU7O#section-vyx-j4n-vdb
    url += `?x-oss-process=image/resize`;

    if (width) {
      url += `,w_${width}`;
    }

    if (height) {
      url += `,h_${height}`;
    }
  }
  return url;
};

/**
 * 获取视频OSS缩略URL（使用OSS图片处理服务）
 * @param ossVideoUrl OSS视频完整URL
 * @param options 缩略图配置选项
 * @returns 缩略图URL
 */
export function getVideoOSSResizeUrl(
  ossVideoUrl: string,
  options: {
    width?: number; // 缩略图宽度
    height?: number; // 缩略图高度
    time?: number; // 截取时间点（秒），默认0
    format?: 'jpg' | 'png'; // 输出格式
    quality?: number; // 质量 (0-100)
  } = {},
): string {
  // 确保是OSS的URL
  if (!ossVideoUrl.includes('oss-') || !ossVideoUrl.includes('aliyuncs.com')) {
    throw new Error('Invalid OSS video URL');
  }

  const {
    width = 1000,
    height = 600,
    time = 0,
    format = 'jpg',
    quality = 80,
  } = options;

  // 构造OSS图片处理参数
  const params = [
    `x-oss-process=video/snapshot`,
    `t_${Math.round(time * 1000)}`, // 转换为毫秒
    `f_${format}`,
    // `w_${width}`,
    // `h_${height}`,
    `q_${quality}`,
  ].join(',');

  // 如果原始URL已经有查询参数
  const separator = ossVideoUrl.includes('?') ? '&' : '?';
  return `${ossVideoUrl}${separator}${params}`;
}

/**
 * 通用工具函数
 */

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化时间
 * @param time 时间戳或日期字符串
 * @param format 格式化模板
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  time: string | number | Date,
  format = 'YYYY-MM-DD HH:mm:ss',
): string {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 深拷贝
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as { [key in keyof T]: T[key] };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 获取当前平台
 * @returns 平台名称
 */
export function getCurrentPlatform(): string {
  // #ifdef H5
  return 'h5';
  // #endif

  // #ifdef MP-WEIXIN
  return 'mp-weixin';
  // #endif

  // #ifdef MP-ALIPAY
  return 'mp-alipay';
  // #endif

  // #ifdef MP-BAIDU
  return 'mp-baidu';
  // #endif

  // #ifdef MP-TOUTIAO
  return 'mp-toutiao';
  // #endif

  // #ifdef APP-PLUS
  return 'app';
  // #endif

  return 'unknown';
}

/**
 * 安全地进行页面跳转
 * @param url 跳转地址
 * @param type 跳转方式
 */
export function safeNavigate(
  url: string,
  type: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' = 'navigateTo',
) {
  if (!url) {
    console.warn('URL不能为空');
    return;
  }

  try {
    switch (type) {
      case 'navigateTo':
        uni.navigateTo({ url });
        break;
      case 'redirectTo':
        uni.redirectTo({ url });
        break;
      case 'reLaunch':
        uni.reLaunch({ url });
        break;
      case 'switchTab':
        uni.switchTab({ url });
        break;
    }
  } catch (error) {
    console.error('页面跳转失败:', error);
    uni.showToast({
      title: '页面跳转失败',
      icon: 'none',
    });
  }
}

/**
 * 手机号脱敏
 * @param phone 手机号
 * @returns 脱敏后的手机号
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 11) {
    return phone;
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 身份证号脱敏
 * @param idCard 身份证号
 * @returns 脱敏后的身份证号
 */
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 15) {
    return idCard;
  }
  return idCard.replace(/(\d{6})\d*(\d{4})/, '$1****$2');
}

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 验证邮箱格式
 * @param email 邮箱
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 在H5端下载文件。
 * 非同源文件下载如需指定文件名，需先使用fetch将外部链接转为blob:格式。（因为a.download 只在同源 URL 或 blob:、data: 协议起作用。）
 * @param {string} url 文件URL
 * @param {string} fileName 文件名
 */
export function h5_downloadFile(url: string, fileName?: string) {
  const a = document.createElement('a');
  a.href = url;
  if (fileName) {
    // 注意：a.download 只在同源 URL 或 blob:、data: 协议起作用
    a.download = fileName; // 指定文件名。
    // download如果没有指定值，浏览器会从多个来源决定文件名和扩展名：
    //   Content-Disposition HTTP 标头。
    //   URL 路径的最后一段。
    //   媒体类型。来自 Content-Type 标头，data: URL 的开头，或 blob: URL 的 Blob.type
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 在微信端文件预览。文件类型有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
 * @param arrayBuffer ArrayBuffer 文件地址
 * @param fileName string 文件名
 * @returns
 */
export const weixin_openDocument = (
  arrayBuffer: ArrayBuffer,
  fileName: string,
) => {
  // 获取文件保存路径
  const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`; // 文件保存路径
  console.log('filePath', filePath);
  const fs = uni.getFileSystemManager(); // 获取文件系统管理器

  fs.writeFile({
    filePath: filePath, // 文件路径
    data: arrayBuffer, // ArrayBuffer 数据
    encoding: 'binary', // 编码方式
    success: () => {
      console.log('文件保存成功:', filePath);

      // 3. 提示用户下载成功
      uni.showToast({
        title: '文件下载成功',
        icon: 'success',
      });

      // 4. 打开文件（可选）
      uni.openDocument({
        filePath: filePath,
        showMenu: true,
        success: (res) => {
          console.log('打开文件成功:', res);
        },
        fail: (err) => {
          console.error('打开文件失败:', err);
        },
      });
    },
    fail: (err) => {
      console.error('文件保存失败:', err);
      uni.showToast({
        title: '文件保存失败',
        icon: 'none',
      });
    },
  });
};

/**
 * 获取用户相册授权
 * @param handleDownload 保存函数
 */
export const getUserSetting = (handleDownload: Function) => {
  uni.showLoading({
    title: '加载中...',
    mask: true,
  });
  uni.getSetting({
    success(res) {
      if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
        // 用户从来没有授权过
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            console.log('打开了授权');
            handleDownload();
          },
          fail(err) {
            uni.showToast({
              title: '授权失败',
              icon: 'none',
            });
          },
        });
      } else if (!res.authSetting['scope.writePhotosAlbum']) {
        // 用户授权过之后又关闭授权
        uni.openSetting({
          success(res) {
            console.log(res);
            if (res.authSetting['scope.writePhotosAlbum']) {
              console.log('授权了');
              handleDownload();
            } else {
              uni.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none',
              });
            }
          },
          fail(err) {
            uni.showToast({
              title: '授权失败',
              icon: 'none',
            });
          },
        });
      } else {
        // 用户已经授权，可以直接保存
        handleDownload();
      }
    },
    fail() {
      uni.showToast({
        title: '加载失败',
        icon: 'none',
      });
    },
    complete() {
      uni.hideLoading();
    },
  });
};

/**
 * 微信小程序保存视频或图片到系统相册
 * 参考: https://uniapp.dcloud.net.cn/api/media/image.html#saveimagetophotosalbum
 * @param link 视频/图片链接
 * @param type 'image' | 'video'
 */
export function weixin_saveImageOrVideoToPhotosAlbum(
  link: string,
  type: 'image' | 'video',
) {
  let fileName = new Date().valueOf() + type === 'image' ? '.png' : '.mp4';

  uni.downloadFile({
    url: link,
    filePath: wx.env.USER_DATA_PATH + '/' + fileName,
    success: (res) => {
      let filePath = res.filePath; //下载到本地获取临时路径

      const fn =
        type === 'image' ? 'saveImageToPhotosAlbum' : 'saveVideoToPhotosAlbum';
      uni[fn]({
        //保存到相册
        filePath,
        success: (file) => {
          uni.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 3000,
          });
          let fileMgr = uni.getFileSystemManager();
          fileMgr.unlink({
            //删除临时文件
            filePath: wx.env.USER_DATA_PATH + '/' + fileName,
          });
        },
        fail: (err) => {
          uni.showToast({
            title: '保存失败',
            icon: 'none',
          });
        },
        complete() {
          setTimeout(() => {
            uni.hideLoading();
          }, 1000);
        },
      });
    },
    fail(e) {
      uni.showToast({
        title: '保存失败',
        icon: 'none',
      });
    },
    complete() {
      setTimeout(() => {
        uni.hideLoading();
      }, 1000);
    },
  });
}

/**
 * 下载图片/视频。支持微信小程序、H5
 * @param url 图片/视频链接
 * @param type 'image' | 'video'
 * @param fileName 文件名
 */
export const downloadImageOrVideo = (
  url: string,
  type: 'image' | 'video',
  fileName?: string,
) => {
  if (!url) {
    uni.showToast({
      title: '文件不存在，请刷新页面重试',
      icon: 'none',
    });
    return;
  }

  const platform = getCurrentPlatform();

  if (platform === 'mp-weixin') {
    getUserSetting(() => weixin_saveImageOrVideoToPhotosAlbum(url, type));
  } else if (platform === 'h5') {
    // 将外部链接转为blob:格式。因为a.download 只在同源 URL 或 blob:、data: 协议起作用
    uni.request({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      success: (res) => {
        if (res.statusCode === 200) {
          const arrayBuffer = res.data; // 获取 ArrayBuffer 数据

          const blob = new Blob([arrayBuffer], {
            type: type === 'image' ? 'image/png' : 'video/mp4',
          });
          const blobUrl = URL.createObjectURL(blob);

          h5_downloadFile(blobUrl, fileName);
        } else {
          uni.showToast({
            title: '文件下载失败',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '文件下载失败',
          icon: 'none',
        });
      },
    });
  }
};

/**
 * 安全跳转函数
 * @param url 要跳转的目标URL。如果未登录，则跳转到登录页，并在查询参数中携带原始目标URL，登录成功后，再跳转到目标URL
 * @param loginUrl 登录页面URL（可选，默认为'/login'）
 */
export function safeRedirect(
  url: string,
  options?: {
    loginUrl?: string;
  },
): void {
  // 设置默认值
  const { loginUrl = '/pages/login/index' } = options || {};

  const isAuthenticated = uni.getStorageSync('token'); // 是否已认证（登录状态）

  // 检查登录状态
  if (!isAuthenticated) {
    // 未登录，跳转到登录页，并在查询参数中携带原始目标URL
    const redirectUrl = encodeURIComponent(url);
    uni.navigateTo({
      url: loginUrl + `?redirect=${redirectUrl}`,
    });
  } else {
    // 已登录，直接跳转
    uni.navigateTo({ url });
  }
}

/**
 * 11位手机号码中间四位脱敏
 * @param phone 11位手机号码
 * @returns 脱敏后的手机号码
 */
export function desensitizePhone(phone: string): string {
  if (!phone) return '';

  const firstPart = phone.slice(0, 3);
  const lastPart = phone.slice(-4);
  return `${firstPart}****${lastPart}`;
}
