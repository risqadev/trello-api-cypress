/// <reference types='cypress' />

function getCardsByListId(listId) {
  return cy.request({
    method: 'GET',
    url: `/1/lists/${listId}/cards/`
  }).as('get cards')
}

export { getCardsByListId }