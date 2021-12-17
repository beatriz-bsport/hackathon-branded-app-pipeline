/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { Formik } from 'formik';

import { TextField } from '../components/GenericFormik.input';

describe('GenericFormik: <TextField />', () => {
  let component: any;
  beforeEach(() => {
    act(() => {
      component = render(
        <Formik initialValues={{ label: '' }} onSubmit={() => {}}>
          <TextField
            variant="filled"
            name="label"
            id="label"
            label="label"
            disabled={false}
            required={false}
          />
        </Formik>,
      );
    });
  });

  it('on input change the value', () => {
    const input = component.getByTestId('input-test');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(input.value).toBe('new value');
  });
});
