import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, FieldProps, FastField, FieldArray } from 'formik';
import type { MarketingPreferenceData } from '#src/libs/communication/types';
import Typography from '#Fabrique/Typography';
import Button from '#Fabrique/ButtonV2';
import { Mail05, Phone01 } from '#src/components/untitledui';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import type { OptionCallback } from '#src/state/types';
import './styles.css';

type FormValues = MarketingPreferenceData[];

interface FranchiseMarketingPreferencesProps {
  preferences: MarketingPreferenceData[];
  onSubmit: (
    preferences: MarketingPreferenceData[],
    option?: OptionCallback,
  ) => void;
  isSubmitting?: boolean;
}

const FranchiseMarketingPreferences: React.FC<
  FranchiseMarketingPreferencesProps
> = ({ preferences, onSubmit }) => {
  const { t } = useTranslation('consumerSpace');

  // Handle form submission
  const _handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  return (
    <Formik
      enableReinitialize
      initialValues={preferences}
      onSubmit={_handleSubmit}
    >
      {({ values, handleSubmit, isSubmitting }) => {
        return (
          <Form className="bs-marketing-prefs__form" onSubmit={handleSubmit}>
            <div className="bs-marketing-prefs__legend">
              <div className="bs-marketing-prefs__legend-item">
                <Mail05 fontSize="small" />
                <Typography variant="body-2xs">
                  {t('reworked.myProfile.notifications.receiveEmailUpdates')}
                </Typography>
              </div>
              <div className="bs-marketing-prefs__legend-item">
                <Phone01 fontSize="small" />
                <Typography variant="body-2xs">
                  {t('reworked.myProfile.notifications.receiveSmsUpdates')}
                </Typography>
              </div>
            </div>
            <FieldArray name="preferences">
              {() => (
                <div className="bs-marketing-prefs__companies-list">
                  {values.map((pref, index) => (
                    <div
                      key={pref.company_id}
                      className="bs-marketing-prefs__company-item"
                    >
                      <Typography
                        className="bs-marketing-prefs__company-name"
                        variant="body-md"
                      >
                        {pref.company_name}
                      </Typography>
                      <div className="bs-marketing-prefs__toggles">
                        <FastField
                          name={`${index}.opt_in_out_data.accept_email`}
                        >
                          {({ field }: FieldProps) => (
                            <FormControlLabel
                              className="bs-marketing-prefs__toggle"
                              control={
                                <Switch
                                  checked={field.value}
                                  size="small"
                                  {...field}
                                  color="primary"
                                />
                              }
                              label={
                                <div className="bs-marketing-prefs__toggle-icon">
                                  <Mail05 fontSize="small" />
                                </div>
                              }
                            />
                          )}
                        </FastField>

                        <FastField name={`${index}.opt_in_out_data.accept_sms`}>
                          {({ field }: FieldProps) => (
                            <FormControlLabel
                              className="bs-marketing-prefs__toggle"
                              control={
                                <Switch
                                  checked={field.value}
                                  size="small"
                                  {...field}
                                  color="primary"
                                />
                              }
                              label={
                                <div className="bs-marketing-prefs__toggle-icon">
                                  <Phone01 fontSize="small" />
                                </div>
                              }
                            />
                          )}
                        </FastField>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <div className="bs-marketing-prefs__actions">
              <Button
                className="bs-marketing-prefs__submit-btn"
                color="primary"
                isDisabled={isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                {isSubmitting
                  ? t(
                      'reworked.myProfile.notifications.updatePreferencesLoading',
                    )
                  : t(
                      'reworked.myProfile.notifications.updatePreferencesButton',
                    )}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default React.memo(FranchiseMarketingPreferences);
