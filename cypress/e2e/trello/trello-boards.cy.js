/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

describe.skip('Trello API - Boards', () => {
  it('Should create a new board', () => {
    cy.request('POST', `/1/boards/?key=${appKey}&token=${token}`, fixData.newBoard).as('new board')
      .should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
      })

    cy.get('@new board')
      .then(({body: {id}}) => {
        cy.request('GET', `/1/boards/${id}/?key=${appKey}&token=${token}`).as('get board')
          .should(({status, body}) => {
            expect(status).to.eq(200)
            expect(body).to.have.property('name').to.eq(fixData.newBoard.name)
            expect(body).to.have.property('desc').to.eq(fixData.newBoard.desc)
          })
      })

    // cleaning
    cy.get('@get board')
      .then(({body: {id}}) => {
        cy.request('DELETE', `/1/boards/${id}/?key=${appKey}&token=${token}`).as('board delete')
      }).as('cleaning')
  })

  it('Should remove a board', () => {
    let createdId

    cy.request('POST', `/1/boards/?key=${appKey}&token=${token}`, fixData.boardToDelete).as('new board')

    cy.get('@new board')
      .then(({body: {id}}) => {
        createdId = id
        cy.request('DELETE', `/1/boards/${id}/?key=${appKey}&token=${token}`).as('delete board')
          .should(({status}) => {
            expect(status).to.eq(200)
          })
      })

    cy.get('@delete board')
      .then(() => {
        cy.request({
          method: 'GET',
          url: `/1/boards/${createdId}/?key=${appKey}&token=${token}`,
          failOnStatusCode: false
        }).as('get board')
          .should(({status}) => {
            expect(status).to.eq(404)
          })
      })
  })
})