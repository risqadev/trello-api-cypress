/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getListsFromBoard(boardId, headers) {
  return requestHandler({
    method: 'GET',
    url: `/1/boards/${boardId}/lists/`,
    headers
  }).as('get lists')
}

export { getListsFromBoard }