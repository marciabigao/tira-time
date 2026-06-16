describe('Player Management (CRUD)', () => {
    beforeEach(() => {
      // Intercepta as chamadas de API antes de cada teste (removido o /api/)
      cy.intercept('POST', '**/players').as('createPlayer');
      cy.intercept('PUT', '**/players/*').as('updatePlayer');
      cy.intercept('DELETE', '**/players/*').as('deletePlayer');
    });
  
    it('should allow a user to create, update, and delete a player', () => {
      const playerName = `Cypress Player ${Date.now()}`;
      const updatedPlayerName = `Cypress Player Updated`;
  
      cy.visit('/players');
  
      // --- CRIAR ---
      cy.get('[data-cy="add-player-button"]').click();
      cy.get('[data-cy="player-name-input"]').type(playerName);
      cy.get('[data-cy="player-ability-input"]').select('3');
      cy.get('[data-cy="player-position-input"]').select('FieldPlayer');
      cy.get('[data-cy="submit-player-button"]').click();
  
      // Espera a API de criação finalizar antes de verificar o resultado
      cy.wait('@createPlayer');
      cy.get('[data-cy="player-list-item"]').contains(playerName).should('be.visible');
  
      // --- ATUALIZAR ---
      cy.contains('[data-cy="player-list-item"]', playerName).within(() => {
        cy.get('[data-cy="edit-player-button"]').click();
      });
      cy.get('[data-cy="player-name-input"]').clear().type(updatedPlayerName);
      cy.get('[data-cy="player-ability-input"]').select('5');
      cy.get('[data-cy="submit-player-button"]').click();
  
      // Espera a API de atualização finalizar
      cy.wait('@updatePlayer');
      cy.get('[data-cy="player-list-item"]').contains(updatedPlayerName).should('be.visible');
  
      // --- DELETAR ---
      cy.contains('[data-cy="player-list-item"]', updatedPlayerName).within(() => {
        cy.get('[data-cy="delete-player-button"]').click();
      });
      cy.get('[data-cy="confirm-delete-button"]').click();
  
      // Espera a API de deleção finalizar
      cy.wait('@deletePlayer');
      cy.contains(updatedPlayerName).should('not.exist');
    });
  });