import request from '@/utils/request'

export function all() {
  return request({
    url: '/api/comment/all',
    method: 'get',
  })
}
export function commentlist(article_id) {
  return request({
    url: '/api/comment',
    method: 'get',
    params:{
      article_id
    }
  })
}
export function findmessage(data) {
  return request({
    url: '/api/message/find',
    method: 'get',
    params: {
      messageid: data
    }
  })
}
export function addcomment(data) {
  return request({
    url: '/api/comment/add',
    method: 'post',
    data
  })
}
