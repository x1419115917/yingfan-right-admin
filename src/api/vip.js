import axios from '@/libs/api.request'

// 存储升级VIP活动页面设置
export const saveVipActive = data => {
  return axios.request({
    url: '/vip/saveVipActive',
    data,
    method: 'post'
  })
}
// 获取升级VIP活动设置内容
export const queryVipActive = data => {
  return axios.request({
    url: '/vip/queryVipActive',
    data,
    method: 'get'
  })
}
// 存储升级VIP活动页面设置
export const detailSpu = spuVipId => {
  data = {}
  return axios.request({
    url: `/vip/detail/${spuVipId}`,
    data,
    method: 'get'
  })
}
// 查询VIP活动商品列表
export const vipList = data => {
  return axios.request({
    url: '/vip/list',
    data,
    method: 'post'
  })
}
// 保存更新VIP活动
export const vipSave = data => {
  return axios.request({
    url: '/vip/save',
    data,
    method: 'post'
  })
}
// 根据选中spuId获取skus
export const getSKus = spuId => {
  let data = {}
  return axios.request({
    url: `/vip/skus/${spuId}`,
    data,
    method: 'get'
  })
}
