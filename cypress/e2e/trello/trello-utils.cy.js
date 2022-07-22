/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

context('Utils', () => {
  it('Should remove a mass of cards', () => {
    const cardsName = fixData.cardToDelete.name
    cy.findCardsByName(cardsName, fixData.fixedList.todo.id)
      .then(cards => {
        for (const card of cards) {
          cy.request('DELETE', `/1/cards/${card.id}/?key=${appKey}&token=${token}`)
            .as('card deletion')
              .should(({status}) => {
              expect(status).to.eq(200)
            })
        }
      })
  })
})