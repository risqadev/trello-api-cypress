/// <reference types='cypress' />

import { deleteBoard } from '../../services/Boards/deleteBoard.request'
import { createCard } from '../../services/Cards/postCard.request'
import { deleteCard } from '../../services/Cards/deleteCard.request'

import fix from '../../fixtures/trello.json'

describe('Card creation', () => {
  before(function () {
    cy.createBoard().as('beforeAll')
  })

  after(function () {
    const {id} = this.beforeAll
    deleteBoard(id)
  })
    
  context('Success scenarios', () => {
    it('Should create a new card successfuly if sent only a valid idList', function () {
      const {id, lists} = this.beforeAll
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
      // cleaning
      cy.get('@new card').then(({body: {id}}) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it(`Should create a new card successfuly if sent 'top' string  in 'pos' field and a boolean in 'dueComplete' field.`, function () {      
      const {id: boardId, lists} = this.beforeAll
      const card1 = {
        ...fix.new.card,
        idList: lists.toDo,
        dueComplete: false
      }
      const card2 = {
        ...card1,
        dueComplete: true
      }
      // testing
      createCard({
        ...card1,
        pos: 'top'
      }).as('1stCard').should(({status, body}) => {
        const {pos: prevPos} = body
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
        expect(body).contains(card1)
        expect(body.idBoard).to.eq(boardId)

        createCard({
          ...card2,
          pos: 'top'
        }).as('2ndCard').should(({status, body}) => {
          expect(status).to.eq(200)
          expect(body).to.have.property('id')
          expect(body).contains(card2)
          expect(body.pos).to.lessThan(prevPos)
          expect(body.idBoard).to.eq(boardId)
        })
      })
      // cleaning
      cy.get('@1stCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
      cy.get('@2ndCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })

    it(`Should create a new card successfuly if sent 'bottom' string  in 'pos' field and null in 'dueComplete' field.`, function () {
      const {id: boardId, lists} = this.beforeAll
      const card = {
        ...fix.new.card,
        dueComplete: false,
        idList: lists.toDo
      }
      // testing
      createCard({
        ...card,
        dueComplete: null,
        pos: 'bottom'
      }).as('1stCard').should(({status, body}) => {
        const {pos: prevPos} = body
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
        expect(body).contains(card)
        expect(body.idBoard).to.eq(boardId)

        createCard({
          ...card,
          dueComplete: null,
          pos: 'bottom'
        }).as('2ndCard').should(({status, body}) => {
          expect(status).to.eq(200)
          expect(body).to.have.property('id')
          expect(body).contains(card)
          expect(body.pos).to.greaterThan(prevPos)
          expect(body.idBoard).to.eq(boardId)
        })
      })
      // cleaning
      cy.get('@1stCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
      cy.get('@2ndCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })

    it(`Should create a new card successfuly if sent a positive float number in 'pos' field.`, function () {
      const {id: boardId, lists} = this.beforeAll
      const card = {
        ...fix.new.card,
        idList: lists.toDo,
        pos: 0.13
      }
      // testing
      createCard({
        ...card
      }).as('testCard').should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
        expect(body).contains(card)
        expect(body.idBoard).to.eq(boardId)
      })
      // cleaning
      cy.get('@testCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })
    
    it('Should create a copy of a existing card successfuly if sent a valid idCardSource', function () {
      const {lists} = this.beforeAll
      const card = {
        ...fix.new.card,
        idList: lists.toDo
      }
      // testing
      createCard({
        ...card
      }).as('1stCard').should(({status, body}) => {
        const {id} = body
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
        expect(body).contains(card)

        createCard({
          idCardSource: id,
          idList: lists.toDo
        }).as('2ndCard').should(({status, body}) => {
          expect(status).to.eq(200)
          expect(body.id).is.not.equal(id)
          expect(body).contains(card)
        })
      })
      // cleaning
      cy.get('@1stCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
      cy.get('@2ndCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })
  })
    
  context('Error scenarios', () => {
    it('Check error return if idList is missing', function () {
      createCard({
        ...fix.new.card
      }).should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body).contains('invalid value for idList')
      })
    })

    it('Check error return if idList is invalid', function () {
      createCard({
        ...fix.new.card,
        idList: fix.fake.list.id
      }).should(({status, body}) => {
        expect(status).to.eq(404)
        expect(body).contains('could not find the board that the card belongs to')
      })
    })

    it('Check error return if sent other string value in "pos" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        pos: 'other'
      }).should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('Invalid position')
      })
    })

    it('Check error return if sent negative number in "pos" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        pos: -1
      }).should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('Invalid position')
      })
    })

    it.skip('Check error return if sent boolean value in "pos" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        pos: false
      }).as('1stCard').should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('Invalid position')
      })
      createCard({
        idList: lists.toDo,
        pos: true
      }).as('2ndCard').should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('Invalid position')
      })
      // cleaning
      cy.get('@1stCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
      cy.get('@2ndCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })

    it('Check error return if sent invalid datetime in "start" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        start: fix.fake.card.start
      }).should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('invalid date')
      })
    })

    it.skip('Check error return if sent boolean value in "start" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        start: false
      }).as('1stCard').should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('invalid date')
      })
      createCard({
        idList: lists.toDo,
        start: true
      }).as('2ndCard').should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('invalid date')
      })
      // cleaning
      cy.get('@1stCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
      cy.get('@2ndCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })
    
    it.skip('Check error return if sent a string value in "dueComplete" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        dueComplete: 'other'
      }).as('testCard').should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('invalid date')
      })
      // cleaning
      cy.get('@testCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })

    it.skip('Check error return if sent a number value in "dueComplete" field', function () {
      const {lists} = this.beforeAll
      createCard({
        idList: lists.toDo,
        dueComplete: 2
      }).as('testCard').should(({status, body}) => {
        expect(status).to.eq(400)
        expect(body.message).contains('invalid date')
      })
      // cleaning
      cy.get('@testCard').then(({body: {id}}) => deleteCard(id)).as('cleaning')
    })
    
    it('Check error return in copy creation if idCardSource is invalid', function () {
      const {lists} = this.beforeAll
      createCard({
        idCardSource: fix.fake.card.id,
        idList: lists.toDo
      }).should(({status, body}) => {
        expect(status).to.eq(404)
        expect(body).contains('requested resource was not found')
      })
    })
  })
})