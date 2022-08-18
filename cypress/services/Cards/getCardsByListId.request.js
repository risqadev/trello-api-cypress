/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getCardsByListId(listId) {
  return requestHandler({
    method: 'GET',
    url: `/1/lists/${listId}/cards/`
  }).as('get cards')
}

export { getCardsByListId }