import { dayjs } from 'element-plus'

// 时间格式
export const formatTime = (time) => dayjs(time).format('YYYY-MM-DD hh:mm:ss')
