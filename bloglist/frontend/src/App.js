import React, { useEffect } from 'react'
import { Container, Form, Button, Menu } from 'semantic-ui-react'
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
      <Container>
        <h2>log in to application</h2>

        <Notification />

        <Form onSubmit={handleLogin}>
          <Form.Field>
            <label>username:</label>
            <input data-cy="username" {...username} />
          </Form.Field>
          <Form.Field>
            <label>password:</label>
            <input data-cy="password" {...password} />
          </Form.Field>
          <Button type='submit'>login</Button>
        </Form>
      </Container>
    )
  }

  const findById = (id, data) =>
    data.find(item => item.id === id)

  return (
    <Container>
      <Router>
        <div>
          <Menu inverted>
            <Menu.Item link>
              <Link to="/">blogs</Link>
            </Menu.Item>
            <Menu.Item link>
              <Link to="/users">users</Link>
            </Menu.Item>
            <Menu.Item>
              <em>{props.user.name} logged in</em>
            </Menu.Item>
            <Menu.Item>
              <Button onClick={handleLogout}>logout</Button>
            </Menu.Item>
          </Menu>
          
          <h2>blog app</h2>

          <Notification />

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
    </Container>
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