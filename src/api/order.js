import axios from '@/libs/api.request'

// 订单列表
export const doOrderList = data => {
  return axios.request({
    url: '/order/operation/list',
    data,
    method: 'post'
  })
}

// 订单详情
export const doOrderDetail = data => {
  return axios.request({
    url: '/order/operation/detail',
    data,
    method: 'post'
  })
}
