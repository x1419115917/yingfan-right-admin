import axios from '@/libs/api.request'

// 品牌列表
export const listBrandsPage = data => {
  return axios.request({
    url: '/brand/operation/listBrandsPage',
    data,
    method: 'post'
  })
}
