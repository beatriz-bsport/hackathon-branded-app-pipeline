// @flow

import React from 'react';

import App from './App';

jest.mock('./i18n');
jest.mock('./config');
jest.mock('./store');

it('renders without crashing', () => {
  snapshotComponent(<App />);
});
