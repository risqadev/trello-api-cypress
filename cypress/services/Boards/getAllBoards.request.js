/// <reference types='cypress' />

import { requestHandler } from "../../utils/requestHandler"

function getAllBoards() {
  return requestHandler({
    method: 'GET',
    url: `/1/members/me/boards`
  }).as('get boards')
}

export { getAllBoards }