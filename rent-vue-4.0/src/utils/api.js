import axios from 'axios'
import { Message } from 'element-ui';
import router from '../router'

axios.interceptors.request.use(success => {
  if (sessionStorage.getItem('role') === 'ROLE_TENANT') {
    const userId = parseInt(sessionStorage.getItem('userId'))
    if (success.method === 'get') {
      success.params.userId = userId
    } else {
      success.data.userId = userId
    }
  }
  console.log('request interceptor success', success)
  return success
}, error => {
  return error
})
axios.interceptors.response.use(success => {
  if (success.data.message) {
    Message.success({ message: success.data.message })
  }
  return success.data;
}, error => {
  console.log('response interceptors error', error.response)
  if (error.response.status == 600) {
    const message = error.response.data.message || '自定义错误'
    Message.error({ message })
  }
  else if (error.response.status == 504 || error.response.status == 404) {
    Message.error({ message: '服务器被吃了( ╯□╰ )' })
  } else if (error.response.status == 403) {
    Message.error({ message: '权限不足，请联系管理员' })
  } else if (error.response.status == 401) {
    Message.error({ message: '尚未登录，请登录' })
    router.replace('/');
  } else {
    if (error.response.message) {
      Message.error({ message: error.response.message })
    } else {
      Message.error({ message: '未知错误!' })
    }
  }
  return Promise.reject(error)
})

let base = '';

export const postKeyValueRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let i in data) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret;
    }],
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    }
  });
}
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
  })
}
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    params: params
  })
}
