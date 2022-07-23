/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fix from '../../fixtures/trello.json'

describe('Trello API - Cards', () => {
  context('Create', () => {
    it('Should create a new card', () => {
      cy.createCard({
        ...fix.new.card,
        idList: fix.fixed.list.todo.id
      }).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
      }).then(({body: {id}}) => {
        cy.request('GET', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('get card')
          .should(({status, body}) => {
            expect(status).to.eq(200)
            expect(body).to.have.property('name').to.eq(fix.new.card.name)
            expect(body).to.have.property('desc').to.eq(fix.new.card.desc)
            expect(body).to.have.property('idBoard').to.eq(fix.fixed.board.id)
            expect(body).to.have.property('idList').to.eq(fix.fixed.list.todo.id)
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
          ...fix.new.card
        }
      }).its('status').should('be.equal', 400)
    })

    it('Should not create a card when idList is invalid', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fix.new.card,
          idList: fix.fake.list.id
        }
      }).its('status').should('be.equal', 404)
    })

    it('Should create a copy of a card', () => {
      cy.createCard({
        idCardSource: fix.fixed.card.id,
        idList: fix.fixed.list.doing.id
      }).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id').not.eq(fix.fixed.card.id)
      }).then(({body: {id}}) => {
        cy.request('GET', `/1/cards/${id}/?key=${appKey}&token=${token}`).as('get card')
          .should(({status, body}) => {
            expect(status).to.eq(200)
            expect(body).to.have.property('name').to.eq(fix.fixed.card.name)
            expect(body).to.have.property('desc').to.eq(fix.fixed.card.desc)
            expect(body).to.have.property('idBoard').to.eq(fix.fixed.board.id)
            expect(body).to.have.property('idList').to.eq(fix.fixed.list.doing.id)
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
          idCardSource: fix.fake.card.id,
          idList: fix.fixed.list.doing.id
        }
      }).its('status').should('be.equal', 404)
    })
  })


  context('Update', () => {
    it('Should edit a card', () => {
      cy.editCard(fix.fixed.card.id, fix.edit.card).should(({status}) => {
        expect(status).to.eq(200)
      }).then(() => {
        cy.request('GET',
          `/1/cards/${fix.fixed.card.id}/?key=${appKey}&token=${token}`
        ).as('get card')
          .should(({body}) => {
            expect(body).to.have.property('id').to.eq(fix.fixed.card.id)
            expect(body).to.have.property('name').to.eq(fix.edit.card.name)
            expect(body).to.have.property('desc').to.eq(fix.edit.card.desc)
            expect(body).to.have.property('idBoard').to.eq(fix.fixed.board.id)
            expect(body).to.have.property('idList').to.eq(fix.edit.card.idList)
          })
      })
  
      // cleaning
      cy.get('@get card')
        .then(() => cy.editCard(fix.fixed.card.id, fix.fixed.card)).as('reset card')
    })
  
    it('Should fail when card id is non-existent', () => {
      cy.request({
        method: 'PUT',
        url: `/1/cards/${fix.fake.card.id}/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fix.edit.card
        }
      }).its('status').should('be.equal', 404)
    })

    it('Should fail when idlist does not belong to idboard', () => {
      cy.request({
        method: 'PUT',
        url: `/1/cards/${fix.fixed.card.id}/?key=${appKey}&token=${token}`,
        failOnStatusCode: false,
        body: {
          ...fix.edit.card,
          idList: fix.fixed.list.done.id,
          idBoard: fix.fixed.auxBoard.id
        }
      }).its('status').should('be.equal', 400)
    })
  })

  context('Delete', () => {
    it('Should remove a card', () => {
      let createdId
  
      // preparing
      cy.createCard({
        ...fix.new.card,
        idList: fix.fixed.list.todo.id
      }).as('preparing')
  
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
        url: `/1/cards/${fix.fake.card.id}/?key=${appKey}&token=${token}`,
        failOnStatusCode: false
      }).its('status').should('be.equal', 404)
    })
  })
})