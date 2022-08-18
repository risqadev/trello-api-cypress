/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function createBoard(data) {
  return requestHandler({
    method: 'POST',
    url: `/1/boards/`,
    body: { ...data },
    failOnStatusCode: false
  }).as('new board')
}

export { createBoard }