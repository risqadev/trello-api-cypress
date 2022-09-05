/// <reference types='cypress' />

import { createCard } from '../../services/Cards/postCard.request'
import { deleteCard } from '../../services/Cards/deleteCard.request'
import { deleteBoard } from '../../services/Boards/deleteBoard.request'

import fix from '../../fixtures/trello.json'
import messages from '../../fixtures/messages.json'

describe('Card delete', () => {
  before(function () {
    cy.createBoard().as('boardAndListsIds')
  })

  after(function () {
    const {id} = this.boardAndListsIds
    deleteBoard(id)
  })

  context('Success scenarios', () => {
    it('Should remove card if sent a valid id', function () {
      const { lists } = this.boardAndListsIds
      // preparing
      createCard({
        idList: lists.toDo
      }).as('preparing')
      // testing
      cy.get('@new card').then(({ body: { id } }) => {
        deleteCard(id).should(({ status }) => {
          expect(status).to.eq(200)
        })
      })
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
        deleteCard(id, {
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
        deleteCard(id, {
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
        deleteCard(id, {
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
        deleteCard(id, {
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
      deleteCard('').should(({ status, body }) => {
        expect(status).to.eq(404)
        expect(body).contains(messages.deleteIdMissing)
      })
    })

    it('Check error return if card id is invalid', () => {
      deleteCard(fix.fake.card.id).should(({ status, body }) => {
        expect(status).to.eq(404)
        expect(body).contains(messages.idInvalid)
      })
    })
  })
})