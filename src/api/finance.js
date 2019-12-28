import axios from '@/libs/api.request'

// 交易流水列表
export const doPayList = data => {
  return axios.request({
    url: '/pay/payment/listPayRecordsPage',
    data,
    method: 'post'
  })
}
// 提现流水列表
export const doCashoutList = data => {
  return axios.request({
    url: '/account/withdrawCash/listWithdrawCashsPage',
    data,
    method: 'post'
  })
}
// 查询提现详情
export const doCheckCashoutDetail = data => {
  return axios.request({
    url: '/account/withdrawCash/getWithdrawCash',
    data,
    method: 'post'
  })
}
// 提现审核
export const doHandelCashout = data => {
  return axios.request({
    url: '/account/withdrawCash/auditWithdrawCash',
    data,
    method: 'post'
  })
}
// 银行列表
export const doBankList = data => {
  return axios.request({
    url: '/account/withdrawCash/listBanksPage',
    data,
    method: 'post'
  })
}
// 新增银行
export const doAddBank = data => {
  return axios.request({
    url: '/account/withdrawCash/save/bank',
    data,
    method: 'post'
  })
}
// 删除银行
export const doDeleteBank = data => {
  return axios.request({
    url: '/account/withdrawCash/remove/bank',
    data,
    method: 'post'
  })
}
