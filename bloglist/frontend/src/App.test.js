import React from 'react'
import App from './App'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')

describe('<App />', () => {
  let component

  describe('if no user is logged in', () => {
    beforeEach(() => {
      component = render(<App />)
    })
  
    it('notes are not rendered', async () => {
      component.rerender(<App />)
  
      await waitForElement(() => component.getByText('kirjaudu'))
  
      expect(component.container).toHaveTextContent('kirjaudu')
      expect(component.container).toHaveTextContent('log in to application')
      expect(component.container).toHaveTextContent('käyttäjätunnus')
      expect(component.container).toHaveTextContent('salasana')
      expect(component.container).not.toHaveTextContent('Dan Abramov')
    })
  })

  describe('if a user is logged in', () => {
    beforeEach(() => {
      const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja'
      }
  
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      component = render(<App />)
    })

    it('notes are rendered', async () => {
      component.rerender(<App />)
  
      await waitForElement(() => component.getByText('create'))
  
      expect(component.container).not.toHaveTextContent('käyttäjätunnus')
      expect(component.container).not.toHaveTextContent('salasana')
      expect(component.container).toHaveTextContent('Dan Abramov')
      expect(component.container).toHaveTextContent('Martin Fowler')
    })
  })
})