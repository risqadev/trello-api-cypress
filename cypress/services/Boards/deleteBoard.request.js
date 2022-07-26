/// <reference types='cypress' />

import { requestHandler } from "../requestHandler"

function deleteBoard(id) {
  return requestHandler({
    method: 'DELETE',
    url: `/1/boards/${id}/`,
    failOnStatusCode: false
  }).as('delete board')
}

export { deleteBoard }