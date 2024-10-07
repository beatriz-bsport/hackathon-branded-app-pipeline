import React, { useCallback, useMemo } from 'react';

import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Alert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tune from '@material-ui/icons/Tune';
import Typography from '@material-ui/core/Typography';

import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import FormSection from '#src/components/forms/FormSection';
import NumericInput from '#src/components/input/NumericInput.component';
import OfferFormField from '#src/libs/offer/form/OfferFormField.component';

import { useOfferFormStyles } from '#src/libs/offer/hooks';

import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_SPIVI,
  UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
} from '#src/libs/platform-billing/upsell-identifiers';

import type { FeatureList } from '#src/libs/company/types';
import type { OfferFormValues } from '#src/libs/offer/types';
import type { RoomBlueprint } from '#src/libs/spot-scheduling/types';

type Props = {
  allowGuestMaster: boolean;
  hasActivityGroup?: boolean;
  isEditOffer?: boolean;
  isOfferInGroup?: boolean;
  isWorkshop?: boolean;
  roomBlueprints: RoomBlueprint[];
  showPartnership: boolean;
};

const OfferFormSettings: React.FC<Props> = ({
  allowGuestMaster,
  hasActivityGroup,
  isEditOffer,
  isOfferInGroup,
  isWorkshop,
  roomBlueprints,
  showPartnership,
}) => {
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<OfferFormValues>();
  const {
    availableOnPartnership,
    dateIntervalStart,
    durationMinute,
    partnerMaxBookingCount,
  } = values;

  const offerSpreadOnTwoDays = useMemo(() => {
    const datetimeEnd = dateIntervalStart.plus({
      minute: durationMinute,
    });
    return !dateIntervalStart.hasSame(datetimeEnd, 'day');
  }, [dateIntervalStart, durationMinute]);

  const handleToggleManagerOnly = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('isManagerOnly', !event.target.checked);
    },
    [setFieldValue],
  );

  return (
    <FormSection
      id="offer-form-settings-section"
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={Tune}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('form.section.settings.title')}
    >
      <div className={classes.settingsFields}>
        {(!isOfferInGroup || isEditOffer) && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={!values.isManagerOnly}
                  color="secondary"
                  id="offer-form-manager-only-switch"
                  name="isManagerOnly"
                  onChange={handleToggleManagerOnly}
                />
              }
              disabled={isEditOffer && isOfferInGroup}
              label={t('form.section.settings.field.isManagerOnly')}
            />

            {allowGuestMaster && (
              <SwitchField
                id="offer-form-allow-guest-switch"
                label={t('form.section.settings.field.allowGuestOffer')}
                name="allowGuestOffer"
                switchColor="secondary"
              />
            )}

            <FeatureListProvider>
              {(featureList: FeatureList) => (
                <>
                  {hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI) &&
                    roomBlueprints?.find(
                      (roomBlueprint) =>
                        roomBlueprint.id === values.roomBlueprint,
                    )?.spivi_box_id && (
                      <SwitchField
                        disabled={
                          (isEditOffer && isOfferInGroup) || hasActivityGroup
                        }
                        id="offer-form-sync-on-spivi"
                        label={t(
                          'form.section.settings.field.syncOfferOnSpivi',
                        )}
                        name="syncOfferOnSpivi"
                        switchColor="secondary"
                      />
                    )}
                </>
              )}
            </FeatureListProvider>
          </>
        )}
      </div>

      {showPartnership && !isOfferInGroup && (
        <div className={classes.settingsMarketplaceContainer}>
          <Typography className={classes.mediumFontWeight} variant="subtitle1">
            {t('form.section.settings.field.partnership.title')}
          </Typography>

          <FeatureListProvider>
            {(featureList: FeatureList) => {
              const hasUscUpsell = hasUpsell(
                featureList,
                UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
              );

              if (hasUscUpsell && availableOnPartnership && isWorkshop)
                return (
                  <Alert className={classes.centerAlert} severity="warning">
                    {t(
                      'form.section.settings.field.partnership.uscIntegrationWorkshopWarning',
                    )}
                  </Alert>
                );

              return (
                <>
                  {hasUscUpsell &&
                    availableOnPartnership &&
                    offerSpreadOnTwoDays && (
                      <Alert className={classes.centerAlert} severity="warning">
                        {t(
                          'form.section.settings.field.partnership.uscIntegrationWarning',
                        )}
                      </Alert>
                    )}
                </>
              );
            }}
          </FeatureListProvider>

          <SwitchField
            id="offer-form-available-partnership-switch"
            label={t(
              'form.section.settings.field.partnership.availableOnPartnership',
            )}
            name="availableOnPartnership"
            switchColor="secondary"
          />

          {availableOnPartnership && (
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
                inputClass={classNames(classes.mediumWidth, {
                  [classes.disabledInput]: isOfferInGroup,
                })}
                InputProps={{ inputProps: { min: 0 } }}
                name="partnerMaxBookingCount"
                onChange={handleChange}
                placeholder="5"
                size="small"
                value={partnerMaxBookingCount}
                variant="outlined"
              />
            </OfferFormField>
          )}

          <Typography color="error" variant="caption">
            {t(errors.partnerMaxBookingCount)}
          </Typography>
        </div>
      )}
    </FormSection>
  );
};

export default React.memo(OfferFormSettings);
