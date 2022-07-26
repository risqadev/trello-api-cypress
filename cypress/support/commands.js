// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  const authorization = `OAuth oauth_consumer_key="${Cypress.env('APP_KEY')}", oauth_token="${Cypress.env('TOKEN')}"`
  if (args.length === 1 && typeof(args[0]) === 'object') {
    args[0].headers = {
      ...args[0].headers,
      authorization
    }
  }
  return originalFn(...args)
})