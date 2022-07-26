/// <reference types='cypress' />

import { requestHandler } from "../requestHandler"

function getCard(id) {
  return requestHandler({
    method: 'GET',
    url: `/1/cards/${id}/`,
    failOnStatusCode: false
  }).as('get card')
}

export { getCard }