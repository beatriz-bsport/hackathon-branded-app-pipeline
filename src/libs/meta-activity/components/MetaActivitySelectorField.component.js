import React from 'react';

import omit from 'lodash/omit';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import WarningIcon from '@material-ui/icons/Warning';
import { Field, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';

import MetaActivitySelector from './MetaActivitySelector.component';

export const MetaActivitySelectorField = withTranslation([])((props) => {
  const { t, fullWidth, required, helperText, showHelperText } = props;
  return (
    <Field {...props}>
      {({ field, form: { setFieldValue, touched, errors } }) => {
        const metaActivitySelected = props.metaActivityList.find(
          (activity) => activity.id === field.value,
        );
        const blockedBookingsDays =
          metaActivitySelected &&
          metaActivitySelected.first_booking_minutes_until / 1440;
        return (
          <FormControl
            error={!!(touched[field.name] && errors[field.name])}
            fullWidth={fullWidth}
            required={required}
          >
            <MetaActivitySelector
              metaActivities={props.metaActivityList}
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
              selectedMetaActivities={[field.value]}
              selectOption={(option) => {
                setFieldValue(field.name, option.value);
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
            {showHelperText(blockedBookingsDays) &&
              helperText &&
              blockedBookingsDays && (
                <FormHelperText
                  style={{
                    display: 'flex',
                    flexDirection: 'align-items',
                    justifyContent: 'space-between',
                  }}
                >
                  <WarningIcon color="disabled" fontSize="small" />
                  <Typography variant="caption">
                    {helperText(blockedBookingsDays)}
                  </Typography>
                </FormHelperText>
              )}
          </FormControl>
        );
      }}
    </Field>
  );
});

export default withTranslation()(MetaActivitySelectorField);
