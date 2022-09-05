/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function deleteBoard(id, headers) {
  return requestHandler({
    method: 'DELETE',
    url: `/1/boards/${id}/`,
    headers,
    failOnStatusCode: false
  }).as('delete board')
}

export { deleteBoard }