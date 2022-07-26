/// <reference types='cypress' />

function deleteBoard(id) {
  return cy.request({
    method: 'DELETE',
    url: `/1/boards/${id}/`,
    failOnStatusCode: false
  }).as('delete board')
}

export { deleteBoard }