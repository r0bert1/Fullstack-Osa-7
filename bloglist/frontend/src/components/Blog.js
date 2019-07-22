import React from 'react'
import { connect } from 'react-redux'
import { like } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const Blog = (props) => {
  if (props.blog === undefined) {
    return null
  }

  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1}
    const updatedBlog = await blogService.update(likedBlog)
    props.like(likedBlog)
    props.setNotification(`blog ${updatedBlog.title} by ${updatedBlog.author} liked!`)
  }

  return (
    <div>
      <h2>{props.blog.title}</h2>
      <a href={props.blog.url}>{props.blog.url}</a>
      <div>{props.blog.likes} likes
        <button onClick={() => likeBlog(props.blog)}>like</button>
      </div>
      <div>added by {props.blog.user.name}</div>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    blog: props.blog
  }
}

const mapDispatchToProps = {
  like,
  setNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)