import request from '@/utils/request'

export function getQiniuToken() {
  return request({
    url: '/api/qiniu/token',
    method: 'get'
  })
}
export function delQiniuImg(filename) {
  return request({
    url: '/api/qiniu/del',
    method: 'get',
    params: {
      filename
    }
  })
}
