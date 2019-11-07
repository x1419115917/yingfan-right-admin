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
// 售后订单列表
export const doAfterSaleOrderList = data => {
  return axios.request({
    url: '/refund/operation/list',
    data,
    method: 'post'
  })
}
// 售后订单详情
export const doAfterSaleOrderDetail = data => {
  return axios.request({
    url: '/refund/operation/getRefundDetail',
    data,
    method: 'post'
  })
}
// 修改售后订单状态
export const doAfterSaleOrderStatus = data => {
  return axios.request({
    url: '/refund/operation/updateRefundStatus',
    data,
    method: 'post'
  })
}
