import axios from '@/libs/api.request'

// 客服列表
export const listCustomer = data => {
  return axios.request({
    url: '/customer/v1/list',
    data,
    method: 'post'
  })
}
// 保存客服
export const saveCustomer = data => {
  return axios.request({
    url: '/customer/v1/save',
    data,
    method: 'post'
  })
}
// 更新客服
export const updateCustomer = data => {
  return axios.request({
    url: '/customer/v1/update',
    data,
    method: 'post'
  })
}
// 详情
export const detailCustomer = data => {
  return axios.request({
    url: '/customer/v1/detail',
    data,
    method: 'post'
  })
}
