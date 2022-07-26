/// <reference types='cypress' />

function getBoard(id) {
  return cy.request({
    method: 'GET',
    url: `/1/boards/${id}/`,
    failOnStatusCode: false
  }).as('get board')
}

export { getBoard }