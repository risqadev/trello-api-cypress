k/// <reference types='cypress' />

import { getCard } from '../../services/Cards/getCard.request'
import { createCard } from '../../services/Cards/postCard.request'
import { deleteCard } from '../../services/Cards/deleteCard.request'

import fix from '../../fixtures/trello.json'

describe('Card delete', () => {
  context('Success scenarios', () => {

    it('Should remove card if sent an existing id', () => {
      let createdId
  
      // preparing
      createCard({
        ...fix.new.card,
        idList: fix.fixed.list.todo.id
      }).as('preparing')
  
      cy.get('@new card').then(({body: {id}}) => {
        createdId = id
        deleteCard(id).its('status').should('be.equal', 200)
      })
      
      cy.get('@delete card').then(() => {
        getCard(createdId).its('status').should('be.equal', 404)
      })
    })
  })
    
  context('Error scenarios', () => {

    it("Check error return when card id doesn't exist", () => {
      deleteCard(fix.fake.card.id).its('status').should('be.equal', 404)
    })
  })
})