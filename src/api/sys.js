import axios from '@/libs/api.request'

export const roleList = data => {
  return axios.request({
    url: '/sys/role/list',
    data,
    method: 'post'
  })
}

// /sys/menu/tree
// 菜单树状结构数据
export const menuTree = data => {
  return axios.request({
    url: '/sys/menu/tree',
    data,
    method: 'get'
  })
}

// 菜单树状结构数据
export const saveRole = data => {
  return axios.request({
    url: '/sys/role/save',
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

// /sys/role/update
export const roleUpdate = data => {
  return axios.request({
    url: '/sys/role/update',
    data,
    method: 'post'
  })
}

// /sys/role/remove 删除角色

export const roleremove = data => {
  return axios.request({
    url: '/sys/role/remove',
    data,
    method: 'post'
  })
}

// /sys/role/batchRemove 批量删除角色
export const batchRemove = data => {
  return axios.request({
    url: '/sys/role/batchRemove',
    data,
    method: 'post'
  })
}
