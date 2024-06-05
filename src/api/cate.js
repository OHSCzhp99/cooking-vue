import request from '@/utils/request'

//获取美食帖子接口
export const cateGetListService = (params) => request.get('/cate/get', { params })

//添加美食帖子接口(data参数是一个formData格式的对象)
export const cateAddService = (data) => request.post('/cate/add', data)

//编辑(更新)美食帖子接口
export const cateEditService = (data) => request.put('/cate/update', data)

//删除美食帖子接口
export const cateDelService = (id) => request.delete('/cate/delete', { params: { id } })

//获取美食详情（编辑美食帖子回显时用的）
export const cateDetailService = (id) =>
  request.get('/cate/detail', {
    params: { id }
  })
  
//获取自己的美食帖子接口
export const cateGetMyListService = (id) => request.get('/cate/getMyPost', { params: { id } })