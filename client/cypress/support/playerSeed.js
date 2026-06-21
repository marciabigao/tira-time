const API_URL = 'http://localhost:3000';

export function createPlayers() {
  cy.request('DELETE', `${API_URL}/test/reset`);

  for (let i = 1; i <= 2; i++) {
    cy.request('POST', `${API_URL}/players`, {
      name: `E2E-GK-${Date.now()}-${i}`,
      ability: 3,
      position: 'GoalKeeper'
    });
  }

  for (let i = 1; i <= 8; i++) {
    cy.request('POST', `${API_URL}/players`, {
      name: `E2E-FP-${Date.now()}-${i}`,
      ability: 3,
      position: 'FieldPlayer'
    });
  }
}

export function clearPlayers() {
  cy.request('DELETE', `${API_URL}/test/reset`);
}