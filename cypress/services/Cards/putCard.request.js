/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function editCard(id, body, headers) {
  return requestHandler({
    method: 'PUT',
    url: `/1/cards/${id}`,
    body,
    headers,
    failOnStatusCode: false
  }).as('edit card')
}

export { editCard }