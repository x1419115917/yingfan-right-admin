import axios from 'axios'
// import store from 'store/index'
import Cookies from 'js-cookie'
import { Spin, Message, Modal } from 'iview'
// import Qs from 'qs' //引入方式
// form数据格式化
function formdata (obj) {
  // 表单格式提交
  let data = new FormData()
  for (let j in obj) {
    data.append(j, obj[j])
  }
  return data
}
let request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? `/api` : `/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截
request.interceptors.request.use(
  config => {
    // 可在此设置要发送的token
    let token = Cookies.get('access_token')
    token && (config.headers.access_token = token)
    if (!config.data.load) {
      Spin.show() // 不建议开启，因为界面不友好
    }
    // if (config.method === 'post') {
    //   if (!config.data.FLAG) {
    //     config.data = formdata(config.data)
    //   } else {
    //     config.data = config.data
    //   }
    // }
    return config
  },
  error => {
    setTimeout(() => {
      Spin.hide()
    }, 1000)
    return Promise.reject(error)
  }
)

function layout () {
  Modal.warning({
    title: '提示',
    content: '由于您登录时间过长，为确保您的账户安全，请重新登录'
  })
}
request.interceptors.response.use(
  response => {
    const {
      data
    } = response
    const {
      code
    } = data
    Spin.hide()
    console.log(code)
  },
  error => {
    Spin.hide()
    error = error ? error.toString() : ''
    if (error.includes('499') || error.includes('498')) {
      layout()
      return Promise.reject(error)
    }
    Modal.warning({
      title: '提示',
      content: '由请重新请求！'
    })
    return Promise.reject(error)
  }
)

export default request
