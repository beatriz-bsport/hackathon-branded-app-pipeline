import React, { useCallback, useMemo, useState } from 'react';

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
import WellhubProductSelector from '#src/libs/wellhub/components/WellhubProductSelector';

import { useOfferFormStyles } from '#src/libs/offer/hooks';

import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_SPIVI,
  UPSELL_IDENTIFIER_WELLHUB,
  UPSELL_URBAN_SPORTS_CLUB_IDENTIFIER,
} from '#src/libs/platform-billing/upsell-identifiers';

import type { Establishment } from '#src/libs/establishment/types';
import type { FeatureList } from '#src/libs/company/types';
import type { OfferFormValues } from '#src/libs/offer/types';
import type { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import type { WellhubProductId } from '#src/libs/wellhub/types';

type Props = {
  allowGuestMaster: boolean;
  availableEstablishments: Establishment[];
  hasActivityGroup?: boolean;
  isEditOffer?: boolean;
  isOfferInGroup?: boolean;
  isWorkshop?: boolean;
  roomBlueprints: RoomBlueprint[];
  showPartnership: boolean;
};

const OfferFormSettings: React.FC<Props> = ({
  allowGuestMaster,
  availableEstablishments,
  hasActivityGroup,
  isEditOffer,
  isOfferInGroup,
  isWorkshop,
  roomBlueprints,
  showPartnership,
}) => {
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');

  const [isWellhubProductRequired, setIsWellhubProductRequired] =
    useState(true);

  const [previousEstablishment, setPreviousEstablishment] = useState<
    number | null
  >(null);

  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<OfferFormValues>();

  const {
    availableOnPartnership,
    dateIntervalStart,
    durationMinute,
    establishment,
    partnerMaxBookingCount,
    wellhubProductId,
  } = values;

  const offerSpreadOnTwoDays = useMemo(() => {
    const datetimeEnd = dateIntervalStart.plus({
      minute: durationMinute,
    });
    return !dateIntervalStart.hasSame(datetimeEnd, 'day');
  }, [dateIntervalStart, durationMinute]);

  const correspondingWellhubGymUuid = useMemo(
    () =>
      (!!establishment &&
        availableEstablishments?.find(
          (availableEstablishment) =>
            availableEstablishment.id === establishment,
        )?.wellhub_gym) ||
      null,
    [availableEstablishments, establishment],
  );

  const handleToggleManagerOnly = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('isManagerOnly', !event.target.checked);
    },
    [setFieldValue],
  );

  const handleSelectWellhubProduct = useCallback(
    (productId: WellhubProductId | null) => {
      productId !== wellhubProductId &&
        setFieldValue('wellhubProductId', productId);
    },
    [setFieldValue, wellhubProductId],
  );

  const setWellhubProductRequired = useCallback(
    (isRequired: boolean) => {
      setIsWellhubProductRequired(isRequired);
      values.isWellhubProductRequired != isRequired &&
        setFieldValue('isWellhubProductRequired', isRequired);
    },
    [values.isWellhubProductRequired, setFieldValue],
  );

  React.useEffect(() => {
    if (establishment != previousEstablishment) {
      setIsWellhubProductRequired(true);
      setPreviousEstablishment(establishment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishment]);

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
          <div>
            <Typography
              className={classes.mediumFontWeight}
              variant="subtitle1"
            >
              {t('form.section.settings.field.partnership.title')}
            </Typography>
            <Typography variant="caption">
              {t('form.section.settings.field.partnership.subtitle')}
            </Typography>
          </div>

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
                'form.section.settings.field.partnership.partnerMaxBookingCount',
              )}
            >
              <NumericInput
                disabled={isOfferInGroup}
                error={!!errors.partnerMaxBookingCount}
                id="offer-form-partner-max-booking-input"
                inputClass={classNames(classes.bigWidth, {
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

          <FeatureListProvider>
            {(featureList: FeatureList) => {
              const hasWellhubUpsell = hasUpsell(
                featureList,
                UPSELL_IDENTIFIER_WELLHUB,
              );

              return (
                isWellhubProductRequired &&
                hasWellhubUpsell &&
                availableOnPartnership &&
                !!correspondingWellhubGymUuid && (
                  <OfferFormField
                    isBold
                    isRequired
                    isError={!!errors.wellhubProductId}
                    label={t(
                      'form.section.settings.field.partnership.wellhubProduct.title',
                    )}
                  >
                    <Typography variant="caption">
                      {t(
                        'form.section.settings.field.partnership.wellhubProduct.helperText',
                      )}
                    </Typography>
                    <WellhubProductSelector
                      id="offer-form-wellhub-product-selector"
                      isVirtualOffer={values.isMetaActivityBroadcast}
                      onSelect={handleSelectWellhubProduct}
                      selectedProductId={wellhubProductId || null}
                      setIsWellhubProductRequired={setWellhubProductRequired}
                      styles={classes.bigWidth}
                      wellhubGymUuid={correspondingWellhubGymUuid}
                    />
                    {!!errors.wellhubProductId &&
                      Object.keys(errors).length === 1 && (
                        <Typography color="error" variant="caption">
                          {t(errors.wellhubProductId)}
                        </Typography>
                      )}
                  </OfferFormField>
                )
              );
            }}
          </FeatureListProvider>

          {!!errors.partnerMaxBookingCount && (
            <Typography color="error" variant="caption">
              {t(errors.partnerMaxBookingCount)}
            </Typography>
          )}
        </div>
      )}
    </FormSection>
  );
};

export default React.memo(OfferFormSettings);
