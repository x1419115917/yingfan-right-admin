import axios from '@/libs/api.request'

// 存储升级VIP活动页面设置
export const saveVipActive = data => {
  return axios.request({
    url: '/vip/saveVipActive',
    data,
    method: 'post'
  })
}
// 获取升级VIP设置内容
export const queryVipActive = activeType => {
  let data = {}
  return axios.request({
    url: `/vip/queryVipActive/${activeType}`,
    data,
    method: 'post'
  })
}
// 获取升级VIP活动设置
export const detailSpuVipId = spuVipId => {
  let data = {}
  return axios.request({
    url: `/vip/detail/${spuVipId}`,
    data,
    method: 'post'
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
export const skuSpecList = spuId => {
  let data = {}
  return axios.request({
    url: `/vip/skus/${spuId}`,
    data,
    method: 'post'
  })
}
// 删除活动 /vip/delete/{spuVipId}
export const deleteSpu = data => {
  return axios.request({
    url: `/vip/delete`,
    data,
    method: 'post'
  })
}
