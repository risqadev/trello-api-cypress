/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function deleteCard(id, headers) {
  return requestHandler({
    method: 'DELETE',
    url: `/1/cards/${id}/`,
    headers,
    failOnStatusCode: false
  }).as('delete card')
}

export { deleteCard }