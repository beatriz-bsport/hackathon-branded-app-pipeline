import React from 'react';

import { FieldArray } from 'formik';
import EmailInputWithChips, { Props } from './EmailInputWithChips.component';

export const EmailInputWithChipsField = (props: Props) => {
  return (
    <FieldArray {...props} name={props.textFieldName}>
      {({ remove, push }) => {
        return (
          <div>
            <EmailInputWithChips
              {...props}
              addEmailToList={push}
              removeEmailFromList={remove}
            />
          </div>
        );
      }}
    </FieldArray>
  );
};

export default EmailInputWithChipsField;
