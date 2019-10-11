import axios from '@/libs/api.request'

export const login = ({ userName, passWord }) => {
  const data = {
    FLAG: 1,
    userName,
    passWord
  }
  return axios.request({
    url: '/login',
    data,
    method: 'post'
  })
}
