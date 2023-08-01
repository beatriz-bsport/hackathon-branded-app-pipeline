import React, { useCallback } from 'react';

import Tune from '@material-ui/icons/Tune';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import FormSection from '#components/forms/FormSection';
import { useOfferFormStyles } from '#libs/offer/hooks';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';
import OfferFormField from '#libs/offer/form/OfferFormField.component';
import NumericInput from '#components/input/NumericInput.component';

import { OfferFormValues } from '#libs/offer/types';
// @ts-ignore
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc.js';
import { UPSELL_IDENTIFIER_SPIVI } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';
import { FeatureList } from '#libs/company/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';

type Props = {
  allowGuestMaster: boolean;
  showPartnership: boolean;
  isOfferInGroup?: boolean;
  isEditOffer?: boolean;
  roomBlueprints: RoomBlueprint[];
  hasActivityGroup?: boolean;
};

const OfferFormSettings = (props: Props) => {
  const {
    allowGuestMaster,
    showPartnership,
    isOfferInGroup,
    isEditOffer,
    roomBlueprints,
    hasActivityGroup,
  } = props;
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
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

export default OfferFormSettings;
