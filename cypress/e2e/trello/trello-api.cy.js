/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

describe('Trello API - Cards', () => {
  context('Create', () => {
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

    it('Should not create a card when idList is missing', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fixData.newCard
        }
      }).its('status').should('be.equal', 400)
    })

    it('Should not create a card when idList is invalid', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fixData.newCard,
          idList: fixData.fakeCard.idList
        }
      }).its('status').should('be.equal', 404)
    })

    it('Should create a copy of a card', () => {
      cy.createCard({
        idCardSource: fixData.fixedCard.id,
        idList: fixData.fixedList.doing.id
      }).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id').not.eq(fixData.fixedCard.id)
      }).then(({body: {id}}) => {
        cy.request('GET', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('get card')
          .should(({status, body}) => {
            expect(status).to.eq(200)
            expect(body).to.have.property('name').to.eq(fixData.fixedCard.name)
            expect(body).to.have.property('desc').to.eq(fixData.fixedCard.desc)
            expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
            expect(body).to.have.property('idList').to.eq(fixData.fixedList.doing.id)
          })
      })
  
      // cleaning
      cy.get('@get card')
        .then(({body: {id}}) => {
          cy.request('DELETE', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('delete card')
        }).as('cleaning')
    })

    it('Should not create a copy when idCardSource is invalid', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          idCardSource: fixData.fakeCard.idCardSource,
          idList: fixData.fixedList.doing.id
        }
      }).its('status').should('be.equal', 404)
    })
  })


  context('Update', () => {
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
  
    it('Should fail when card id is non-existent', () => {
      cy.request({
        method: 'PUT',
        url: `/1/cards/${fixData.fakeCard.id}/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fixData.cardEdit
        }
      }).its('status').should('be.equal', 404)
    })

    it('Should fail when idlist does not belong to idboard', () => {
      cy.request({
        method: 'PUT',
        url: `/1/cards/${fixData.fixedCard.id}/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fixData.cardEdit,
          idList: fixData.fixedList.done.id,
          idBoard: fixData.auxiliaryBoard.id
        }
      }).its('status').should('be.equal', 400)
    })
  })

  context('Delete', () => {
    it('Should remove a card', () => {
      let createdId
  
      // preparing
      cy.createCard(fixData.cardToDelete).as('preparing')
  
      cy.get('@new card')
        .then(({body: {id}}) => {
          createdId = id
          cy.request('DELETE', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('delete card')
            .its('status').should('be.equal', 200)
        })
      
      cy.get('@delete card')
        .then(() => {
          cy.request({
            method: 'GET',
            url: `/1/cards/${createdId}/?key=${appKey}&token=${token}`,
            failOnStatusCode: false
          }).as('get card')
            .its('status').should('be.equal', 404)
        })
    })

    it('Should fail when card id is non-existent', () => {
      cy.request({
        method: 'DELETE',
        url: `/1/cards/${fixData.fakeCard.id}/?key=${appKey}&token=${token}`,
        failOnStatusCode: false
      }).its('status').should('be.equal', 404)
    })
  })
})