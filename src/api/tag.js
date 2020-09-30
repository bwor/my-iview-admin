import axios from '@/libs/request.js'

export const getTags = () => {
  return axios.get('/tag/tags?type=all')
}

export const insertTag = (data) => {
  return axios.post('/tag/insertTag', data)
}

export const modifyTag = (data) => {
  return axios.post('/tag/modifyTag', data)
}

export const deleteTag = (data) => {
  return axios.post('/tag/deleteTag', data)
}
