import axios from '@/libs/request.js'

export const getBlogList = () => {
  return axios.get('/blog/getBlogList?type=all')
}

export const insertBlog = (data) => {
  return axios.post('/blog/insertBlog', data)
}

export const modifyBlog = (data) => {
  return axios.post('/blog/modifyBlog', data)
}

export const deleteBlog = (data) => {
  return axios.post('/blog/deleteBlog', data)
}
