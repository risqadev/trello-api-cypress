/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function createCard(body, headers) {
  return requestHandler({
    method: 'POST',
    url: `/1/cards/`,
    headers,
    body,
    failOnStatusCode: false
  }).as('new card')
}

export { createCard }