import request from '@/utils/request'


//前台注册接口
export const userRegisterFrontService = (registerData) => {
  const params = new URLSearchParams()
  for (let key in registerData) {
    params.append(key, registerData[key])
  }
  return request.post('/user/registerFront', params)
}

//前台登录接口
export const userLoginFrontService = (LoginData) => {
  const params = new URLSearchParams()
  for (let key in LoginData) {
    params.append(key, LoginData[key])
  }
  return request.post('/user/loginFront', params)
}

//前台获取用户数据
export const userInfoFrontService = () => request.get('/user/userInfoFront')

//前台更新用户基本信息
export const userUpdateInfoFrontService = ({id,nickname,email}) =>
  request.put('/user/updateFront',{id,nickname,email})

//前台更新用户头像
export const userUpdateAvatarFrontService = (avatar) =>
  request.patch('/user/updateAvatarFront',avatar)

//前台更新用户密码
export const userUpdatePasswordFrontService = ({old_pwd,new_pwd,re_pwd}) =>
  request.patch('/user/updatePwdFront',{old_pwd,new_pwd,re_pwd})



//---------------------------------------------------------
//后台注册接口
export const userRegisterService = (registerData) => {
  const params = new URLSearchParams()
  for (let key in registerData) {
    params.append(key, registerData[key])
  }
  return request.post('/user/register', params)
}

//后台登录接口
export const userLoginService = (LoginData) => {
  const params = new URLSearchParams()
  for (let key in LoginData) {
    params.append(key, LoginData[key])
  }
  return request.post('/user/login', params)
}

//后台获取用户数据
export const userInfoService = () => request.get('/user/userInfo')

//后台更新用户基本信息
export const userUpdateInfoService = ({id,nickname,email}) =>
  request.put('/user/update',{id,nickname,email})

//后台更新用户头像
export const userUpdateAvatarService = (avatar) =>
  request.patch('/user/updateAvatar',avatar)

//后台更新用户密码
export const userUpdatePasswordService = ({old_pwd,new_pwd,re_pwd}) =>
  request.patch('/user/updatePwd',{old_pwd,new_pwd,re_pwd})

//后台修改用户违规
export const userUpdateLoginService = (userData) => {
  const params = new URLSearchParams()
  for (let key in userData) {
    params.append(key, userData[key])
  }
  return request.patch('/user/updateLogin', params)
}


//后台获取前台全部用户数据
export const userGetAllFrontUserService = () =>
  request.get('/user/getAllFrontUser')