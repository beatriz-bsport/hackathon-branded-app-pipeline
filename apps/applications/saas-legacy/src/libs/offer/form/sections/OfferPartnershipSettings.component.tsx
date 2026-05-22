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
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
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
import { FeatureList } from '#src/libs/company/types';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_CLASSPASS,
  UPSELL_IDENTIFIER_WELLPASS,
} from '#src/libs/platform-billing/upsell-identifiers';

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

  const hasLoadedActivePartnershipAccounts =
    activePartnershipAccounts !== undefined;
  const activePartnershipAccountsCount = activePartnershipAccounts?.length ?? 0;
  const hasActivePartnershipAccounts = activePartnershipAccountsCount > 0;
  const hasSingleActivePartnershipAccount =
    activePartnershipAccountsCount === 1;
  const shouldShowPerPartnerStrategy =
    hasLoadedActivePartnershipAccounts && activePartnershipAccountsCount > 1;

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

  const partnerMaxBookingCountRef = React.useRef(partnerMaxBookingCount);
  partnerMaxBookingCountRef.current = partnerMaxBookingCount;

  useEffect(() => {
    if (effectif) {
      const newLimit = Math.floor(DEFAULT_SPOT_LIMIT_RATIO * effectif);
      setDefaultSpotLimit(newLimit);
      if (!isEditOffer) {
        setFieldValue('partnerMaxBookingCount', newLimit);
      }
    }
  }, [effectif, isEditOffer, setFieldValue]);

  useEffect(() => {
    if (
      !hasLoadedActivePartnershipAccounts ||
      partnerSpotCappingStrategy !== PartnerSpotCappingStrategy.COMBINED ||
      (partnerMaxBookingCount ?? 0) > 0
    ) {
      return;
    }

    const nextPartnerMaxBookingCount = isOfferInGroup ? 0 : defaultSpotLimit;

    if (partnerMaxBookingCount === nextPartnerMaxBookingCount) {
      return;
    }

    setFieldValue('partnerMaxBookingCount', nextPartnerMaxBookingCount);
  }, [
    defaultSpotLimit,
    hasLoadedActivePartnershipAccounts,
    isOfferInGroup,
    partnerMaxBookingCount,
    partnerSpotCappingStrategy,
    setFieldValue,
  ]);

  useEffect(() => {
    if (!activePartnershipAccounts) return;

    const currentMax = partnerMaxBookingCountRef.current;
    if (currentMax != null && effectif && currentMax > effectif) {
      setFieldValue('partnerMaxBookingCount', effectif);
    }

    const syncedPartnershipOffers = activePartnershipAccounts.map((account) => {
      const perPartnerDefault = Math.max(
        1,
        Math.floor(defaultSpotLimit / activePartnershipAccounts.length),
      );

      const existingPartnershipOffer = partnershipOffers.find(
        (po) => po.partnership === account.partnership,
      );
      const base: PartnershipOffer = existingPartnershipOffer ?? {
        partnership: account.partnership,
        partnership_identifier: account.partnership_identifier,
        status: '',
        allowed_on_partner: true,
        spot_limit: null,
      };
      return {
        ...base,
        spot_limit: base.spot_limit ?? perPartnerDefault,
      };
    });
    setFieldValue('partnershipOffers', syncedPartnershipOffers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartnershipAccounts, defaultSpotLimit, effectif]);

  useEffect(() => {
    if (
      !hasLoadedActivePartnershipAccounts ||
      shouldShowPerPartnerStrategy ||
      partnerSpotCappingStrategy !== PartnerSpotCappingStrategy.PER_PARTNER
    ) {
      return;
    }

    setFieldValue(
      'partnerSpotCappingStrategy',
      PartnerSpotCappingStrategy.COMBINED,
    );
  }, [
    hasLoadedActivePartnershipAccounts,
    partnerSpotCappingStrategy,
    setFieldValue,
    shouldShowPerPartnerStrategy,
  ]);

  const handleChangeSpotCappingStrategy = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(
        'partnerSpotCappingStrategy',
        event.target.value as PartnerSpotCappingStrategy,
      );
    },
    [setFieldValue],
  );

  // TODO(BOO-2812): Remove Wellpass once migrated
  const shouldDisplayWellpassSeparately = !useSafeFlag(
    FeatureFlags.BOOKING_ACTIVATE_NEW_WELLPASS_CONFIGURATION,
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
        <div className={classes.aggregatorSettingsContainer}>
          {hasActivePartnershipAccounts && (
            <>
              <RadioGroup
                aria-label={t(
                  'form.section.settings.field.partnership.partnerSpotCappingStrategy.label',
                )}
                className={classes.cappingStrategyRadioGroup}
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
                          hasSingleActivePartnershipAccount
                            ? 'form.section.settings.field.partnership.partnerSpotCappingStrategy.UNLIMITED.singleAggregatorHelperText'
                            : 'form.section.settings.field.partnership.partnerSpotCappingStrategy.UNLIMITED.helperText',
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
                          hasSingleActivePartnershipAccount
                            ? 'form.section.settings.field.partnership.partnerSpotCappingStrategy.COMBINED.singleAggregatorLabel'
                            : 'form.section.settings.field.partnership.partnerSpotCappingStrategy.COMBINED.label',
                        )}
                      </Typography>
                      <Typography variant="caption">
                        {t(
                          hasSingleActivePartnershipAccount
                            ? 'form.section.settings.field.partnership.partnerSpotCappingStrategy.COMBINED.singleAggregatorHelperText'
                            : 'form.section.settings.field.partnership.partnerSpotCappingStrategy.COMBINED.helperText',
                        )}
                      </Typography>
                    </>
                  }
                  value={PartnerSpotCappingStrategy.COMBINED}
                />
                {shouldShowPerPartnerStrategy && (
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
                )}
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
                        [classes.disabledInput]:
                          isOfferInGroup || isManagerOnly,
                      })}
                      name="partnerMaxBookingCount"
                      onChange={handleChange}
                      placeholder="5"
                      size="small"
                      value={partnerMaxBookingCount ?? defaultSpotLimit}
                      variant="outlined"
                    />
                    <Typography variant="caption">
                      {t(
                        'form.section.settings.field.partnership.partnerMaxBookingCountHelperText',
                      )}
                    </Typography>
                  </OfferFormField>
                </div>
              )}
            </>
          )}
          {partnerSpotCappingStrategy ===
            PartnerSpotCappingStrategy.PER_PARTNER &&
          shouldShowPerPartnerStrategy &&
          activePartnershipAccounts ? (
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
                {activePartnershipAccounts.map((partnershipAccount) => {
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
                            !!partnershipOffersErrors?.[formikIndex]?.spot_limit
                          }
                          helperText={
                            partnershipOffersErrors?.[formikIndex]?.spot_limit
                              ? t(
                                  partnershipOffersErrors[formikIndex]
                                    ?.spot_limit as string,
                                )
                              : undefined
                          }
                          id={`offer-form-partner-spot-limit-input-${formikIndex}`}
                          inputClass={classes.bigWidth}
                          name={`partnershipOffers.${formikIndex}.spot_limit`}
                          onChange={handleChange}
                          placeholder={String(DEFAULT_SPOT_LIMIT)}
                          size="small"
                          value={po?.spot_limit ?? 0}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                <FeatureListProvider>
                  {(featureList: FeatureList) => (
                    <>
                      {hasUpsell(featureList, UPSELL_IDENTIFIER_CLASSPASS) && (
                        <TableRow key="classpass">
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch checked disabled color="secondary" />
                              }
                              label={t(
                                `form.section.settings.field.partnership.name.classpass`,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography className={classes.disabledHelperText}>
                              {t(
                                'form.section.settings.field.partnership.tooltip.classpass',
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {shouldDisplayWellpassSeparately &&
                        hasUpsell(featureList, UPSELL_IDENTIFIER_WELLPASS) && (
                          <TableRow key="wellpass">
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Switch checked disabled color="secondary" />
                                }
                                label={t(
                                  `form.section.settings.field.partnership.name.wellpass`,
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                className={classes.disabledHelperText}
                              >
                                {t(
                                  'form.section.settings.field.partnership.tooltip.wellpass',
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                    </>
                  )}
                </FeatureListProvider>
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
                    <FeatureListProvider>
                      {(featureList: FeatureList) => (
                        <>
                          {hasUpsell(
                            featureList,
                            UPSELL_IDENTIFIER_CLASSPASS,
                          ) && (
                            <PartnershipOfferChip
                              key="classpass"
                              disabled
                              enabled
                              label={t(
                                'form.section.settings.field.partnership.name.classpass',
                              )}
                              onChange={() => {}}
                              tooltipTitle={
                                <Typography>
                                  {t(
                                    'form.section.settings.field.partnership.tooltip.classpass',
                                  )}
                                </Typography>
                              }
                            />
                          )}
                          {shouldDisplayWellpassSeparately &&
                            hasUpsell(
                              featureList,
                              UPSELL_IDENTIFIER_WELLPASS,
                            ) && (
                              <PartnershipOfferChip
                                key="wellpass"
                                disabled
                                enabled
                                label={t(
                                  'form.section.settings.field.partnership.name.wellpass',
                                )}
                                onChange={() => {}}
                                tooltipTitle={
                                  <Typography>
                                    {t(
                                      'form.section.settings.field.partnership.tooltip.wellpass',
                                    )}
                                  </Typography>
                                }
                              />
                            )}
                        </>
                      )}
                    </FeatureListProvider>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(OfferPartnershipSettings);
