import React from 'react';

import omit from 'lodash/omit';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { Field, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';

import MetaActivitySelector from './MetaActivitySelector.component';

export const SelectField = withTranslation([])((props) => {
  const { t, fullWidth, required } = props;
  return (
    <Field {...props}>
      {({ field, form: { setFieldValue, touched, errors } }) => {
        return (
          <FormControl
            fullWidth={fullWidth}
            required={required}
            error={!!(touched[field.name] && errors[field.name])}
          >
            <MetaActivitySelector
              nameCypress={`select-${props.name}`}
              metaActivities={props.metaActivityList}
              {...field}
              {...omit(props, [
                't',
                'tReady',
                'defaultNS',
                'i18n',
                'i18nOptions',
                'reportNS',
              ])}
              selectedMetaActivities={[field.value]}
              onChange={(option) => {
                setFieldValue(field.name, option);
              }}
            />
            {!props.disabled && (
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                value={field.value}
                required={required}
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
