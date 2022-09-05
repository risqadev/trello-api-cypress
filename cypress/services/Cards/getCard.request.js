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

function getCardsByListId(listId, headers) {
  return requestHandler({
    method: 'GET',
    url: `/1/lists/${listId}/cards/`,
    headers
  }).as('get cards')
}

export { getCard, getCardsByListId }