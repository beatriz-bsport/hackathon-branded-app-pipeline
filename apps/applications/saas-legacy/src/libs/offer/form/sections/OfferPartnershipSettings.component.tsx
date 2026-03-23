import React, { useCallback } from 'react';

import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';

import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import NumericInput from '#src/components/input/NumericInput.component';
import OfferFormField from '#src/libs/offer/form/OfferFormField.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

import { useOfferFormStyles } from '#src/libs/offer/hooks';

import {
  OfferFormValues,
  PartnerSpotCappingStrategy,
} from '#src/libs/offer/types';

type Props = {
  isOfferInGroup?: boolean;
};

const OfferPartnershipSettings: React.FC<Props> = ({ isOfferInGroup }) => {
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const isDraftPartnershipOffersEnabled = useSafeFlag(
    FeatureFlags.BOOKING_DRAFT_PARTNERSHIP_OFFERS,
  );

  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<OfferFormValues>();

  const {
    availableOnPartnership,
    partnerMaxBookingCount,
    partnerSpotCappingStrategy,
  } = values;

  const handleChangeSpotCappingStrategy = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(
        'partnerSpotCappingStrategy',
        event.target.value as PartnerSpotCappingStrategy,
      );
    },
    [setFieldValue],
  );

  if (!isDraftPartnershipOffersEnabled) {
    // DEPRECATED
    return (
      <>
        <SwitchField
          id="offer-form-available-partnership-switch"
          label={t(
            'form.section.settings.field.partnership.enablePartneshipBookings',
          )}
          name="availableOnPartnership"
          switchColor="secondary"
        />
        {availableOnPartnership && (
          <OfferFormField
            isRequired
            isError={!!errors.partnerMaxBookingCount}
            label={t(
              'form.section.settings.field.partnership.partnerMaxBookingCountDEPRECATED',
            )}
          >
            <NumericInput
              disabled={isOfferInGroup}
              error={!!errors.partnerMaxBookingCount}
              id="offer-form-partner-max-booking-input"
              inputClass={clsx(classes.bigWidth, {
                [classes.disabledInput]: isOfferInGroup,
              })}
              name="partnerMaxBookingCount"
              onChange={handleChange}
              placeholder="5"
              size="small"
              value={partnerMaxBookingCount ?? 0}
              variant="outlined"
            />
          </OfferFormField>
        )}
      </>
    );
  }

  return (
    <>
      <SwitchField
        id="offer-form-available-partnership-switch"
        label={t(
          'form.section.settings.field.partnership.enablePartneshipBookings',
        )}
        name="availableOnPartnership"
        switchColor="secondary"
      />

      {availableOnPartnership && (
        <RadioGroup
          aria-label={t(
            'form.section.settings.field.partnership.partnerSpotCappingStrategy.label',
          )}
          name="partnerSpotCappingStrategy"
          onChange={handleChangeSpotCappingStrategy}
          value={partnerSpotCappingStrategy}
        >
          <FormControlLabel
            control={
              <Radio
                className={classes.cappingStrategyRadio}
                id="offer-form-spot-capping-unlimited-radio"
              />
            }
            label={
              <>
                <Typography>
                  {t(
                    'form.section.settings.field.partnership.partnerSpotCappingStrategy.UNLIMITED.label',
                  )}
                </Typography>
                <Typography variant="caption">
                  {t(
                    'form.section.settings.field.partnership.partnerSpotCappingStrategy.UNLIMITED.helperText',
                  )}
                </Typography>
              </>
            }
            value={PartnerSpotCappingStrategy.UNLIMITED}
          />

          <FormControlLabel
            control={
              <Radio
                className={classes.cappingStrategyRadio}
                id="offer-form-spot-capping-combined-radio"
              />
            }
            label={
              <>
                <Typography>
                  {t(
                    'form.section.settings.field.partnership.partnerSpotCappingStrategy.COMBINED.label',
                  )}
                </Typography>
                <Typography variant="caption">
                  {t(
                    'form.section.settings.field.partnership.partnerSpotCappingStrategy.COMBINED.helperText',
                  )}
                </Typography>
              </>
            }
            value={PartnerSpotCappingStrategy.COMBINED}
          />

          {partnerSpotCappingStrategy ===
            PartnerSpotCappingStrategy.COMBINED && (
            <div className={classes.combinedMaxCount}>
              <OfferFormField
                isRequired
                isError={!!errors.partnerMaxBookingCount}
                label={t(
                  'form.section.settings.field.partnership.partnerMaxBookingCount',
                )}
              >
                <NumericInput
                  disabled={isOfferInGroup}
                  error={!!errors.partnerMaxBookingCount}
                  id="offer-form-partner-max-booking-input"
                  inputClass={clsx(classes.bigWidth, {
                    [classes.disabledInput]: isOfferInGroup,
                  })}
                  name="partnerMaxBookingCount"
                  onChange={handleChange}
                  placeholder="5"
                  size="small"
                  value={partnerMaxBookingCount ?? 0}
                  variant="outlined"
                />
              </OfferFormField>
            </div>
          )}

          <FormControlLabel
            control={
              <Radio
                className={classes.cappingStrategyRadio}
                id="offer-form-spot-capping-per-partner-radio"
              />
            }
            label={
              <>
                <Typography>
                  {t(
                    'form.section.settings.field.partnership.partnerSpotCappingStrategy.PER_PARTNER.label',
                  )}
                </Typography>
                <Typography variant="caption">
                  {t(
                    'form.section.settings.field.partnership.partnerSpotCappingStrategy.PER_PARTNER.helperText',
                  )}
                </Typography>
              </>
            }
            value={PartnerSpotCappingStrategy.PER_PARTNER}
          />

          {partnerSpotCappingStrategy ===
            PartnerSpotCappingStrategy.PER_PARTNER && (
            <Typography className={classes.combinedMaxCount}>
              Coming soon! 🚧
            </Typography>
          )}
        </RadioGroup>
      )}
    </>
  );
};

export default React.memo(OfferPartnershipSettings);
