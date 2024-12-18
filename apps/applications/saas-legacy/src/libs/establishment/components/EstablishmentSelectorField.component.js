import React from 'react';

import omit from 'lodash/omit';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { Field, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';

import EstablishmentSelector from './EstablishmentSelector.component';

export const SelectField = withTranslation([])((props) => {
  const { t, fullWidth, required } = props;
  return (
    <Field {...props}>
      {({ field, form: { setFieldValue, touched, errors } }) => {
        return (
          <FormControl
            error={!!(touched[field.name] && errors[field.name])}
            fullWidth={fullWidth}
            required={required}
          >
            <EstablishmentSelector
              closeMenuOnSelect
              isClearable
              establishments={props.establishmentList}
              nameCypress={`select-${props.name}`}
              {...field}
              {...omit(props, [
                't',
                'tReady',
                'defaultNS',
                'i18n',
                'i18nOptions',
                'reportNS',
              ])}
              selectedEstablishments={[field.value]}
              selectOption={(option) => {
                if (!option) {
                  setFieldValue(field.name, null);
                } else {
                  setFieldValue(field.name, option.value);
                }
              }}
            />
            {!props.disabled && (
              <input
                autoComplete="off"
                required={required}
                style={{ opacity: 0, height: 0 }}
                tabIndex={-1}
                value={field.value}
              />
            )}
            <ErrorMessage {...props}>
              {(message) => (
                <Typography variant="body1">{t(message)}</Typography>
              )}
            </ErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
});

export default withTranslation()(SelectField);
