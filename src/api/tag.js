import request from '@/utils/request'

//标签列表
export function taglist(size) {
    return request({
        url: '/api/tag/list',
        method: 'get',
        params: {
            size
        }
    })
}

//添加标签
export function addtag(data) {
    return request({
        url: '/api/tag/add',
        method: 'post',
        data
    })
}

//删除标签
export function deltag(id) {
    return request({
        url: '/api/tag/del',
        method: 'delete',
        data: {
            id
        }
    })
}