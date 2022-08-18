/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getBoard(id) {
  return requestHandler({
    method: 'GET',
    url: `/1/boards/${id}/`,
    failOnStatusCode: false
  }).as('get board')
}

export { getBoard }