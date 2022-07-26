/// <reference types='cypress' />

import { requestHandler } from "../requestHandler"

function getBoard(id) {
  return requestHandler({
    method: 'GET',
    url: `/1/boards/${id}/`,
    failOnStatusCode: false
  }).as('get board')
}

export { getBoard }