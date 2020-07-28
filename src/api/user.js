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

export function getUserInfo(token) {
  return request({
    url: '/api/user/getuserinfo',
    method: 'get',
    // es6简写
    // params: { token }
    params: {
      token
    }
  })
}

export function find(id) {
  return request({
    url: '/api/user/find',
    method: 'get',
    params: {
      id
    }
  })
}

export function add(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/api/user/edit',
    method: 'put',
    data
  })
}

export function deluser(id) {
  return request({
    url: '/api/user/del',
    method: 'delete',
    data: {
      id
    }
  })
}
