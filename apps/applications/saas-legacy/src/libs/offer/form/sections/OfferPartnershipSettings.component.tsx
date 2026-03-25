import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FormikErrors, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import NumericInput from '#src/components/input/NumericInput.component';
import OfferFormField from '#src/libs/offer/form/OfferFormField.component';
import PartnershipOfferChip from '#src/libs/offer/form/sections/PartnershipOfferChip.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

import { useOfferFormStyles } from '#src/libs/offer/hooks';

import {
  OfferFormValues,
  PartnershipOffer,
  PartnerSpotCappingStrategy,
} from '#src/libs/offer/types';
import { useGetActivePartnershipAccountForOffer } from '#src/libs/partnership/hooks';
import withStyles from '@material-ui/core/styles/withStyles';

// Assuming a default of 20% of the effectif
const DEFAULT_SPOT_LIMIT_RATIO = 0.2;
// We keep a 6 spots default in case the effectif is not filled yet
const DEFAULT_SPOT_LIMIT = 6;

type Props = {
  isEditOffer?: boolean;
  isOfferInGroup?: boolean;
};

const CustomTableCell = React.memo(
  withStyles(() => ({
    root: {
      borderBottom: 'none',
      padding: 0,
    },
  }))(TableCell),
);

const OfferPartnershipSettings: React.FC<Props> = ({
  isEditOffer,
  isOfferInGroup,
}) => {
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const isDraftPartnershipOffersEnabled = useSafeFlag(
    FeatureFlags.BOOKING_DRAFT_PARTNERSHIP_OFFERS,
  );
  const [
    {
      loading: activePartnershipAccountsLoading,
      value: activePartnershipAccounts,
    },
    fetchActivePartnershipAccountForOffer,
  ] = useGetActivePartnershipAccountForOffer();

  const [defaultSpotLimit, setDefaultSpotLimit] =
    useState<number>(DEFAULT_SPOT_LIMIT);
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<OfferFormValues>();
  const partnershipOffersErrors = errors.partnershipOffers as
    | FormikErrors<PartnershipOffer>[]
    | undefined;

  const {
    dateIntervalStart,
    establishment,
    isManagerOnly,
    effectif,
    availableOnPartnership,
    partnerMaxBookingCount,
    partnerSpotCappingStrategy,
    partnershipOffers,
  } = values;

  const partnershipOffersMap = useMemo(
    () =>
      new Map(
        partnershipOffers.map((po, formikIndex) => [
          po.partnership,
          { po, formikIndex },
        ]),
      ),
    [partnershipOffers],
  );

  useEffect(() => {
    if (dateIntervalStart && establishment) {
      fetchActivePartnershipAccountForOffer(establishment, dateIntervalStart);
    }
  }, [dateIntervalStart, establishment, fetchActivePartnershipAccountForOffer]);

  useEffect(() => {
    if (!!effectif) {
      setDefaultSpotLimit(Math.floor(DEFAULT_SPOT_LIMIT_RATIO * effectif));
    }
  }, [effectif]);

  useEffect(() => {
    if (!activePartnershipAccounts) return;
    const syncedPartnershipOffers = activePartnershipAccounts.map((account) => {
      const existingPartnershipOffer = partnershipOffers.find(
        (po) => po.partnership === account.partnership,
      );
      const base: PartnershipOffer = existingPartnershipOffer ?? {
        partnership: account.partnership,
        partnership_identifier: account.partnership_identifier,
        status: '',
        allowed_on_partner: !isEditOffer, // Allowed by default on create only
        spot_limit: null,
      };
      return {
        ...base,
        spot_limit: base.spot_limit ?? defaultSpotLimit,
      };
    });
    setFieldValue('partnershipOffers', syncedPartnershipOffers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartnershipAccounts]);

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
              disabled={isOfferInGroup || isManagerOnly}
              error={!!errors.partnerMaxBookingCount}
              id="offer-form-partner-max-booking-input"
              inputClass={clsx(classes.bigWidth, {
                [classes.disabledInput]: isOfferInGroup || isManagerOnly,
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
        <>
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
          </RadioGroup>
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
                  disabled={isOfferInGroup || isManagerOnly}
                  error={!!errors.partnerMaxBookingCount}
                  id="offer-form-partner-max-booking-input"
                  inputClass={clsx(classes.bigWidth, {
                    [classes.disabledInput]: isOfferInGroup || isManagerOnly,
                  })}
                  name="partnerMaxBookingCount"
                  onChange={handleChange}
                  placeholder="5"
                  size="small"
                  value={partnerMaxBookingCount ?? defaultSpotLimit}
                  variant="outlined"
                />
              </OfferFormField>
            </div>
          )}
          {partnerSpotCappingStrategy ===
          PartnerSpotCappingStrategy.PER_PARTNER ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {t(
                      'form.section.settings.field.partnership.aggregatorLabel',
                    )}
                  </TableCell>
                  <TableCell>
                    {t('form.section.settings.field.partnership.spots')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activePartnershipAccountsLoading && (
                  <TableRow>
                    <CustomTableCell colSpan={3}>
                      <LinearProgress />
                    </CustomTableCell>
                  </TableRow>
                )}
                {activePartnershipAccounts &&
                  activePartnershipAccounts.map((partnershipAccount) => {
                    const partnershipOffer = partnershipOffersMap.get(
                      partnershipAccount.partnership,
                    );
                    const formikIndex = partnershipOffer?.formikIndex ?? -1;
                    const po = partnershipOffer?.po;
                    return (
                      <TableRow key={partnershipAccount.id}>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={po?.allowed_on_partner ?? false}
                                color="secondary"
                                onChange={() =>
                                  setFieldValue(
                                    `partnershipOffers.${formikIndex}.allowed_on_partner`,
                                    !(po?.allowed_on_partner ?? false),
                                  )
                                }
                              />
                            }
                            label={t(
                              `form.section.settings.field.partnership.name.${partnershipAccount.partnership_identifier}`,
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <NumericInput
                            disabled={!(po?.allowed_on_partner ?? false)}
                            error={
                              !!partnershipOffersErrors?.[formikIndex]
                                ?.spot_limit
                            }
                            id={`offer-form-partner-spot-limit-input-${formikIndex}`}
                            inputClass={classes.bigWidth}
                            name={`partnershipOffers.${formikIndex}.spot_limit`}
                            onChange={handleChange}
                            placeholder={String(DEFAULT_SPOT_LIMIT)}
                            size="small"
                            value={po?.spot_limit ?? defaultSpotLimit}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <>
              {activePartnershipAccountsLoading && (
                <LinearProgress style={{ width: '100%' }} />
              )}
              {activePartnershipAccounts && (
                <div className={classes.enabledAggregators}>
                  <Typography className={classes.aggregatorsLabel}>
                    {t(
                      'form.section.settings.field.partnership.enabledAggregators',
                    )}
                  </Typography>
                  <div className={classes.partnershipChipsContainer}>
                    {activePartnershipAccounts.map((partnershipAccount) => {
                      const partnershipOffer = partnershipOffersMap.get(
                        partnershipAccount.partnership,
                      );
                      const formikIndex = partnershipOffer?.formikIndex ?? -1;
                      const po = partnershipOffer?.po;
                      return (
                        <PartnershipOfferChip
                          key={partnershipAccount.id}
                          enabled={po?.allowed_on_partner ?? true}
                          label={t(
                            `form.section.settings.field.partnership.name.${partnershipAccount.partnership_identifier}`,
                          )}
                          onChange={(enabled: boolean) =>
                            setFieldValue(
                              `partnershipOffers.${formikIndex}.allowed_on_partner`,
                              enabled,
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(OfferPartnershipSettings);
