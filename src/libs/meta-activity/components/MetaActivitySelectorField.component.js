import React from 'react';

import omit from 'lodash/omit';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Field, ErrorMessage } from 'formik';
import { withTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';

import MetaActivitySelector from './MetaActivitySelector.component';

export const MetaActivitySelectorField = withTranslation([])((props) => {
  const { t, fullWidth, required, helperText, showHelperText } = props;
  const classes = useStyles();
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
                <FormHelperText>
                  <Alert
                    classes={{
                      root: classes.alertRoot,
                    }}
                    severity="warning"
                  >
                    <Typography
                      className={classes.alertMessage}
                      variant="caption"
                    >
                      {helperText(blockedBookingsDays)}
                    </Typography>
                  </Alert>
                </FormHelperText>
              )}
          </FormControl>
        );
      }}
    </Field>
  );
});

const useStyles = makeStyles(() => ({
  alertRoot: { display: 'flex', alignItems: 'center' },
  alertMessage: { whiteSpace: 'pre-line' },
}));

export default withTranslation()(MetaActivitySelectorField);
