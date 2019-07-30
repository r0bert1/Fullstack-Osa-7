import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  let id
  switch (action.type) {
    case 'CREATE_NEW':
      const newBlog = action.data.blog
      return [...state, newBlog]
    case 'INIT_BLOGS':
      return action.data.blogs
    case 'REMOVE':
      id = action.data.blog.id
      return state.filter(blog => blog.id !== id)
    case 'UPDATE_BLOG':
      id = action.data.updatedBlog.id
      const newState = state.map(blog =>
        blog.id !== id ? blog : action.data.updatedBlog
      )
      return newState
    default:
      return state
  }
}

export const addBlog = (blog) => {
  return {
    type: 'CREATE_NEW',
    data: { blog }
  }
}

export const remove = (blog) => {
  return {
    type: 'REMOVE',
    data: { blog }
  }
}

export const like = (blog) => {
  return async dispatch => {
    const likedBlog = { ...blog, likes: blog.likes + 1}
    const updatedBlog = await blogService.update(likedBlog)
    dispatch({
      type: 'UPDATE_BLOG',
      data: { updatedBlog }
    })
  }
}

export const comment = (blog, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.createComment(blog.id, comment)
    dispatch({
      type: 'UPDATE_BLOG',
      data: { updatedBlog }
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: { blogs }
    })
  }
}

export default blogReducer