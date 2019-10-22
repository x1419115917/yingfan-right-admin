import axios from '@/libs/api.request'

export const roleList = data => {
  return axios.request({
    url: '/sys/role/list',
    data,
    method: 'post'
  })
}

// /sys/role/detail 角色详情
export const roleDetail = id => {
  let data = {
    FLAG: 1
  }
  return axios.request({
    url: `/sys/role/detail/${id}`,
    data,
    method: 'post'
  })
}

// 数据字典列表
export const categoryList = data => {
  return axios.request({
    url: '/dict/category/list',
    data,
    method: 'post'
  })
}
// 供应商列表
export const supplierList = data => {
  return axios.request({
    url: '/account/supplier/list',
    data,
    method: 'post'
  })
}
// /product/brand/list 品牌列表
export const brandList = data => {
  return axios.request({
    url: '/product/brand/list',
    data,
    method: 'post'
  })
}
// 品类列表 /product/category/list
export const procategoryList = data => {
  return axios.request({
    url: '/product/category/list',
    data,
    method: 'post'
  })
}
// 供应商详情
export const editSupplier = data => {
  return axios.request({
    url: '/account/supplier/edit',
    data,
    method: 'post'
  })
}
// 分类列表
export const categList = data => {
  return axios.request({
    url: '/category/operation/list',
    data,
    method: 'post'
  })
}
// 根据品类id查询品牌
export const listBrands = data => {
  return axios.request({
    url: '/brand/operation/listBrands',
    data,
    method: 'post'
  })
}
// 新增供应商
export const saveSupplier = data => {
  return axios.request({
    url: '/account/supplier/save',
    data,
    method: 'post'
  })
}
// 删除供应商
export const removeSupplier = data => {
  return axios.request({
    url: '/account/supplier/batchRemove',
    data,
    method: 'post'
  })
}
// 更新供应商
export const updateSupplier = data => {
  return axios.request({
    url: '/account/supplier/update',
    data,
    method: 'post'
  })
}
