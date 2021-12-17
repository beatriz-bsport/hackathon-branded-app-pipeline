/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';

import FuzzySearch from '../search/FuzzySearch.component';

// Fuze search is base on delay text field we mock it to use it in a syncrhonous way
jest.mock('../DelayedTextField.component.tsx');

const items = [
  { label: 'First', id: 1 },
  { label: 'Second', id: 2 },
  { label: 'Third', id: 3 },
];

describe('FuzeSearch: <FuzeSearch />', () => {
  let component: any;
  beforeEach(() => {
    act(() => {
      component = render(
        <FuzzySearch
          placeholder="Search"
          items={items}
          searchFields={['label']}
          itemRenderer={({ label, id }, search) => (
            <div data-testid="row-fuze" key={id}>{`${label} / ${search}`}</div>
          )}
        />,
      );
    });
  });

  it('on input change the value', () => {
    const input = component.getByTestId('input-fuze-search');
    fireEvent.change(input, { target: { value: 'First' } });

    expect(input.value).toBe('First');
  });

  it('on input display a similar results', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: 'First' } });
    });

    const results = component.getAllByTestId('row-fuze');

    expect(results.length).toBe(1);
  });

  it('on input can display multiple value', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: 's' } });
    });

    const results = component.getAllByTestId('row-fuze');

    expect(results.length).toBe(2);
  });

  it('on empty input display no value', () => {
    const input = component.getByTestId('input-fuze-search');

    act(() => {
      fireEvent.change(input, { target: { value: '' } });
    });

    const results = component.queryAllByTestId('row-fuze');

    expect(results.length).toBe(0);
  });
});
