/// <reference types='cypress' />

function getCard(id) {
  return cy.request({
    method: 'GET',
    url: `/1/cards/${id}/`,
    failOnStatusCode: false
  }).as('get card')
}

export { getCard }