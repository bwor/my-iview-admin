import qs from 'qs'
import axios from '@/libs/request'
export const getResources = (data) => {
  return axios.get('/qiniu/getResources?' + qs.stringify(data))
}
