import axios from '@/libs/request.js'

export const getLinks = () => {
  return axios.get('/link/getLinks?type=all')
}

export const insertLink = (data) => {
  return axios.post('/link/insertLink', data)
}

export const modifyLink = (data) => {
  return axios.post('/link/modifyLink', data)
}

export const deleteLink = (data) => {
  return axios.post('/link/deleteLink', data)
}
