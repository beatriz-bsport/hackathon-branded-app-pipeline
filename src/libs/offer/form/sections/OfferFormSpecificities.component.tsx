import React, { useCallback, useMemo, useState } from 'react';

import Info from '@material-ui/icons/Info';
import People from '@material-ui/icons/People';
import { useTheme } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import FormSection from '#components/forms/FormSection';
import OfferFormField from '#libs/offer/form/OfferFormField.component';
import useOfferFormStyles from '#libs/offer/hooks/useOfferFormStyles';
import NumericInput from '#components/input/NumericInput.component';
import { LevelSelector } from '#libs/level/components/LevelSelector.component';
import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
import OfferFormSelector from '#libs/offer/form/OfferFormSelector.component';
import SpotSchedulingHelper from '#libs/spot-scheduling/utils';
import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook';
import OfferFormTooltip from '#libs/offer/form/OfferFormTooltip.dialog';
// @ts-expect-error
import MetaActivitySelector from '../../../meta-activity/components/MetaActivitySelector.component';
// @ts-expect-error
import { TextField } from '../../../../components/forms';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';
import { OfferFormValues } from '#libs/offer/types';
import { Level, LevelFilterSet } from '#libs/level/types';
import { Establishment } from '#libs/establishment/types';
import { ZoomApp } from '#libs/zoom-app/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { MetaActivity } from '#libs/meta-activity/types';
import {
  OptionCallback,
  OptionPaginatedCallback,
} from '../../../../state/types';
import { HYBRID_OFFER_DEFAULT_EFFECTIF_FOR_ONLINE_SESSION } from '#libs/offer/constants';
// @ts-ignore
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import { UPSELL_IDENTIFIER_SPIVI } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';
import { FeatureList } from '#libs/company/types';

type Props = {
  activeCustomLevels: Level[];
  allCustomLevels: Level[];
  availableEstablishments: Establishment[];
  isBroadcast: boolean;
  isWherebyIntegrationEnabled: boolean;
  zoomAppDetail: ZoomApp;
  roomBlueprints: RoomBlueprint[];
  isOfferInGroup?: boolean;
  isEditOffer?: boolean;
  metaActivities?: MetaActivity[];
  initialOfferCredits?: number;
  fetchLevelList: (
    params?: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  updateLevel: (
    id: number,
    data: Omit<Level, 'id'>,
    options: OptionCallback<Level>,
  ) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
};

const OfferFormSpecificities = (props: Props) => {
  const [selectedTooltipDialog, setSelectedTooltipDialog] = useState<
    'credit' | 'spotScheduling' | 'broadcastLink' | null
  >(null);
  const { t } = useTranslation('offer');
  const classes = useOfferFormStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    values,
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    getFieldHelpers,
  } = useFormikContext<OfferFormValues>();
  const { zoomAppEnabled } = useFeaturesProvider();
  const {
    effectif,
    waitingListMaxSize,
    credits,
    establishment,
    level,
    selectedMetaActivity,
    is_hybrid,
  } = values;
  const {
    activeCustomLevels,
    allCustomLevels,
    availableEstablishments,
    isBroadcast,
    zoomAppDetail,
    roomBlueprints,
    isWherebyIntegrationEnabled,
    isOfferInGroup,
    isEditOffer,
    metaActivities,
    initialOfferCredits,
    fetchLevelList,
    updateLevel,
    createLevel,
    deleteLevel,
  } = props;

  const selectedEstablishment = useMemo(() => {
    if (establishment && availableEstablishments) {
      return [
        availableEstablishments.find(
          (es: Establishment) => es.id === establishment,
        )?.id,
      ];
    }
    return null;
  }, [availableEstablishments, establishment]);

  const handleSelectEstablishment = useCallback(
    (newEstablishment: { label: string; value: number }) => {
      setFieldValue('establishment', newEstablishment.value);
    },
    [setFieldValue],
  );

  const getAvailableRoomBlueprints = useCallback(() => {
    if (roomBlueprints?.length) {
      const mapBlueprintsToOptions = (blueprint: RoomBlueprint) => {
        const spotCount = SpotSchedulingHelper.getSpotCount(blueprint);
        return {
          label: `(${spotCount}) ${blueprint.name}`,
          value: blueprint.id,
        };
      };
      return [...roomBlueprints]
        ?.filter((blueprint) => blueprint.establishment === establishment)
        .map(mapBlueprintsToOptions);
    }

    return [];
  }, [establishment, roomBlueprints]);

  const handleSelectLevel = useCallback(
    (newLevel: number) => setFieldValue('level', newLevel),
    [setFieldValue],
  );

  const handleSetRoomBlueprintSpot = useCallback(
    (hasSpiviUpsell: boolean) => (blueprintId: number) => {
      const helpers = getFieldHelpers('roomBlueprint');
      helpers.setTouched(true);
      const blueprint = roomBlueprints.find(
        (roomBlueprint) => roomBlueprint.id === blueprintId,
      );
      const spotCount = SpotSchedulingHelper.getSpotCount(blueprint);
      setFieldValue('roomBlueprintSlots', spotCount);

      if (!isOfferInGroup && !touched.syncOfferOnSpivi) {
        if (blueprint?.spivi_box_id && hasSpiviUpsell) {
          setFieldValue('syncOfferOnSpivi', true);
        }
        if (blueprint === null || !blueprint?.spivi_box_id) {
          setFieldValue('syncOfferOnSpivi', false);
        }
      }
    },
    [
      roomBlueprints,
      setFieldValue,
      getFieldHelpers,
      isOfferInGroup,
      touched.syncOfferOnSpivi,
    ],
  );

  const handleDisplaySpotSchedulingTooltip = useCallback(() => {
    isMobile && setSelectedTooltipDialog('spotScheduling');
  }, [isMobile]);

  const handleDisplayCreditTooltip = useCallback(() => {
    isMobile && setSelectedTooltipDialog('credit');
  }, [isMobile]);

  const handleDisplayBroadcastLinkTooltip = useCallback(() => {
    isMobile && setSelectedTooltipDialog('broadcastLink');
  }, [isMobile]);

  const handleCloseTooltipDialog = useCallback(
    () => setSelectedTooltipDialog(null),
    [],
  );

  const handleSelectMetaActivity = useCallback(
    ({ value }: { value: number }) => {
      setFieldValue('selectedMetaActivity', value);
    },
    [setFieldValue],
  );

  return (
    <FormSection
      id="offer-form-specificities-section"
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={People}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('form.section.specificities.title')}
    >
      {isEditOffer && (
        <MetaActivitySelector
          closeMenuOnSelect
          noMulti
          controlBackground={isOfferInGroup && '#F2F2F2'}
          disabled={isOfferInGroup || is_hybrid}
          id="offer-form-edit-meta-activity-selector"
          metaActivities={metaActivities ?? []}
          selectedMetaActivities={
            selectedMetaActivity ? [selectedMetaActivity] : undefined
          }
          selectOption={handleSelectMetaActivity}
        />
      )}

      <div className={classes.formFieldColumns}>
        <OfferFormField
          isRequired
          id="offer-form-effectif-field"
          isError={
            !!errors.effectif && (touched.effectif || touched.roomBlueprint)
          }
          label={t('form.section.specificities.field.effectif')}
        >
          <div className={classes.errorContainer}>
            <NumericInput
              error={
                !!errors.effectif && (touched.effectif || touched.roomBlueprint)
              }
              id="offer-form-effectif-input"
              inputClass={classes.mediumWidth}
              InputProps={{ inputProps: { min: 0 } }}
              name="effectif"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="20"
              size="small"
              value={effectif}
              variant="outlined"
            />

            {!!errors.effectif &&
              (touched.effectif || touched.roomBlueprint) && (
                <div>
                  <Typography color="error" variant="caption">
                    {t(errors.effectif)}
                  </Typography>
                </div>
              )}
          </div>
        </OfferFormField>

        <OfferFormField
          isRequired
          isError={!!errors.waitingListMaxSize && touched.waitingListMaxSize}
          label={t('form.section.specificities.field.waitingListMaxSize')}
        >
          <NumericInput
            disabled={isOfferInGroup}
            error={!!errors.waitingListMaxSize && touched.waitingListMaxSize}
            helperText={
              !!errors.waitingListMaxSize &&
              touched.waitingListMaxSize &&
              t(errors.waitingListMaxSize)
            }
            id="offer-form-waiting-list-input"
            inputClass={classNames(classes.mediumWidth, {
              [classes.disabledInput]: isOfferInGroup,
            })}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            name="waitingListMaxSize"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="20"
            size="small"
            value={waitingListMaxSize}
            variant="outlined"
          />
        </OfferFormField>
      </div>

      <OfferFormField
        isRequired
        id="offer-form-level-field"
        label={t('form.section.specificities.field.level')}
      >
        <LevelSelector
          inScrollBar
          noLabel
          buttonContainerStyle={classes.levelSelectorAdd}
          containerStyle={classes.levelSelector}
          customLevels={activeCustomLevels}
          error={!!errors.level}
          fetchLevelList={fetchLevelList}
          id="offer-form-level-selector"
          isDisabled={isOfferInGroup || (is_hybrid && isBroadcast)}
          memoryLevels={allCustomLevels}
          name="level"
          onCreateLevel={createLevel}
          onDeleteLevel={deleteLevel}
          onEditLevel={updateLevel}
          onSelect={handleSelectLevel}
          selectedLevel={level}
          selectorClass={classNames({ [classes.bigWidth]: !isMobile })}
        />
      </OfferFormField>

      <OfferFormField
        isRequired
        id="offer-form-establishment-field"
        isError={!!errors.establishment}
        label={t('form.section.specificities.field.establishment')}
      >
        <div className={classes.errorContainer}>
          <EstablishmentSelector
            closeMenuOnSelect
            hideError
            isRequired
            noMulti
            establishments={availableEstablishments}
            id="offer-form-establishment-selector"
            name="establishment"
            onBlur={handleBlur}
            placeholder={t('establishment:search')}
            requiredValueIsMissing={
              !!errors.establishment && touched.establishment
            }
            selectedEstablishments={selectedEstablishment}
            selectOption={handleSelectEstablishment}
            selectorClass={classes.bigWidth}
          />

          {!!errors.establishment && touched.establishment && (
            <Typography color="error" variant="caption">
              {t(errors.establishment)}
            </Typography>
          )}
        </div>
      </OfferFormField>

      {establishment && !!getAvailableRoomBlueprints().length && (
        <OfferFormField
          id="offer-form-spot-scheduling-field"
          label={t('form.section.specificities.field.roomBlueprint.title')}
        >
          <div
            className={classes.stretchSelf}
            id="offer-form-spot-scheduling-field-container"
          >
            <FeatureListProvider>
              {(featureList: FeatureList) => (
                <OfferFormSelector
                  isClearable
                  className={classes.bigWidth}
                  id="offer-form-blueprint-selector"
                  isError={!!errors.roomBlueprint}
                  name="roomBlueprint"
                  onSelectedOption={handleSetRoomBlueprintSpot(
                    hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI),
                  )}
                  options={getAvailableRoomBlueprints()}
                  placeholder={t(
                    'form.section.specificities.field.roomBlueprint.placeholder',
                  )}
                />
              )}
            </FeatureListProvider>

            <Tooltip
              className={classes.tooltip}
              onClick={handleDisplaySpotSchedulingTooltip}
              title={t('form.section.specificities.tooltip.roomBlueprint')}
            >
              <Info />
            </Tooltip>
          </div>

          <OfferFormTooltip
            isOpen={selectedTooltipDialog === 'spotScheduling'}
            onClose={handleCloseTooltipDialog}
          >
            {t('form.section.specificities.tooltip.roomBlueprint')}
          </OfferFormTooltip>
        </OfferFormField>
      )}

      <OfferFormField
        isRequired
        id="offer-form-credits-field"
        isError={!!errors.credits && touched.credits}
        label={t('form.section.specificities.field.credits')}
      >
        <div className={classes.fieldWithTooltip}>
          <NumericInput
            error={!!errors.credits && touched.credits}
            helperText={
              !!errors.credits && touched.credits && t(errors.credits)
            }
            id="offer-form-credits-input"
            inputClass={classes.mediumWidth}
            InputProps={{ inputProps: { min: 0 } }}
            name="credits"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="1"
            size="small"
            value={credits}
            variant="outlined"
          />

          <Tooltip
            className={classes.tooltip}
            onClick={handleDisplayCreditTooltip}
            title={t('form.section.specificities.tooltip.credits')}
          >
            <Info />
          </Tooltip>

          <OfferFormTooltip
            isOpen={selectedTooltipDialog === 'credit'}
            onClose={handleCloseTooltipDialog}
          >
            {t('form.section.specificities.tooltip.credits')}
          </OfferFormTooltip>
        </div>
      </OfferFormField>

      {(credits === 0 || credits > 5) && (
        <Alert severity="warning">{t('form.warnings.effectif')}</Alert>
      )}

      {isEditOffer && credits > initialOfferCredits && (
        <Alert severity="warning">
          {t('form.warnings.editOfferInitialCredits')}
        </Alert>
      )}

      {!isBroadcast && !isEditOffer && !isOfferInGroup && (
        <OfferFormField
          id="offer-form-broadcast-link-field"
          label={t('form.section.specificities.field.hybridSection')}
        >
          <SwitchField
            id="offer-form-available-partnership-switch"
            label={t('form.section.specificities.field.hybridLabel')}
            name="is_hybrid"
            switchColor="secondary"
          />
          {is_hybrid && (
            <Alert className={classes.centerAlert} severity="info">
              {t('form.section.specificities.field.hybridHelper', {
                onlineOfferDefaultEffectif:
                  HYBRID_OFFER_DEFAULT_EFFECTIF_FOR_ONLINE_SESSION,
              })}
            </Alert>
          )}
        </OfferFormField>
      )}
      {isBroadcast && !isWherebyIntegrationEnabled && (
        <OfferFormField
          id="offer-form-broadcast-link-field"
          isError={!!errors.broadcastLink}
          label={t('form.section.specificities.field.broadcastLink')}
        >
          <div className={classes.fieldWithTooltip}>
            <TextField
              className={classNames(classes.bigWidth, {
                [classes.disabledInput]:
                  zoomAppEnabled && !zoomAppDetail?.is_disabled,
              })}
              disabled={zoomAppEnabled && !zoomAppDetail?.is_disabled}
              error={!!errors.broadcastLink && touched.broadcastLink}
              id="offer-form-broadcast-link-input"
              name="broadcastLink"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="https://zoom.us/123456789"
              size="small"
              variant="outlined"
            />

            {zoomAppEnabled && !zoomAppDetail?.is_disabled && (
              <>
                <Tooltip
                  className={classes.tooltip}
                  onClick={handleDisplayBroadcastLinkTooltip}
                  title={t('form.section.specificities.tooltip.broadcastLink')}
                >
                  <Info />
                </Tooltip>

                <OfferFormTooltip
                  isOpen={selectedTooltipDialog === 'broadcastLink'}
                  onClose={handleCloseTooltipDialog}
                >
                  {t('form.section.specificities.tooltip.broadcastLink')}
                </OfferFormTooltip>
              </>
            )}
          </div>
        </OfferFormField>
      )}

      {!!errors.broadcastLink && (
        <Typography color="error" variant="caption">
          {t(errors.broadcastLink)}
        </Typography>
      )}
    </FormSection>
  );
};

export default OfferFormSpecificities;
