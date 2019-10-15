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
export const logoutFn = data => {
  return axios.request({
    url: '/logout',
    data,
    method: 'get'
  })
}
export const userMemu = () => {
  let data = {}
  return axios.request({
    url: '/userMemu',
    data,
    method: 'get'
  })
}
