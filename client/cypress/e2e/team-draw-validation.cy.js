describe('Team Draw - Validation', () => {
    it('should show an error if not enough goalkeepers are selected', () => {
      cy.visit('/match');
  
      // Preencher informações da partida
      cy.get('[data-cy="match-name-input"]').type('Partida com Erro');
      cy.get('[data-cy="match-date-input"]').type('2026-06-12');
  
      // Selecionar apenas 1 goleiro
      cy.get('[data-cy="player-select-goleiro"]').first().click();
  
      // Selecionar 9 jogadores de linha
      cy.get('[data-cy="player-select-linha"]').each(($el, index) => {
        if (index < 9) {
          cy.wrap($el).click();
        }
      });
  
      // Tentar sortear
      cy.get('[data-cy="submit-draw-button"]').click();
  
      // Verificar se a mensagem de erro correta apareceu
      cy.url().should('not.include', '/teams-result');
      cy.get('[data-cy="form-error"]').should('be.visible').and('contain', 'você deve selecionar pelo menos 2 goleiros');
    });
  });