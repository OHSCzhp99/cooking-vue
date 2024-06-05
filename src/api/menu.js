import request from '@/utils/request'


//新增食谱
export const menuAddService = (data) => request.post('/menu/add', data)

//获取全部食谱数据
export const menuGetListService = () => request.get('/menu/get')

//获取自己创建的食谱
export const menuGetMyMenuService = () => request.get('/menu/getMyAddMenu')

//删除食谱
export const menuDeleteService = (id) => request.delete('/menu/delete',{ params: { id } })

//查询是否已经购买
export const menuExistService = (params) => request.get('/menu/exist',{ params})

//购买食谱
export const menuPayService = (MenuData) => {
  const params = new URLSearchParams()
  for (let key in MenuData) {
    params.append(key, MenuData[key])
  }
  return request.post('/menu/pay', params)
}

//查询已经购买了哪些食谱
export const menuPayFlagService = () => request.get('/menu/payFlag')

//获取自己购买的食谱
export const menuGetMyPayMenuService = () => request.get('/menu/getMyPayMenu')

//获取单条详细的食谱
export const menuGetDetailService = (id) => request.get('/menu/detail',{ params: { id } })

//后台管理员修改食谱状态下架
//后台修改用户违规
export const menuStateService = (mneuData) => {
  const params = new URLSearchParams()
  for (let key in mneuData) {
    params.append(key, mneuData[key])
  }
  return request.patch('/menu/updateMenuState', params)
}