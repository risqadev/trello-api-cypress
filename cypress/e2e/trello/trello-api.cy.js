/// <reference types='cypress' />

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
        cy.request({
          method: 'GET',
          url: `/1/cards/${id}/`
        }).as('get card')
          .should(({status, body: {name, desc, idBoard, idList}}) => {
            expect(status).to.eq(200)
            expect(name).to.eq(fix.new.card.name)
            expect(desc).to.eq(fix.new.card.desc)
            expect(idBoard).to.eq(fix.fixed.board.id)
            expect(idList).to.eq(fix.fixed.list.todo.id)
          })
      })
  
      // cleaning
      cy.get('@get card')
        .then(({body: {id}}) => {
          cy.request({
            method: 'DELETE',
            url: `/1/cards/${id}/`
          }).as('delete card')
        }).as('cleaning')
    })

    it('Should not create a card when idList is missing', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/`,
        failOnStatusCode: false,
        body: {
          ...fix.new.card
        }
      }).its('status').should('be.equal', 400)
    })

    it('Should not create a card when idList is invalid', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/`,
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
      }).should(({status, body: {id}}) => {
        expect(status).to.eq(200)
        expect(id).not.eq(fix.fixed.card.id)
      }).then(({body: {id}}) => {
        cy.request({
          method: 'GET',
          url: `/1/cards/${id}/`
        }).as('get card')
          .should(({status, body: {name, desc, idBoard, idList}}) => {
            expect(status).to.eq(200)
            expect(name).to.eq(fix.fixed.card.name)
            expect(desc).to.eq(fix.fixed.card.desc)
            expect(idBoard).to.eq(fix.fixed.board.id)
            expect(idList).to.eq(fix.fixed.list.doing.id)
          })
      })
  
      // cleaning
      cy.get('@get card')
        .then(({body: {id}}) => {
          cy.request({
            method: 'DELETE',
            url: `/1/cards/${id}/`
          }).as('delete card')
        }).as('cleaning')
    })

    it('Should not create a copy when idCardSource is invalid', () => {
      cy.request({
        method: 'POST',
        url: `/1/cards/`,
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
        cy.request({
          method: 'GET',
          url: `/1/cards/${fix.fixed.card.id}/`
        }).as('get card')
          .should(({status, body: {id, name, desc, idBoard, idList}}) => {
            expect(status).to.eq(200)
            expect(id).to.eq(fix.fixed.card.id)
            expect(name).to.eq(fix.edit.card.name)
            expect(desc).to.eq(fix.edit.card.desc)
            expect(idBoard).to.eq(fix.fixed.board.id)
            expect(idList).to.eq(fix.edit.card.idList)
          })
      })
  
      // cleaning
      cy.get('@get card')
        .then(() => cy.editCard(fix.fixed.card.id, fix.fixed.card)).as('reset card')
    })
  
    it('Should fail when card id is non-existent', () => {
      cy.request({
        method: 'PUT',
        url: `/1/cards/${fix.fake.card.id}/`,
        failOnStatusCode: false,
        body: {
          ...fix.edit.card
        }
      }).its('status').should('be.equal', 404)
    })

    it('Should fail when idlist does not belong to idboard', () => {
      cy.request({
        method: 'PUT',
        url: `/1/cards/${fix.fixed.card.id}/`,
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
          cy.request({
            method: 'DELETE',
            url: `/1/cards/${id}/`
          }).as('delete card')
            .its('status').should('be.equal', 200)
        })
      
      cy.get('@delete card')
        .then(() => {
          cy.request({
            method: 'GET',
            url: `/1/cards/${createdId}/`,
            failOnStatusCode: false
          }).as('get card')
            .its('status').should('be.equal', 404)
        })
    })

    it('Should fail when card id is non-existent', () => {
      cy.request({
        method: 'DELETE',
        url: `/1/cards/${fix.fake.card.id}/`,
        failOnStatusCode: false
      }).its('status').should('be.equal', 404)
    })
  })
})