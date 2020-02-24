import request from '@/utils/request'

export function qiniutoken() {
  return request({
    url: '/api/qiniu/token',
    method: 'get'
  })
}
export function delqiniuimg(filename) {
  return request({
    url: '/api/qiniu/del',
    method: 'get',
    params: {
      filename
    }
  })
}
