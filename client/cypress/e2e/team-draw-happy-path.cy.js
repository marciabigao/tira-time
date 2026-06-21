import { createPlayers, clearPlayers } from '../support/playerSeed';

describe('Team Draw - Happy Path', () => {

    before(() => {
    createPlayers();
    });

    after(() => {
    clearPlayers();
    });

    it('should successfully draw teams by selecting existing players from the UI', () => {
      // Intercepta a chamada de sorteio (removido o /api/)
      cy.intercept('POST', '**/draw-teams').as('drawTeams');
  
      cy.visit('/match');
  
      cy.get('[data-cy="match-name-input"]').type('Partida de Teste E2E');
      cy.get('[data-cy="match-date-input"]').type('2026-06-11');
      cy.get('[data-cy="match-location-input"]').type('Campo de Teste');
  
      // Seleciona 2 goleiros
      cy.get('[data-cy="player-select-goleiro"]').each(($el, index) => {
        if (index < 2) cy.wrap($el).click();
      });
  
      // Seleciona 8 jogadores de linha
      cy.get('[data-cy="player-select-linha"]').each(($el, index) => {
        if (index < 8) cy.wrap($el).click();
      });
  
      cy.get('[data-cy="submit-draw-button"]').click();
  
      // Espera a API de sorteio finalizar antes de verificar a URL e o resultado
      cy.wait('@drawTeams');
  
      cy.url().should('include', '/teams-result');
      cy.contains('h1', 'Partida de Teste E2E').should('be.visible');
      cy.get('[data-cy="team-card"]').should('have.length', 2);
    });
  });