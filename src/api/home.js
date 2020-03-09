import axios from '@/libs/api.request'

// 查询首页版块列表
export const doPlateList = data => {
  return axios.request({
    url: '/homePge/operation/plateDetail/listPlateDetailsPage',
    data,
    method: 'post'
  })
}
// 新增版块详情列表
export const doAddPlate = data => {
  return axios.request({
    url: '/homePge/operation/plateDetail/savePlateDetail',
    data,
    method: 'post'
  })
}
// 查询版块详情列表
export const doCheckPlate = data => {
  return axios.request({
    url: '/homePge/operation/plateDetail/getPlateDetail',
    data,
    method: 'post'
  })
}
// 编辑版块详情列表
export const doEditPlate = data => {
  return axios.request({
    url: '/homePge/operation/plateDetail/editPlateDetail',
    data,
    method: 'post'
  })
}

// 编辑版块标题,显示状态
export const doEditTitleMsg = data => {
  return axios.request({
    url: '/homePge/operation/update',
    data,
    method: 'post'
  })
}
// 查询版块标题,显示状态
export const doCheckTitleMsg = data => {
  return axios.request({
    url: '/homePge/operation/detail',
    data,
    method: 'post'
  })
}

// 专题活动列表
export const doActiveList = data => {
  return axios.request({
    url: '/homePge/operation/activity/list',
    data,
    method: 'post'
  })
}
