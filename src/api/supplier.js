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
