import axios from '@/libs/request.js'

const getSocial = async () => {
  const social = await axios.get('getSocial')
  return social
}

const insertSocial = async (data) => {
  return axios.post('/insertSocial', data)
}
const modifySocial = async (data) => {
  return axios.post('/modifySocial', data)
}
const deleteSocial = async (data) => {
  return axios.post('/deleteSocial', data)
}
export { getSocial, insertSocial, modifySocial, deleteSocial }
