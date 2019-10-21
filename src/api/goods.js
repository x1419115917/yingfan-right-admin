import axios from '@/libs/api.request'

// 商品列表
export const listGoodsPage = data => {
  return axios.request({
    url: '/product/spu/listPage',
    data,
    method: 'post'
  })
}
// 更新上下架
export const saleableFn = data => {
  return axios.request({
    url: '/product/spu/saleable',
    data,
    method: 'post'
  })
}
// 添加商品
export const saveGoods = data => {
  return axios.request({
    url: '/product/spu/save',
    data,
    method: 'post'
  })
}
// 根据spuId查询商品属性和sku信息
export const skuSpec = spuId => {
  let data = {}
  return axios.request({
    url: `/product/spu/skuSpec/${spuId}`,
    data,
    method: 'post'
  })
}
// 编辑商品
export const updateGoods = data => {
  return axios.request({
    url: '/product/spu/update',
    data,
    method: 'post'
  })
}
// 根据spuId查询商品共有信息
export const catgDetail = spuId => {
  let data = {}
  return axios.request({
    url: `/product/spu/${spuId}`,
    data,
    method: 'post'
  })
}
