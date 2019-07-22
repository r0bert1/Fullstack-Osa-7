import React from 'react'
import { connect } from 'react-redux'
import SimpleBlog from './SimpleBlog'
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

  const newBlogRef = React.createRef()

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <Togglable buttonLabel='create new' ref={newBlogRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

      {props.blogs.sort(byLikes).map(blog =>
        <SimpleBlog
          key={blog.id}
          blog={blog}
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