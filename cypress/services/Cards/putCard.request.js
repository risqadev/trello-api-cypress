/// <reference types='cypress' />

import { requestHandler } from "../requestHandler"

function editCard(id, data) {
  return requestHandler({
    method: 'PUT',
    url: `/1/cards/${id}`,
    body: { ...data },
    failOnStatusCode: false
  }).as('edit card')
}

export { editCard }