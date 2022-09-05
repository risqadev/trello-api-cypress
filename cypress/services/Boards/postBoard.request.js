/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function createBoard(body, headers) {
  return requestHandler({
    method: 'POST',
    url: `/1/boards/`,
    body,
    headers,
    failOnStatusCode: false
  }).as('new board')
}

export { createBoard }