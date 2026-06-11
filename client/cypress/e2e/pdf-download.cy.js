describe('PDF Download', () => {
    it('should trigger a request to the PDF generation endpoint after a valid draw', () => {
      // Interceptar as chamadas de API (removido o /api/)
      cy.intercept('POST', '**/draw-teams').as('drawTeams');
      cy.intercept('POST', '**/generate-pdf').as('generatePdf');
  
      // Realizar um sorteio válido
      cy.visit('/match');
      cy.get('[data-cy="match-name-input"]').type('Partida para PDF');
      cy.get('[data-cy="match-date-input"]').type('2026-06-13');
  
      cy.get('[data-cy="player-select-goleiro"]').each(($el, index) => {
        if (index < 2) { cy.wrap($el).click(); }
      });
      cy.get('[data-cy="player-select-linha"]').each(($el, index) => {
        if (index < 8) { cy.wrap($el).click(); }
      });
  
      cy.get('[data-cy="submit-draw-button"]').click();
  
      // Esperar o sorteio terminar
      cy.wait('@drawTeams');
  
      // Na página de resultados, clicar no botão de download
      cy.url().should('include', '/teams-result');
      cy.get('[data-cy="download-pdf-button"]').click();
  
      // Verificar se a chamada de API do PDF foi feita com sucesso
      cy.wait('@generatePdf').its('response.statusCode').should('eq', 200);
    });
  });