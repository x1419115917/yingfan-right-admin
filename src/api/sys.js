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

// 树菜单列表
export const treeList = data => {
  return axios.request({
    url: '/sys/menu/treeList',
    data,
    method: 'post'
  })
}
// 树菜单新增保存
export const saveMenu = data => {
  return axios.request({
    url: '/sys/menu/save',
    data,
    method: 'post'
  })
}
// 树菜单删除 /sys/menu/remove
export const removeMenu = data => {
  return axios.request({
    url: '/sys/menu/remove',
    data,
    method: 'post'
  })
}
// 树菜单查看详情
export const detailMenu = id => {
  let data = {}
  return axios.request({
    url: `/sys/menu/detail/${id}`,
    data,
    method: 'get'
  })
}
// 树菜单编辑
export const updateMenu = data => {
  return axios.request({
    url: '/sys/menu/update',
    data,
    method: 'post'
  })
}
// 部门树结构
export const sysDeptTree = data => {
  return axios.request({
    url: '/system/sysDept/tree',
    data,
    method: 'post'
  })
}
// 用户列表
export const userList = data => {
  return axios.request({
    url: '/sys/user/list',
    data,
    method: 'post'
  })
}
// 用户列表新增保存
export const userSave = data => {
  return axios.request({
    url: '/sys/user/save',
    data,
    method: 'post'
  })
}
