import axios from '@/libs/api.request'

// 交易流水列表
export const doPayList = data => {
  return axios.request({
    url: '/pay/payment/listPayRecordsPage',
    data,
    method: 'post'
  })
}
