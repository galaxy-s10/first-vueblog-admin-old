import request from '@/utils/request'

//友链列表
export function linklist() {
    return request({
        url: '/api/link/list',
        method: 'get'
    })
}

//添加友链
export function addlink(data) {
    console.log(data);
    return request({
        url: '/api/link/add',
        method: 'post',
        data
    })
}
//修改友链
export function editlink(data) {
    return request({
        url: '/api/link/edit',
        method: 'put',
        data
    })
}

//删除友链
export function dellink(id) {
    return request({
        url: "/api/link/del",
        method: 'delete',
        data: {
            id
        }
    })
}