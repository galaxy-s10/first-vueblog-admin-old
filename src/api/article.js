import request from '@/utils/request'

export function articlelist(ordername, orderby) {
  return request({
    url: '/api/article',
    method: 'get',
    params: {
      ordername,
      orderby
    }
  })
}
export function articletypelist() {
  return request({
    url: '/api/article/typelist',
    method: 'get',
  })
}
export function articlepage(ordername, orderby, type, nowpage, pagesize) {
  return request({
    url: '/api/article/page',
    method: 'get',
    params: {
      ordername,
      orderby,
      type,
      nowpage,
      pagesize
    }
  })
}
export function findarticle(id, title) {
  return request({
    url: '/api/article/find',
    method: 'get',
    params: {
      id,
      title
    }
  })
}
export function addarticle(data) {
  return request({
    url: '/api/article/add',
    method: 'post',
    data
  })
}
export function editarticle(data) {
  return request({
    url: '/api/article/edit',
    method: 'post',
    data
  })
}
export function delarticle(id) {
  return request({
    url: '/api/article/del',
    method: 'get',
    params: {
      id
    }
  })
}
