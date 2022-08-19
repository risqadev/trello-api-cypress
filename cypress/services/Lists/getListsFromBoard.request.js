/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getListsFromBoard(boardId) {
  return requestHandler({
    method: 'GET',
    url: `/1/boards/${boardId}/lists/`
  }).as('get lists')
}

export { getListsFromBoard }