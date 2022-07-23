/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

context.skip('Utils', () => {
  it('Should remove a mass of cards', () => {
    const cardsName = "Fixed card"
    cy.findCardsByName(cardsName, fixData.fixedList.doing.id)
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