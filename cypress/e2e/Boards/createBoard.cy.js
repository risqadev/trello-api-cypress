/// <reference types='cypress' />

import { createBoard } from '../../services/Boards/postBoard.request'
import { getBoard } from '../../services/Boards/getBoard.request'
import { deleteBoard } from '../../services/Boards/deleteBoard.request'

import fix from '../../fixtures/trello.json'

describe('Boards creation', () => {

  it('Should create a new board', () => {
    
    createBoard(fix.new.board).should(({status, body}) => {
      expect(status).to.eq(200)
      expect(body).to.have.property('id')
    })

    cy.get('@new board').then(({body: {id}}) => {
      getBoard(id).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('name').to.eq(fix.new.board.name)
        expect(body).to.have.property('desc').to.eq(fix.new.board.desc)
      })
    })

    // cleaning
    cy.get('@get board').then(({body: {id}}) => {
      deleteBoard(id)
    }).as('cleaning')
  })
})