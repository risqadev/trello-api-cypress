/// <reference types='cypress' />

import { getCard } from '../../services/Cards/getCard.request'
import { editCard } from '../../services/Cards/putCard.request'

import fix from '../../fixtures/trello.json'

describe('Card update', () => {
  context('Success scenarios', () => {

    it('Should edit a card if sent updated data', () => {
      editCard(fix.fixed.card.id, fix.edit.card).should(({status}) => {
        expect(status).to.eq(200)
      }).then(() => {
        getCard(fix.fixed.card.id)
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
      cy.get('@get card').then(() => 
        editCard(fix.fixed.card.id, fix.fixed.card)
      ).as('reset card')
    })

  })
    
  context.only('Error scenarios', () => {

    it('Should fail when card id is non-existent', () => {
      editCard(fix.fake.card.id, fix.edit.card)
        .its('status').should('be.equal', 404)
    })
  
    it('Should fail when idlist does not belong to idboard', () => {
      editCard(fix.fixed.card.id, {
        ...fix.edit.card,
        idList: fix.fixed.list.done.id,
        idBoard: fix.fixed.auxBoard.id
      }).its('status').should('be.equal', 400)
    })
  
  })

})