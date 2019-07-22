import React from 'react'
import { connect } from 'react-redux'

const User = (props) => {
  if (props.user === undefined) { 
    return null
  }

  return (
    <div>
      <h2>{props.user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {props.user.blogs.map(blog =>
          <li key={blog.id}>
            {blog.title}
          </li>
        )}
      </ul>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    user: props.user
  }
}

export default connect(mapStateToProps)(User)