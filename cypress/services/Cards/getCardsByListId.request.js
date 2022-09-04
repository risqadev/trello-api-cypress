/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getCardsByListId(listId, headers) {
  return requestHandler({
    method: 'GET',
    url: `/1/lists/${listId}/cards/`,
    headers
  }).as('get cards')
}

export { getCardsByListId }