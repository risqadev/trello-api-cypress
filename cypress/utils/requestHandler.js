/// <reference types='cypress' />

function requestHandler(data) {
  const authorization = `OAuth oauth_consumer_key="${Cypress.env('APP_KEY')}", oauth_token="${Cypress.env('TOKEN')}"`
  if (!data.headers || !data.headers.authorization) {
    data.headers = {
      ...data.headers,
      authorization
    }
  }
  return cy.request({ ...data })
}

export { requestHandler }