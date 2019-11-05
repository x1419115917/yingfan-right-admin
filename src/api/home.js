import axios from '@/libs/api.request'

// 首页banner列表
export const doBannerList = data => {
  return axios.request({
    url: '/homePge/operation/list',
    data,
    method: 'post'
  })
}
// 专题活动列表
export const doActiveList = data => {
  return axios.request({
    url: '/homePge/operation/activity/list',
    data,
    method: 'post'
  })
}
// 查询首页banner详细信息
export const doBannerDetail = data => {
  return axios.request({
    url: '/homePge/operation/detail',
    data,
    method: 'post'
  })
}
// 新增首页版块
export const doAddHomeBanner = data => {
  return axios.request({
    url: '/homePge/operation/save',
    data,
    method: 'post'
  })
}
// 编辑首页版块
export const doEditHomeBanner = data => {
  return axios.request({
    url: '/homePge/operation/update',
    data,
    method: 'post'
  })
}
// 编删除首页版块
export const doRemoveHomeBanner = data => {
  return axios.request({
    url: '/homePge/operation/remove',
    data,
    method: 'post'
  })
}