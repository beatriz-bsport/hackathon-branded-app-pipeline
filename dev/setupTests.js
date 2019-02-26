// @flow

import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.snapshot = (element) => expect(element).toMatchSnapshot();

global.snapshotComponent = (component) => snapshot(shallow(component));

global.snapshotReducer = (reducer, initialState, ...actions) => {
  snapshot(initialState);
  return actions.reduce((state, action) => {
    const newState = reducer(state, action);
    snapshot(newState);
    return newState;
  }, initialState);
};

const mockWithNamespaces = () => (Component) => {
  Component.defaultProps = {
    ...Component.defaultProps,
    t: (str) => `Translated[${str}]`,
  };
  return Component;
};

jest.mock('react-i18next', () => ({
  Interpolate: ({ i18nKey, ...props }) =>
    `Interpolated[${i18nKey}] with props ${JSON.stringify(props)}`,
  Trans: ({ i18nKey, ...props }) =>
    `Trans[${i18nKey}] with props ${JSON.stringify(props)}`,
  translate: mockWithNamespaces,
  withNamespaces: mockWithNamespaces,
  t: (str) => `Translated[${str}]`,
}));
