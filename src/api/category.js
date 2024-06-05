import request from '@/utils/request'

//获取分类接口
export const categoryGetAllService = () => request.get('/category/get')

//添加分类接口
export const categoryAddService = (data) => request.post('/category/add', data)

//编辑分类接口
export const categoryEditService = (data) => request.put('/category/update', data)

//删除分类接口
export const categoryDelService = (id) => request.delete('/category/delete', { params: { id } })


