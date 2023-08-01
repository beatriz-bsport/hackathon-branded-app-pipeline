/**
 * @jest-environment jsdom
 */
// @ts-nocheck

import React from 'react';
import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

import { TextField } from '../components/GenericFormik.input';

describe('GenericFormik: <TextField />', () => {
  let component: any;
  beforeEach(() => {
    act(() => {
      component = render(
        <Formik initialValues={{ label: '' }} onSubmit={() => {}}>
          <TextField
            disabled={false}
            id="label"
            label="label"
            name="label"
            required={false}
            variant="filled"
          />
        </Formik>,
      );
    });
  });

  waitFor(() => {
    it('on input change the value', () => {
      const input = component.getByTestId('input-test');

      fireEvent.change(input, { target: { value: 'new value' } });

      expect(input.value).toBe('new value');
    });
  });
});
