import axios from '@/libs/request'

export const getUploadToken = () => {
  return axios.post('/public/uploadToken')
}
