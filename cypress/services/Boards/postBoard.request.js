/// <reference types='cypress' />

function createBoard(data) {
  return cy.request({
    method: 'POST',
    url: `/1/boards/`,
    body: { ...data },
    failOnStatusCode: false
  }).as('new board')
}

export { createBoard }