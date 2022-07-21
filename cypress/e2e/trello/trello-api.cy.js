/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

describe('Trello API Challenge', () => {
  context('Boards context', () => {
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

  context('Cards context', () => {
    it('Should create a new card', () => {
      cy.createCard({
        ...fixData.newCard,
        idList: fixData.fixedList.todo.id
      }).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
      })
  
      cy.get('@new card')
        .then(({body: {id}}) => {
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
      cy.editCard(fixData.fixedCardToUpdate.id, {
        name: fixData.fixedCardToUpdate.editedName,
        desc: fixData.fixedCardToUpdate.editedDesc,
        idList: fixData.fixedList.doing.id
      }).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id').to.eq(fixData.fixedCardToUpdate.id)
        expect(body).to.have.property('name').to.eq(fixData.fixedCardToUpdate.editedName)
        expect(body).to.have.property('desc').to.eq(fixData.fixedCardToUpdate.editedDesc)
        expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
        expect(body).to.have.property('idList').to.eq(fixData.fixedList.doing.id)
      })
      
      cy.get('@card edit')
        .then(() => {
          cy.request('GET',
            `/1/cards/${fixData.fixedCardToUpdate.id}/?key=${appKey}&token=${token}`
          ).as('get card')
            .should(({status, body}) => {
              expect(status).to.eq(200)
              expect(body).to.have.property('id').to.eq(fixData.fixedCardToUpdate.id)
              expect(body).to.have.property('name').to.eq(fixData.fixedCardToUpdate.editedName)
              expect(body).to.have.property('desc').to.eq(fixData.fixedCardToUpdate.editedDesc)
              expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
              expect(body).to.have.property('idList').to.eq(fixData.fixedList.doing.id)
            })
        })
  
      cy.get('@get card')
        .then(() => {
          cy.editCard(fixData.fixedCardToUpdate.id, {
            name: fixData.fixedCardToUpdate.name,
            desc: fixData.fixedCardToUpdate.desc,
            idList: fixData.fixedList.todo.id
          })
        }).as('reset card')
    })
  
    it('Should remove a card', () => {
      let createdId

      cy.createCard({
        ...fixData.cardToDelete,
        idList: fixData.fixedList.todo.id
      }).as('preparing')
  
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

  context.skip('Utils', () => {
    it('Should remove a mass of cards', () => {
      const cardsName = 'Card to delete with Cypress'
      cy.findCardsByName(cardsName, fixData.fixedList.done.id)
        .then(cards => {
          for (const card of cards) {
            cy.request('DELETE', `/1/cards/${card.id}/?key=${appKey}&token=${token}`)
              .as('card deletion')
                .should(({status}) => {
                expect(status).to.eq(200)
              })
          }
        })
    })
  })
})