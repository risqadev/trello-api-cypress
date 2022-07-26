/// <reference types='cypress' />

import { getCard } from '../../services/Cards/getCard.request'
import { createCard } from '../../services/Cards/postCard.request'
import { deleteCard } from '../../services/Cards/deleteCard.request'

import fix from '../../fixtures/trello.json'

describe('Card creation', () => {
  context('Success scenarios', () => {
    it('Should create a new card successfuly if sent a valid idList', () => {
      createCard({
        ...fix.new.card,
        idList: fix.fixed.list.todo.id
      }).should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
      }).then(({body: {id}}) => {
        getCard(id)
          .should(({status, body: {name, desc, idBoard, idList}}) => {
            expect(status).to.eq(200)
            expect(name).to.eq(fix.new.card.name)
            expect(desc).to.eq(fix.new.card.desc)
            expect(idBoard).to.eq(fix.fixed.board.id)
            expect(idList).to.eq(fix.fixed.list.todo.id)
          })
      })
  
      // cleaning
      cy.get('@get card').then(({body: {id}}) => 
        deleteCard(id)
      ).as('cleaning')
    })
    
    it('Should create a copy of a existing card successfuly if sent a valid idCardSource', () => {
      createCard({
        idCardSource: fix.fixed.card.id,
        idList: fix.fixed.list.doing.id
      }).should(({status, body: {id}}) => {
        expect(status).to.eq(200)
        expect(id).not.eq(fix.fixed.card.id)
      }).then(({body: {id}}) => {
        getCard(id)
          .should(({status, body: {name, desc, idBoard, idList}}) => {
            expect(status).to.eq(200)
            expect(name).to.eq(fix.fixed.card.name)
            expect(desc).to.eq(fix.fixed.card.desc)
            expect(idBoard).to.eq(fix.fixed.board.id)
            expect(idList).to.eq(fix.fixed.list.doing.id)
          })
      })
        
      // cleaning
      cy.get('@get card').then(({body: {id}}) =>
        deleteCard(id)
      ).as('cleaning')
    })
  })
    
  context('Error scenarios', () => {
    it('Check error return if idList is missing', () => {
      createCard({
        ...fix.new.card
      }).its('status').should('be.equal', 400)
    })
    
    it('Check error return if idList is invalid', () => {
      createCard({
        ...fix.new.card,
        idList: fix.fake.list.id
      }).its('status').should('be.equal', 404)
    })
    
    it('Check error return in copy creation if idCardSource is invalid', () => {
      createCard({
        idCardSource: fix.fake.card.id,
        idList: fix.fixed.list.doing.id
      }).its('status').should('be.equal', 404)
    })
  })

})