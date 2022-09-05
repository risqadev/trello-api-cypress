/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getBoard(id, headers) {
  return requestHandler({
    method: 'GET',
    url: `/1/boards/${id}/`,
    headers,
    failOnStatusCode: false
  }).as('get board')
}

export { getBoard }