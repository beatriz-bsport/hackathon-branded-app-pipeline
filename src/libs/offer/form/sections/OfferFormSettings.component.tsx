import React, { useCallback } from 'react';

import Tune from '@material-ui/icons/Tune';
import { useTheme } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import FormSection from '#components/forms/FormSection';
import { useOfferFormStyles } from '#libs/offer/hooks';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';
import OfferFormField from '#libs/offer/form/OfferFormField.component';
import NumericInput from '#components/input/NumericInput.component';

import { OfferFormValues } from '#libs/offer/types';

type Props = {
  allowGuestMaster: boolean;
  showPartnership: boolean;
  isOfferInGroup?: boolean;
  isEditOffer?: boolean;
};

const OfferFormSettings = (props: Props) => {
  const { allowGuestMaster, showPartnership, isOfferInGroup, isEditOffer } =
    props;
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<OfferFormValues>();
  const { partnerMaxBookingCount, availableOnPartnership } = values;

  const handleToggleManagerOnly = useCallback(
    (event) => {
      setFieldValue('isManagerOnly', !event.target.checked);
    },
    [setFieldValue],
  );

  return (
    <FormSection
      id="offer-form-settings-section"
      sectionTitle={t('form.section.settings.title')}
      sectionIcon={Tune}
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      <div className={classes.settingsFields}>
        <FormControlLabel
          label={t('form.section.settings.field.isManagerOnly')}
          control={
            <Switch
              id="offer-form-manager-only-switch"
              checked={!values.isManagerOnly}
              onChange={handleToggleManagerOnly}
              name="isManagerOnly"
              color="secondary"
            />
          }
          disabled={isEditOffer && isOfferInGroup}
        />

        {allowGuestMaster && (
          <SwitchField
            id="offer-form-allow-guest-switch"
            name="allowGuestOffer"
            label={t('form.section.settings.field.allowGuestOffer')}
            switchColor="secondary"
          />
        )}
      </div>

      {showPartnership && (
        <div className={classes.settingsMarketplaceContainer}>
          <Typography variant="subtitle1" className={classes.mediumFontWeight}>
            {t('form.section.settings.field.partnership.title')}
          </Typography>

          <SwitchField
            id="offer-form-available-partnership-switch"
            name="availableOnPartnership"
            label={t(
              'form.section.settings.field.partnership.availableOnPartnership',
            )}
            switchColor="secondary"
            disabled={isEditOffer && isOfferInGroup}
          />

          {availableOnPartnership && !isEditOffer && (
            <OfferFormField
              label={t(
                'form.section.settings.field.partnership.partnerMaxBookingCount',
              )}
              isRequired
              isError={!!errors.partnerMaxBookingCount}
              isFlexColumn={isMobile}
            >
              <NumericInput
                id="offer-form-partner-max-booking-input"
                name="partnerMaxBookingCount"
                value={partnerMaxBookingCount}
                onChange={handleChange}
                error={!!errors.partnerMaxBookingCount}
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                placeholder="5"
                inputClass={classNames(classes.mediumWidth, {
                  [classes.disabledInput]: isOfferInGroup,
                })}
                disabled={isOfferInGroup}
              />
            </OfferFormField>
          )}

          {errors.partnerMaxBookingCount && (
            <Typography variant="caption" color="error">
              {t(errors.partnerMaxBookingCount)}
            </Typography>
          )}
        </div>
      )}
    </FormSection>
  );
};

export default OfferFormSettings;
