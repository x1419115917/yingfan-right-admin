// import $axios from '@/libs/request'
import $axios from '@/libs/api.request'

export const login = data => {
  return $axios.request({
    url: '/login',
    data,
    method: 'post'
  })
}
