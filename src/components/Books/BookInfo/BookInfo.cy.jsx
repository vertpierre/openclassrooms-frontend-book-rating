import React from 'react';
import BookInfo from './BookInfo';

describe('<BookInfo />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<BookInfo />);
  });
});
