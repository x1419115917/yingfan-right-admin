import axios from '@/libs/api.request'

// 列表
export const activityList = data => {
  return axios.request({
    url: '/homePge/operation/activity/list',
    data,
    method: 'post'
  })
}
// 新增主题
export const saveActivity = data => {
  return axios.request({
    url: '/homePge/operation/activity/save',
    data,
    method: 'post'
  })
}
// 更新主题
export const updateActivity = data => {
  return axios.request({
    url: '/homePge/operation/activity/update',
    data,
    method: 'post'
  })
}
// 主题详情
export const activityDetail = data => {
  return axios.request({
    url: '/homePge/operation/activity/detail',
    data,
    method: 'post'
  })
}
// 删除主题
export const activityRemove = data => {
  return axios.request({
    url: '/homePge/operation/activity/remove',
    data,
    method: 'post'
  })
}
