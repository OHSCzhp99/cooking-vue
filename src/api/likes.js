import request from '@/utils/request'


//添加收藏
export const likesAddService = (likeData) => {
  const params = new URLSearchParams()
  for (let key in likeData) {
    params.append(key, likeData[key])
  }
  return request.post('/likes/add', params)
}

//获取自己的收藏
export const likesGetListService = (id) => request.get('/likes/get', { params: { id } })

//取消收藏
export const likesDeleteService = (params) => request.delete('/likes/delete',{
  params
})

//查看是否已收藏
export const likesExistService = (params) => request.get('/likes/exist',{
  params
})