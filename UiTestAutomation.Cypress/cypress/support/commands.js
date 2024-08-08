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
// Cypress.Commands.add("login", (email, password) => { ... })

import { login } from "./auth";

let cachedTokenExpiryTime = new Date().getTime();
let cachedTokenResponse = null;

Cypress.Commands.add("login", () => {
  // Clear our cache if tokens are expired
  if (cachedTokenExpiryTime <= new Date().getTime()) {
    cachedTokenResponse = null;
  }

  return login(cachedTokenResponse).then((tokenResponse) => {
    cachedTokenResponse = tokenResponse;
    // Set expiry time to 50 minutes from now
    cachedTokenExpiryTime = new Date().getTime() + 50 * 60 * 1000;
  });
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


//___________________________________________________//____________________________________________________//


//loginmsal.cy.js using query

Cypress.Commands.add('msalLogin', (username, password) => {
  const query = `
    mutation GetToken($clientId: String!, $clientSecret: String!, $username: String!, $password: String!) {
      authenticate(input: {
        clientId: $clientId,
        clientSecret: $clientSecret,
        username: $username,
        password: $password
      }) {
        accessToken
        refreshToken
        idToken
      }
    }
  `;

  return cy.request({
    method: 'POST',
    url: Cypress.env('GRAPHQL_API_URL'),
    body: {
      query,
      variables: {
        clientId: Cypress.env('CLIENT_ID'),
        clientSecret: Cypress.env('CLIENT_SECRET'),
        username: username,
        password: password
      }
    },
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    const { accessToken, refreshToken, idToken } = response.body.data.authenticate;

    // You can store tokens in localStorage/sessionStorage for further use
    window.localStorage.setItem('access_token', accessToken);
    window.localStorage.setItem('refresh_token', refreshToken);
    window.localStorage.setItem('id_token', idToken);

    // Or use them immediately for authenticated requests
    cy.wrap({ accessToken, refreshToken, idToken }).as('tokens');
  });
});


//cypress.json
/*
{
  "env": {
    "GRAPHQL_API_URL": "https://your-graphql-api.com/graphql",
    "CLIENT_ID": "your-client-id",
    "CLIENT_SECRET": "your-client-secret"
  }
}

*/
//________________________________//____________________________________//
