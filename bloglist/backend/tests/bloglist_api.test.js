const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const { initialBlogs, blogsInDb, equalTo, usersInDb } = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there are blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('all blogs are returned as json', async () => {
    const result = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.length).toBe(initialBlogs.length)  
  })

  test('blogs have identifier field id', async () => {
    const result = await api
      .get('/api/blogs')

    const oneBlog = result.body[0]
    expect(oneBlog.id).toBeDefined()
  })

  test('contents of a blog can be changed', async () => {
    const blogsAtStart = await blogsInDb()
    const blockToChange = blogsAtStart[0]

    const updatedBlog = { ...blockToChange, likes: blockToChange.likes + 1} 

    await api
      .put(`/api/blogs/${blockToChange.id}`)
      .send(updatedBlog)
      .expect(200)  

    const blogsAtEnd = await blogsInDb()

    const changed = blogsAtEnd.find(equalTo(blockToChange))    
    expect(changed.likes).toBe(blockToChange.likes + 1)
  })
})

describe('when there is initially one logged in user at db', () => {
  let userId
  let token

  beforeEach(async () => {
    await User.deleteMany({})

    const username = 'root'
    const name = '-'
    const password = 'sekret'
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    const user = new User({
      username,
      name,
      passwordHash
    })

    const result = await user.save()
    userId = result._id

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    token = response.body.token
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with too short password', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas', 
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('pasword minimum length 3')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })  

  test('creation fails with too short username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'he',
      name: 'Arto Hellas',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  describe('and the user has created a blog', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})

      const blog = new Blog({
        title: "Testing123",
        author: "root",
        url: "-",
        likes: 0,
        user: userId
      })

      await blog.save()
    })

    test('the blog can be deleted by the same user', async () => {
      const blogs = await Blog.find({})
      const blogToDelete = blogs.map(b => b.toJSON())[0]
      
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)
    })
  })

  describe('adding a new blog', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})    
    })

    it ('increases the blog count', async () => {
      const newBlog = {
        author: 'Martin Fowler',
        title: 'Microservices Resource Guide',
        url: 'https://martinfowler.com/microservices/',
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()  

      expect(blogsAtEnd.length).toBe(1)

      const created = blogsAtEnd.find(equalTo(newBlog))

      expect(created).toBeDefined()
    })

    it('likes get default value if not set', async () => {
      const newBlog = {
        author: 'Martin Fowler',
        title: 'Microservices Resource Guide',
        url: 'https://martinfowler.com/microservices/'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)

      const blogsAtEnd = await blogsInDb()

      const created = blogsAtEnd.find(equalTo(newBlog))

      expect(created.likes).toBe(0)        
    })

    it('blog is not added without url', async () => {
      const newBlog = {
        author: 'Martin Fowler',
        title: 'Microservices Resource Guide',
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /application\/json/)  

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd.length).toBe(0)   
    })

    it('blog is not added without title', async () => {
      const newBlog = {
        author: 'Martin Fowler',
        url: 'https://martinfowler.com/microservices/'  ,      
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd.length).toBe(0)
    })    
  })  
})

afterAll(() => {
  mongoose.connection.close()
})