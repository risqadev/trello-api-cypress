/// <reference types='cypress' />

function createCard(dataObject) {
  return cy.request({
    method: 'POST',
    url: `/1/cards/`,
    body: { ...dataObject },
    failOnStatusCode: false
  }).as('new card')
}

export { createCard }