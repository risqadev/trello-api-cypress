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

import {appKey, token} from '../../secrets.json'

Cypress.Commands.add('createCard', (cardData) => {
  cy.request('POST', `/1/cards/?key=${appKey}&token=${token}`, {
    ... cardData
  }).as('new card')
})

Cypress.Commands.add('editCard', (cardId, newDataCard) => {
  cy.request('PUT', `/1/cards/${cardId}/?key=${appKey}&token=${token}`, {
    ...newDataCard
  }).as('card edit')
})

Cypress.Commands.add('findCardsByName', (partOfName, listId) => {
  cy.request('GET', `/1/lists/${listId}/cards/?key=${appKey}&token=${token}`)
    .as('get cards')
    .then(({status, body}) => {
      expect(status).to.eq(200)
      expect(body).to.be.an('array').and.not.to.be.empty
      const cards = body.filter(({name}) => name.includes(partOfName))
      return cards
    })
})