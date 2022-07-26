/// <reference types='cypress' />

import fix from '../fixtures/trello.json'

import { getCardsByListId } from '../services/Cards/getCardsByListId.request'
import { deleteCard } from '../services/Cards/deleteCard.request'

describe('Utils', () => {
  it('Should remove a mass of cards', () => {
    
    const cardsName = "Card created"

    getCardsByListId(fix.fixed.list.todo.id)
      .should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.be.an('array').and.not.to.be.empty
        const cards = body.filter(({name}) => name.includes(cardsName))
      
        for (const card of cards) {
          deleteCard(card.id).its('status').should('be.equal', 200)
        }
      })
  })
})