import axios from '@/libs/api.request'

// 上传
export const singleUpload = data => {
  return axios.request({
    url: '/base/oss/singleUpload',
    data,
    method: 'post'
  })
}
