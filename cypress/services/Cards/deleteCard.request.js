/// <reference types='cypress' />

import { requestHandler } from "../requestHandler"

function deleteCard(id) {
  return requestHandler({
    method: 'DELETE',
    url: `/1/cards/${id}/`,
    failOnStatusCode: false
  }).as('delete card')
}

export { deleteCard }