import axios from 'axios'
import store from '@/store'
// import { Spin } from 'iview'
import Cookies from 'js-cookie'
const addErrorLog = errorInfo => {
  // const { statusText, status, request: { responseURL } } = errorInfo
  // let info = {
  //   type: 'ajax',
  //   code: status,
  //   mes: statusText,
  //   url: responseURL
  // }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

// form数据格式化
function formdata (obj) {
  // 表单格式提交
  let data = new FormData()
  for (let j in obj) {
    data.append(j, obj[j])
  }
  return data
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
        'Content-Type': 'application/json'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      // 可在此设置要发送的token
      console.log(config.data)
      let token = Cookies.get('access_token')
      let sessionId = Cookies.get('sessionId')
      token && (config.headers.token = token)
      sessionId && (config.headers.Authorization = sessionId)
      if (config.method === 'post') {
        if (config.data && !config.data.FLAG) {
          config.data = formdata(config.data)
        } else {
          config.data = JSON.stringify(config.data)
        }
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      // const { code } = data
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        // const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        // errorInfo = {
        //   statusText,
        //   status,
        //   request: { responseURL: config.url }
        // }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
