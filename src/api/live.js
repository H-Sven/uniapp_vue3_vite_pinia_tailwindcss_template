import { post, get, put } from '@/utils/request';

export function liveDetailApi(params) {
  return post('/live/detail', params);
}

export function msgEventsApi(params) {
  return post('/msg/events', params);
}

export function getMsgListApi(params) {
  return post('/msg/page', params);
}

export function sendMsgListApi(params) {
  return post('/msg/send', params);
}

export function visitMarkdownApi(params) {
  return post('/visit/markdown', params);
}

export function readMarkdownApi(params) {
  return post('/msg/read/markdown', params);
}
