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
// 用户根据id查看详情
export const detailUser = id => {
  let data = {}
  return axios.request({
    url: `/sys/user/detail/${id}`,
    data,
    method: 'post'
  })
}
// 用户编辑 /sys/user/update
export const updateUser = data => {
  return axios.request({
    url: `/sys/user/update`,
    data,
    method: 'post'
  })
}
// 重置密码 /sys/user/adminResetPwd
export const adminResetPwd = data => {
  return axios.request({
    url: `/sys/user/adminResetPwd`,
    data,
    method: 'post'
  })
}
// 批量删除 /sys/user/batchRemove
export const batchRemoveUser = data => {
  return axios.request({
    url: `/sys/user/batchRemove`,
    data,
    method: 'post'
  })
}
// 删除
export const removeUser = id => {
  let data = {}
  return axios.request({
    url: `/sys/user/remove/${id}`,
    data,
    method: 'post'
  })
}
// /system/sysDept/treeList 部门树菜单
export const deptTreeList = data => {
  return axios.request({
    url: `/system/sysDept/treeList`,
    data,
    method: 'post'
  })
}
// /system/sysDept/save 保存新增部门
export const deptsave = data => {
  return axios.request({
    url: `/system/sysDept/save`,
    data,
    method: 'post'
  })
}
// 获取部门详情  /system/sysDept/detail/{deptId}
export const deptDetail = deptId => {
  let data = {}
  return axios.request({
    url: `/system/sysDept/detail/${deptId}`,
    data,
    method: 'get'
  })
}
// 部门删除 /system/sysDept/remove
export const deptRemove = deptId => {
  let data = {}
  return axios.request({
    url: `/system/sysDept/remove/${deptId}`,
    data,
    method: 'post'
  })
}
// 更新部门 /system/sysDept/update
export const deptupdate = data => {
  return axios.request({
    url: `/system/sysDept/update`,
    data,
    method: 'post'
  })
}
// 积分奖励设置
// export const doSetReward = data => {
//   return axios.request({
//     url: `/system/config/saveOrUpdate`,
//     data,
//     method: 'post'
//   })
// }
// 查询积分系统设置
// export const doCheckIntegral = data => {
//   return axios.request({
//     url: `/system/config/getConfigForIntegral`,
//     data,
//     method: 'post'
//   })
// }
// 查询邀请vip奖励
// export const doCheckVip = data => {
//   return axios.request({
//     url: `/system/config/getConfigForVIP`,
//     data,
//     method: 'post'
//   })
// }
// 查询邀新奖励
// export const doCheckNewbie = data => {
//   return axios.request({
//     url: `/system/config/getConfigForNewbie`,
//     data,
//     method: 'post'
//   })
// }
