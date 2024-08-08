describe('GraphQL MSAL Login Test', () => {
    before(() => {
      cy.msalLogin('user@example.com', 'password123');
    });
  
    it('should access protected route', () => {
      cy.get('@tokens').then((tokens) => {
        // Example of using the token for a GraphQL request
        const query = `
          query {
            getUserData {
              id
              email
              name
            }
          }
        `;
  
        cy.request({
          method: 'POST',
          url: Cypress.env('GRAPHQL_API_URL'),
          body: {
            query
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.accessToken}`
          }
        }).then((response) => {
          expect(response.body.data.getUserData.email).to.equal('user@example.com');
        });
  
        // Optionally, visit a protected route
        cy.visit('/protected-route');
        cy.contains('Welcome, User');
      });
    });
  });
  