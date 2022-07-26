/// <reference types='cypress' />

import { createBoard } from '../../services/Boards/postBoard.request'
import { getBoard } from '../../services/Boards/getBoard.request'
import { deleteBoard } from '../../services/Boards/deleteBoard.request'

import fix from '../../fixtures/trello.json'

describe('Boards delete', () => {

  it('Should remove a board', () => {
    
    let createdId

    //preparing
    createBoard(fix.new.board).as('preparing')

    cy.get('@new board').then(({body: {id}}) => {
      createdId = id
      deleteBoard(id).should(({status}) => {
        expect(status).to.eq(200)
      })
    })

    cy.get('@delete board').then(() => {
      getBoard(createdId).should(({status}) => {
        expect(status).to.eq(404)
      })
    })
  })
})