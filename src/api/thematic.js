import axios from '@/libs/api.request'

// 列表
export const activityList = data => {
  return axios.request({
    url: '/homePge/operation/activity/list',
    data,
    method: 'post'
  })
}
