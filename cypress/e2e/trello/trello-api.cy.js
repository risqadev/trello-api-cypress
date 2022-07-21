/// <reference types='cypress' />

import {appKey, token} from '../../../secrets.json'
import fixData from '../../fixtures/trello.json'

context('Trello API Challenge', () => {
  let lastCreatedBoardId
  let lastCreatedCardId

  it('Should create a new board', () => {
    cy.createBoard(fixData.newBoard)
      .should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('name').to.eq(fixData.newBoard.name)
        expect(body).to.have.property('desc').to.eq(fixData.newBoard.desc)
        expect(body).to.have.property('id')
        lastCreatedBoardId = body.id
      })
    
    // just confirming
    cy.get('@new board')
      .then(({body: {id}}) => {
        cy.request('GET', `/1/boards/${id}/?key=${appKey}&token=${token}`).as('get board')
          .should(({status, body}) => {
            expect(status).to.eq(200)
            expect(body).to.have.property('id').to.eq(id)
            expect(body).to.have.property('name').to.eq(fixData.newBoard.name)
            expect(body).to.have.property('desc').to.eq(fixData.newBoard.desc)
          })
      })
    
    // cleaning
    cy.get('@get board')
      .then(({body: {id}}) => {
        cy.request('DELETE', `/1/boards/${id}/?key=${appKey}&token=${token}`).as('board delete')
      }).as('cleaning')
  })

  it.skip('Should create a new card', () => {
    cy.createCard({
      ...fixData.newCard,
      idList: fixData.fixedList.todo.id
    })
      .should(({status, body}) => {
        expect(status).to.eq(200)
        expect(body).to.have.property('id')
        expect(body).to.have.property('name').to.eq(fixData.newCard.name)
        expect(body).to.have.property('desc').to.eq(fixData.newCard.desc)
        expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
        expect(body).to.have.property('idList').to.eq(fixData.fixedList.todo.id)
        lastCreatedCardId = body.id
      })
  })

  it.skip('Should edit a card', () => {
    cy.editCard(fixData.fixedCardToUpdate.id, {
      name: fixData.fixedCardToUpdate.editedName,
      desc: fixData.fixedCardToUpdate.editedDesc,
      idList: fixData.fixedList.doing.id
    })
    .should(({status, body}) => {
      expect(status).to.eq(200)
      expect(body).to.have.property('id').to.eq(fixData.fixedCardToUpdate.id)
      expect(body).to.have.property('name').to.eq(fixData.fixedCardToUpdate.editedName)
      expect(body).to.have.property('desc').to.eq(fixData.fixedCardToUpdate.editedDesc)
      expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
      expect(body).to.have.property('idList').to.eq(fixData.fixedList.doing.id)
    })
    
    cy.get('@card edit')
      .then(() => {
        cy.request('GET',
          `/1/cards/${fixData.fixedCardToUpdate.id}/?key=${appKey}&token=${token}`
        ).as('get card')
          .should(({status, body}) => {
            expect(status).to.eq(200)
            expect(body).to.have.property('id').to.eq(fixData.fixedCardToUpdate.id)
            expect(body).to.have.property('name').to.eq(fixData.fixedCardToUpdate.editedName)
            expect(body).to.have.property('desc').to.eq(fixData.fixedCardToUpdate.editedDesc)
            expect(body).to.have.property('idBoard').to.eq(fixData.fixedBoard.id)
            expect(body).to.have.property('idList').to.eq(fixData.fixedList.doing.id)
          })
      })

    cy.get('@get card')
      .then(() => {
        cy.editCard(fixData.fixedCardToUpdate.id, {
          name: fixData.fixedCardToUpdate.name,
          desc: fixData.fixedCardToUpdate.desc,
          idList: fixData.fixedList.todo.id
        })
      }).as('reset card')
  })

  it.skip('Should remove a card', () => {
    cy.findCardsByName(fixData.cardsToDelete.namePrefix, fixData.fixedList.todo.id)
      .then(([card, ...others]) => {
        cy.request('DELETE', `/1/cards/${card.id}/?key=${appKey}&token=${token}`)
          .as('card deletion')
            .should(({status}) => {
            expect(status).to.eq(200)
          })
      })
  })

  it.skip('Should remove a mass of cards', () => {
    const cardsName = fixData.newCard.name
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

  it.skip('Should remove a board', () => {
    const id = lastCreatedBoardId
    cy.request('DELETE', `/1/boards/${id}/?key=${appKey}&token=${token}`)
      .as('board deletion')
      .should(({status}) => {
        expect(status).to.eq(200)
      })
  })
})