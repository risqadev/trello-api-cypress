/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

describe('Trello API - Cards', () => {
  it('Should create a new card', () => {
    cy.createCard({
      ...fixData.newCard,
      idList: fixData.fixedList.todo.id
    }).should(({status, body}) => {
      expect(status).to.eq(200)
      expect(body).to.have.property('id')
    }).then(({body: {id}}) => {
      cy.request('GET', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('get card')
        .should(({status, body}) => {
          expect(status).to.eq(200)
          expect(body).to.have.property('name').to.eq(fixData.newCard.name)
          expect(body).to.have.property('desc').to.eq(fixData.newCard.desc)
          expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
          expect(body).to.have.property('idList').to.eq(fixData.fixedList.todo.id)
        })
    })

    // cleaning
    cy.get('@get card')
      .then(({body: {id}}) => {
        cy.request('DELETE', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('delete card')
      }).as('cleaning')
  })

  it('Should edit a card', () => {
    cy.editCard(fixData.fixedCard.id, fixData.cardEdit).should(({status}) => {
      expect(status).to.eq(200)
    }).then(() => {
      cy.request('GET',
        `/1/cards/${fixData.fixedCard.id}/?key=${appKey}&token=${token}`
      ).as('get card')
        .should(({body}) => {
          expect(body).to.have.property('id').to.eq(fixData.fixedCard.id)
          expect(body).to.have.property('name').to.eq(fixData.cardEdit.name)
          expect(body).to.have.property('desc').to.eq(fixData.cardEdit.desc)
          expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
          expect(body).to.have.property('idList').to.eq(fixData.cardEdit.idList)
        })
    })

    // cleaning
    cy.get('@get card')
      .then(() => cy.editCard(fixData.fixedCard.id, fixData.fixedCard)).as('reset card')
  })

  it('Should remove a card', () => {
    let createdId

    // preparing
    cy.createCard(fixData.cardToDelete).as('preparing')

    cy.get('@new card')
      .then(({body: {id}}) => {
        createdId = id
        cy.request('DELETE', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('delete card')
          .should(({status}) => {
            expect(status).to.eq(200)
          })
      })
    
    cy.get('@delete card')
      .then(() => {
        cy.request({
          method: 'GET',
          url: `/1/cards/${createdId}/?key=${appKey}&token=${token}`,
          failOnStatusCode: false
        }).as('get card')
          .should(({status}) => {
            expect(status).to.eq(404)
          })
      })
  })
})