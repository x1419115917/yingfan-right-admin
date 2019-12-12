import axios from '@/libs/api.request'

// 应分列表
export const doInFunList = data => {
  return axios.request({
    url: '/account/inFunSore/listScoresPage',
    data,
    method: 'post'
  })
}
// 应分收益列表
export const doInFunBonussList = data => {
  return axios.request({
    url: '/account/inFunSore/listBonussPage',
    data,
    method: 'post'
  })
}
// 主要积分数据
export const doMainScore = data => {
  return axios.request({
    url: '/account/inFunSore/mainScorePreview',
    data,
    method: 'post'
  })
}
