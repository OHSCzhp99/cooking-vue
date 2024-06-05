import request from '@/utils/request'


//获取某条帖子的全部评论
export const commentGetListService = (id) => request.get('/comment/get',{
    params: { id }
  })

//添加评论接口
export const commentPostService = (commentData) =>  {
    const params = new URLSearchParams()
    for (let key in commentData) {
      params.append(key, commentData[key])
    }
    return request.post('/comment/add', params)
}

//获取自己的评论
export const commentGetMyListService = (id) => request.get('/comment/getMyComment', { params: { id } })

//删除评论
export const commentDeleteService = (id) => request.delete('/comment/delete',{
  params: { id } 
})