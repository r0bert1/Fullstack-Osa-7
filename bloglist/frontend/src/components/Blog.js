import React from 'react'
import { connect } from 'react-redux'
import { like, comment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = (props) => {
  if (props.blog === undefined) {
    return null
  }

  const likeBlog = async (blog) => {
    props.like(blog)
    props.setNotification(`blog ${blog.title} by ${blog.author} liked!`)
  }

  const commentBlog = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    props.comment(props.blog, comment)
    event.target.comment.value = ''
  }

  const generateKey = () =>
    Number((Math.random() * 1000000).toFixed(0))

  return (
    <div>
      <h2>{props.blog.title}</h2>
      <a href={props.blog.url}>{props.blog.url}</a>
      <div>{props.blog.likes} likes
        <button onClick={() => likeBlog(props.blog)}>like</button>
      </div>
      <div>added by {props.blog.user.name}</div>
      <h3>comments</h3>
      
      <form onSubmit={commentBlog}>
          <input name="comment" />
          <button type="submit">add comment</button>
        </form>

      <ul>
        {props.blog.comments.map(comment => 
          <li key={generateKey()}>
            {comment}
          </li>
        )}
      </ul>
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
  comment,
  setNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)