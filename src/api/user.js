import request from '@/utils/request'

export function userList() {
  return request({
    url: '/api/user/list',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function getinfo(token) {
  return request({
    url: '/api/user/getinfo',
    method: 'get',
    // es6简写
    // params: { token }
    params: {
      token
    }
  })
}
export function find(username) {
  return request({
    url: '/api/user/find',
    method: 'get',
    params: {
      username
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function deluser(id) {
  return request({
    url: '/api/user/del',
    method: 'get',
    params:{
      id
    }
  })
}
