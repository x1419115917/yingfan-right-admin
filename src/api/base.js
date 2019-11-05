import axios from '@/libs/api.request'

// 上传
export const singleUpload = data => {
  return axios.request({
    url: '/base/oss/singleUpload',
    data,
    method: 'post'
  })
}
// 后面移入首页home.js
// 图标列表
export const iconsList = data => {
  return axios.request({
    url: '/homePge/operation/icons/list',
    data,
    method: 'post'
  })
}
// 新增图标
export const saveIcons = data => {
  return axios.request({
    url: '/homePge/operation/icons/save',
    data,
    method: 'post'
  })
}
// 图标更新
export const updateIcons = data => {
  return axios.request({
    url: '/homePge/operation/icons/update',
    data,
    method: 'post'
  })
}
// 图标详情
export const iconsDetail = data => {
  return axios.request({
    url: '/homePge/operation/icons/detail',
    data,
    method: 'post'
  })
}
// 删除图标 /homePge/operation/icons/remove
export const iconsRemove = data => {
  return axios.request({
    url: '/homePge/operation/icons/remove',
    data,
    method: 'post'
  })
}
