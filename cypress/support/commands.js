// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('createCard', (cardData) => {
  cy.request({
    method: 'POST',
    url: `/1/cards/`,
    body: { ...cardData }
  }).as('new card')
})

Cypress.Commands.add('editCard', (cardId, newDataCard) => {
  cy.request({
    method: 'PUT',
    url: `/1/cards/${cardId}/`,
    body: { ...newDataCard }
  }).as('card edit')
})

Cypress.Commands.add('findCardsByName', (partOfName, listId) => {
  cy.request({
    method: 'GET',
    url: `/1/lists/${listId}/cards/`
  }).as('get cards')
    .then(({status, body}) => {
      expect(status).to.eq(200)
      expect(body).to.be.an('array').and.not.to.be.empty
      return body.filter(({name}) => name.includes(partOfName))
    })
})

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  const authorization = `OAuth oauth_consumer_key="${Cypress.env('APP_KEY')}", oauth_token="${Cypress.env('TOKEN')}"`
  if (args.length === 1 && typeof(args[0]) === 'object') {
    args[0].headers = {
      ...args[0].headers,
      authorization
    }
  }
  return originalFn(...args)
})