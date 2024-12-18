import React from 'react';
import { Field, useField } from 'formik';

import LevelSelector, { Props } from './LevelSelector.component';

const LevelSelectorFormik = (
  props: Props & {
    name: string;
  },
) => {
  const [field, meta, helpers] = useField<number>(props.name);

  return (
    <Field {...props}>
      {() => (
        <LevelSelector
          {...props}
          error={!!(meta.touched && meta.error)}
          onSelect={(value) => {
            helpers.setValue(value);
          }}
          selectedLevel={field.value}
        />
      )}
    </Field>
  );
};

export default LevelSelectorFormik;
