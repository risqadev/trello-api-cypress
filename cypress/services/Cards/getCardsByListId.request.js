/// <reference types='cypress' />

import { requestHandler } from "../requestHandler"

function getCardsByListId(listId) {
  return requestHandler({
    method: 'GET',
    url: `/1/lists/${listId}/cards/`
  }).as('get cards')
}

export { getCardsByListId }