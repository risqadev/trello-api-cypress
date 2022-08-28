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

import { createBoard } from '../services/Boards/postBoard.request'
import { getListsFromBoard } from '../services/Lists/getListsFromBoard.request'
import fix from '../fixtures/trello.json'

Cypress.Commands.add('createBoard', () => {
  const board = {
    id: '',
    lists: {
      toDo: '',
      doing: '',
      done: ''
    }
  }

  createBoard({...fix.new.board}).then(({status, body}) => {
    expect(status).to.eq(200)
    board.id = body.id
    getListsFromBoard (body.id)
  })

  cy.get('@get lists').then(({status, body}) => {
    expect(status).to.eq(200)
    expect(body).to.be.an('array').and.to.have.lengthOf(3)
    Object.keys(board.lists).forEach((key, i) => {
      board.lists[key] = body[i].id
    })

    return { ...board }
  })
})