import axios from '@/libs/api.request'

// 品牌列表
export const listBrandsPage = data => {
  return axios.request({
    url: '/brand/operation/listBrandsPage',
    data,
    method: 'post'
  })
}
// 类目树结构
export const categoryTreeList = data => {
  return axios.request({
    url: '/category/operation/treeList',
    data,
    method: 'post'
  })
}
// 上传
export const singleUpload = data => {
  return axios.request({
    url: '/base/oss/singleUpload',
    data,
    method: 'post'
  })
}
// 添加品牌 /brand/operation/detail
export const brandSave = data => {
  return axios.request({
    url: '/brand/operation/save',
    data,
    method: 'post'
  })
}
// 品牌详情
export const brandDetail = data => {
  return axios.request({
    url: '/brand/operation/detail',
    data,
    method: 'post'
  })
}
// 品牌更新
export const brandUpdate = data => {
  return axios.request({
    url: '/brand/operation/update',
    data,
    method: 'post'
  })
}
// 品牌删除 /brand/operation/remove
export const brandRemove = data => {
  return axios.request({
    url: '/brand/operation/remove',
    data,
    method: 'post'
  })
}
// 添加类目
export const catgSave = data => {
  return axios.request({
    url: '/category/operation/save',
    data,
    method: 'post'
  })
}
// 查询类目/category/operation/detail
export const catgDetail = data => {
  return axios.request({
    url: '/category/operation/detail',
    data,
    method: 'post'
  })
}
// 删除品类
export const catgRemove = data => {
  return axios.request({
    url: '/category/operation/remove',
    data,
    method: 'post'
  })
}
// 编辑品类
export const catgUpdate = data => {
  return axios.request({
    url: '/category/operation/update',
    data,
    method: 'post'
  })
}
// 模板列表 /product/spec/list
export const specList = data => {
  return axios.request({
    url: '/product/spec/list',
    data,
    method: 'post'
  })
}
// 批量删除规格属性接口
export const specBatchRemove = data => {
  return axios.request({
    url: '/product/spec/batchRemove',
    data,
    method: 'post'
  })
}
// 品牌类型
export const brandListBrands = data => {
  return axios.request({
    url: '/brand/operation/listBrands',
    data,
    method: 'post'
  })
}
// 新增规格属性
export const saveSpec = data => {
  return axios.request({
    url: '/product/spec/save',
    data,
    method: 'post'
  })
}
// 编辑
export const editSpec = id => {
  let data = {}
  return axios.request({
    url: `/product/spec/edit?id=${id}`,
    data,
    method: 'get'
  })
}
// 更新属性
export const updateSpec = data => {
  return axios.request({
    url: '/product/spec/update',
    data,
    method: 'post'
  })
}
// 批量删除属性/product/spec/batchRemove
export const batchRemoveSpec = data => {
  return axios.request({
    url: '/product/spec/batchRemove',
    data,
    method: 'post'
  })
}
