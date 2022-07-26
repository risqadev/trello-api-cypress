/// <reference types='cypress' />

function editCard(id, data) {
  return cy.request({
    method: 'PUT',
    url: `/1/cards/${id}`,
    body: { ...data },
    failOnStatusCode: false
  }).as('edit card')
}

export { editCard }