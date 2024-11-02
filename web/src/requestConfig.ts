/*
 * @Author: 赵伟
 * @Date: 2024-03-25 13:52:54
 * @Description: 网络请求配置，详情请参考 https://umijs.org/docs/max/request
 */
import type {
  AxiosRequestConfig,
  AxiosResponse,
  RequestConfig,
  RequestError,
} from '@umijs/max';
import { message } from 'antd';

// [antd: Notification] You are calling notice in render which will break in React 18 concurrent mode. Please trigger in effect instead.
const popupError = (
  error: string,
  skipErrorHandler: boolean | undefined = false,
) => {
  if (!skipErrorHandler) {
    // 直接调用 message.error 有时候不弹出来
    setTimeout(() => {
      message.error(error);
    }, 100);
  }
};

/**
 * Umi Max 网络请求配置
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  timeout: 120 * 1000,
  requestInterceptors: [
    (url: string, options: AxiosRequestConfig) => {
      return { url, options };
    },
  ],
  responseInterceptors: [
    [
      (response: AxiosResponse) => {
        const { status, data } = response || {};
        if (status >= 200 && status < 300) {
          if (data && (data instanceof Blob || data.code === 200)) {
            return response;
          } else {
            popupError(data?.msg ?? '请求失败');
            return Promise.reject(response);
          }
        } else {
          popupError('请求失败');
          return Promise.reject(response);
        }
      },
      (error: RequestError) => {
        popupError(error.message ?? '请求失败');
        return Promise.reject(error);
      },
    ],
  ],
};
