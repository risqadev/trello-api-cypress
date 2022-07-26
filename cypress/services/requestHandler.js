/// <reference types='cypress' />

function requestHandler(...args) {
  const authorization = `OAuth oauth_consumer_key="${Cypress.env('APP_KEY')}", oauth_token="${Cypress.env('TOKEN')}"`
  if (args.length === 1 && typeof(args[0]) === 'object') {
    args[0].headers = {
      ...args[0].headers,
      authorization
    }
  }
  return cy.request(...args)
}

export { requestHandler }