/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getCard(id, headers) {
  return requestHandler({
    method: 'GET',
    url: `/1/cards/${id}/`,
    headers,
    failOnStatusCode: false
  }).as('get card')
}

export { getCard }