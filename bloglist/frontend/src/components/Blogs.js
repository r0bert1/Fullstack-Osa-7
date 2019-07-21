import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'
import Togglable from './Togglable'
import NewBlog from './NewBlog'
import { addBlog, remove, like, initializeBlogs } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const Blogs = (props) => {
  const createBlog = async (blog) => {
    newBlogRef.current.toggleVisibility()
    const createdBlog = await blogService.create(blog)
    props.addBlog(createdBlog)
    props.setNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  }

  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1}
    const updatedBlog = await blogService.update(likedBlog)
    props.like(likedBlog)
    props.setNotification(`blog ${updatedBlog.title} by ${updatedBlog.author} liked!`)
  }

  const removeBlog = async (blog) => {
    const ok = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      await blogService.remove(blog)
      props.remove(blog)
      props.setNotification(`blog ${blog.title} by ${blog.author} removed!`)
    }
  }

  const newBlogRef = React.createRef()

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <Togglable buttonLabel='create new' ref={newBlogRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

      {props.blogs.sort(byLikes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          like={likeBlog}
          remove={removeBlog}
          user={props.user}
          creator={blog.user.username === props.user.username}
        />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.loggedUser
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  addBlog,
  remove,
  like,
  setNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Blogs)