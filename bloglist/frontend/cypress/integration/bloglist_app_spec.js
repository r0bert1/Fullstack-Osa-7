describe('blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'testaaja',
      username: 'testing123',
      password: 'testing123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login page is opened', function() {
    cy.contains('log in to application')
  })

  it('user can login', function () {
    cy.get('[data-cy=username]')
      .type('testing123')
    cy.get('[data-cy=password]')
      .type('testing123')
    cy.contains('login')
      .click()
    cy.contains('testaaja logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.get('[data-cy=username]')
        .type('testing123')
      cy.get('[data-cy=password]')
        .type('testing123')
      cy.contains('login')
        .click()
    })

    it('name of the user is shown', function() {
      cy.contains('testaaja logged in')
    })

    it('a new note can be created', function() {
      cy.contains('create new')
        .click()
      cy.get('[data-cy=title]')
        .type('a blog created by cypress')
      cy.get('[data-cy=author]')
        .type('cypress')
      cy.get('[data-cy=url]')
        .type('https://www.cypress.io/')
      cy.get('[data-cy=create]')
        .click()
      cy.contains('a blog created by cypress')
    })
  })
})