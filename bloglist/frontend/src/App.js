import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import { useField } from './hooks'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import { setNotification } from './reducers/notificationReducer'
import { addBlog, remove, like, initializeBlogs } from './reducers/blogReducer'
import { login, logout } from './reducers/loginReducer'
import {
  BrowserRouter as Router,
  Route, Link
} from 'react-router-dom'


const App = (props) => {
  const [username] = useField('username')
  const [password] = useField('password')

  useEffect(() => {
    props.initializeBlogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.login(user)
      blogService.setToken(user.token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      props.login(user)
    } catch (exception) {
      props.setNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    props.logout()
    blogService.destroyToken()
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  if (props.user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification />

        <form onSubmit={handleLogin}>
          <div>
            käyttäjätunnus
            <input {...username}/>
          </div>
          <div>
            salasana
            <input {...password} />
          </div>
          <button type="submit">kirjaudu</button>
        </form>
      </div>
    )
  }

  const findById = (id, data) =>
    data.find(item => item.id === id)

  return (
    <div>
      <Router>
        <div>
          <h2>blogs</h2>

          <Notification />

          <p>{props.user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <Route exact path="/" render={() => <Blogs />} />
          <Route exact path="/users" render={() => <Users />} />
          <Route exact path="/users/:id" render={({ match }) =>
            <User user={findById(match.params.id, props.users)} />
          } />
          <Route exact path="/blogs/:id" render={({ match }) =>
            <Blog blog={findById(match.params.id, props.blogs)} />
          } />
        </div>
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.loggedUser,
    users: state.users
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  addBlog,
  remove,
  like,
  setNotification,
  login,
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(App)