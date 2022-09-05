/// <reference types='cypress' />

import { deleteBoard } from '../../services/Boards/deleteBoard.request'
import { createCard } from '../../services/Cards/postCard.request'
import { editCard } from '../../services/Cards/putCard.request'
import { deleteCard } from '../../services/Cards/deleteCard.request'

import fix from '../../fixtures/trello.json'
import messages from '../../fixtures/messages.json'

describe('Card update', () => {
  before(function () {
    cy.createBoard().as('boardAndListsIds')
  })

  after(function () {
    const {id} = this.boardAndListsIds
    deleteBoard(id)
  })

  context('Success scenarios', () => {
    it('Should edit a card if sent updated data incluind idList, pos, start and dueComplete', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        idList: lists.doing
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit,
          pos: 'top'
        }).should(({ status, body }) => {
          expect(status).to.eq(200)
          expect(body.id).to.eq(id)
          expect(body).has.property('pos')
          expect(body).contains(edit)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Should edit a card if sent updated data incluind pos bottom and dueComplete false', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        dueComplete: false
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit,
          pos: 'bottom'
        }).should(({ status, body }) => {
          expect(status).to.eq(200)
          expect(body.id).to.eq(id)
          expect(body).has.property('pos')
          expect(body).contains(edit)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Should edit a card if sent updated data incluind a positive float position and other valid idList', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        pos: 0.5,
        idList: lists.done
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(200)
          expect(body.id).to.eq(id)
          expect(body).contains(edit)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Should edit a card, moving it to another board, if sent a valid idboard', function () {
      const { id: firstBoardId, lists: firstBoardlists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        // idList: firstBoardlists.doing,
        idBoard: firstBoardId
      }
      // preparing
      cy.createBoard().as('2ndBoard').then(({ lists: secondBoardLists }) => {
        createCard({
          idList: secondBoardLists.toDo
        })
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id: idCard } }) => {
        editCard(idCard, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(200)
          expect(body).contains(edit)
          expect(body.idBoard).to.eq(firstBoardId)
          expect(body.idList).to.eq(firstBoardlists.toDo)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning card')
      cy.get('@2ndBoard').then(({ id }) => {
        deleteBoard(id)
      }).as('cleaning 2nd board')
    })
  })
    
  context('Error scenarios', () => {
    it('Check error return if appKey is missing', function () {
      const { lists } = this.boardAndListsIds
      const authorization = `OAuth oauth_token="${Cypress.env('TOKEN')}"`
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...fix.edit.card
        }, {
          authorization
        }).should(({ status, body }) => {
          expect(status).to.eq(401)
          expect(body).contains(messages.appKeyInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if appKey is invalid', function () {
      const { lists } = this.boardAndListsIds
      const authorization = `OAuth oauth_consumer_key="${fix.fake.appKey}", oauth_token="${Cypress.env('TOKEN')}"`
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...fix.edit.card
        }, {
          authorization
        }).should(({ status, body }) => {
          expect(status).to.eq(401)
          expect(body).contains(messages.appKeyInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if token is missing', function () {
      const { lists } = this.boardAndListsIds
      const authorization = `OAuth oauth_consumer_key="${Cypress.env('APP_KEY')}"`
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...fix.edit.card
        }, {
          authorization
        }).should(({ status, body }) => {
          expect(status).to.eq(401)
          expect(body).contains(messages.tokenMissing)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if token is invalid', function () {
      const { lists } = this.boardAndListsIds
      const authorization = `OAuth oauth_consumer_key="${Cypress.env('APP_KEY')}", oauth_token="${fix.fake.token}"`
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...fix.edit.card
        }, {
          authorization
        }).should(({ status, body }) => {
          expect(status).to.eq(401)
          expect(body).contains(messages.tokenInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if card id is missing', () => {
      editCard('', fix.edit.card).should(({ status, body }) => {
        expect(status).to.eq(404)
        expect(body).contains(messages.putIdMissing)
      })
    })

    it('Check error return if card id is non-existent', () => {
      editCard(fix.fake.card.id, fix.edit.card).should(({ status, body }) => {
        expect(status).to.eq(404)
        expect(body).contains(messages.idInvalid)
      })
    })

    it('Check error return if sent other string value in "pos" field', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        pos: fix.fake.aString
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(400)
          expect(body.message).contains(messages.posInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if sent negative number in "pos" field', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        pos: -1
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(400)
          expect(body.message).contains(messages.posInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if sent invalid datetime in "start" field', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        start: fix.fake.card.start
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(400)
          expect(body.message).contains(messages.dateInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if sent other string value in "start" field', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        start: fix.fake.aString
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(400)
          expect(body.message).contains(messages.dateInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if sent invalid idList', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        idList: fix.fake.list.id
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(404)
          expect(body).contains(messages.idListInvalidUpdate)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if sent invalid idBoard', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        idBoard: fix.fake.board.id
      }
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(404)
          expect(body.message).contains(messages.idBoardInvalid)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning')
    })

    it('Check error return if idlist does not belong to idboard', function () {
      const { lists } = this.boardAndListsIds
      const edit = {
        ...fix.edit.card,
        idList: lists.doing
      }
      // preparing
      cy.createBoard().as('2ndBoard').then(({ lists }) => {
        createCard({
          idList: lists.toDo
        })
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        editCard(id, {
          ...edit
        }).should(({ status, body }) => {
          expect(status).to.eq(404)
          expect(body).contains(messages.idListInvalidUpdate)
        })
      })
      // cleaning
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id)
      }).as('cleaning card')
      cy.get('@2ndBoard').then(({ id }) => {
        deleteBoard(id)
      }).as('cleaning 2nd board')
    })  
  })
})