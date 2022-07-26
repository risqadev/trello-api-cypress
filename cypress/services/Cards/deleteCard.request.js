/// <reference types='cypress' />

function deleteCard(id) {
  return cy.request({
    method: 'DELETE',
    url: `/1/cards/${id}/`,
    failOnStatusCode: false
  }).as('delete card')
}

export { deleteCard }