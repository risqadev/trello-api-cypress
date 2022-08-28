/// <reference types='cypress' />

import { createBoard } from '../../services/Boards/postBoard.request'
import { getListsFromBoard } from '../../services/Lists/getListsFromBoard.request'
import { deleteBoard } from '../../services/Boards/deleteBoard.request'
import { getCard } from '../../services/Cards/getCard.request'
import { createCard } from '../../services/Cards/postCard.request'
import { deleteCard } from '../../services/Cards/deleteCard.request'

import fix from '../../fixtures/trello.json'

describe('Card creation', () => {
  before(() => {
    cy.createBoard().as('beforeAll')
  })

  after(() => {
    cy.get('@beforeAll').then(({id}) => {
      deleteBoard(id)
    })
  })
    
  context('Success scenarios', () => {
    it('Should create a new card successfuly if sent only a valid idList', () => {
      cy.get('@beforeAll').then(({id, lists}) => {
        const card = {
          ...fix.new.emptyCard,
          idList: lists.toDo,
          idBoard: id
        }
        // testing
        createCard({
          idList: card.idList
        }).should(({status, body}) => {
          expect(status).to.eq(200)
          expect(body).to.have.property('id').not.empty
          expect(body).contains(card)
          /* const {name, desc, idBoard, idList, start, dueComplete} = body
          expect(name).to.be.empty
          expect(desc).to.be.empty
          expect(start).to.be.null
          expect(dueComplete).to.be.false
          expect(idList).to.eq(firstList.id)
          expect(idBoard).to.eq(firstList.idBoard) */
        })
      })
      // cleaning
      cy.get('@new card').then(({body: {id}}) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it.only(`Should create a new card successfuly if sent a valid idList and other data, including "pos: 'top'" and "dueComplete: true".`, () => {      
      cy.get('@beforeAll').then(({id: boardId, lists}) => {
        const card = {
          ...fix.new.card,
          idList: lists.toDo,
          dueComplete: true
        }
        // testing
        createCard({
          ...card,
          dueComplete: false
        }).as('1stCard')
          .then(({body: {pos: prevPos}}) => {
            createCard({
              ...card,
              pos: 'top',
              dueComplete: true
            }).as('2ndCard')
              .should(({status, body}) => {
                expect(status).to.eq(200)
                expect(body).to.have.property('id')
                expect(body).contains(card)
                expect(body.pos).to.lessThan(prevPos)
                expect(body.idBoard).to.eq(boardId)
                /* const {name, desc, pos, idBoard, idList, start, dueComplete} = body
                expect(dueComplete).to.eq(true)
                expect(name).to.eq(fix.new.card.name)
                expect(desc).to.eq(fix.new.card.desc)
                expect(start).to.eq(fix.new.card.start)
                expect(idList).to.eq(firstList.id) */
              })
          })
      })
      // cleaning
      cy.get('@1stCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
      cy.get('@2ndCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })

    it(`Should create a new card successfuly if sent a valid idList and other data, including "pos: 'bottom'" and "dueComplete: false".`, () => {
      createCard({
        ...fix.new.card,
        pos: 'top',
        dueComplete: true
      }).should(({status, body: {name, desc, pos, dueComplete, idBoard, idList}}) => {
        expect(status).to.eq(200)
        expect(pos).to.eq('bottom')
        expect(dueComplete).to.eq(false)
        // expect(body).to.have.property('id')
        // expect(name).to.eq(fix.new.card.name)
        // expect(desc).to.eq(fix.new.card.desc)
        // expect(start).to.eq(fix.new.card.start)
        // expect(idList).to.eq(fix.fixed.list.todo.id)
        // expect(idBoard).to.eq(fix.fixed.board.id)
      })
  
      // cleaning
      cy.get('@get card').then(({body: {id}}) => 
        deleteCard(id)
      ).as('cleaning')
    })

    it(`Should create a new card successfuly if sent a valid idList and other data, including "pos" as a positive float number.`, () => {
      createCard({
        ...fix.new.card,
        pos: 0.0001
      }).should(({status, body: {name, desc, pos, dueComplete, idBoard, idList}}) => {
        expect(status).to.eq(200)
        expect(pos).to.eq(0.0001)
        // expect(body).to.have.property('id')
        // expect(name).to.eq(fix.new.card.name)
        // expect(desc).to.eq(fix.new.card.desc)
        // expect(start).to.eq(fix.new.card.start)
        // expect(idList).to.eq(fix.fixed.list.todo.id)
        // expect(idBoard).to.eq(fix.fixed.board.id)
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
    
  context.skip('Error scenarios', () => {
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