/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function createCard(dataObject) {
  return requestHandler({
    method: 'POST',
    url: `/1/cards/`,
    body: { ...dataObject },
    failOnStatusCode: false
  }).as('new card')
}

export { createCard }