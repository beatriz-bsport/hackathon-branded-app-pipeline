// @ts-nocheck
import React, { useCallback, useMemo, useState } from 'react';

import Info from '@material-ui/icons/Info';
import People from '@material-ui/icons/People';
import { useTheme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
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
import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook ';
import OfferFormTooltip from '#libs/offer/form/OfferFormTooltip.dialog';
import MetaActivitySelector from '../../../meta-activity/components/MetaActivitySelector.component';

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
import { OFFER_BROADCAST_LINK_MISSING } from '#libs/offer/constants';

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
  const { values, touched, errors, setFieldValue, handleChange, handleBlur } =
    useFormikContext<OfferFormValues>();
  const { zoomAppEnabled } = useFeaturesProvider();
  const {
    effectif,
    waitingListMaxSize,
    credits,
    establishment,
    level,
    selectedMetaActivity,
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

  const isBroadcastErrorRequired = useMemo(
    () => errors.broadcastLink === OFFER_BROADCAST_LINK_MISSING,
    [errors.broadcastLink],
  );

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
    (blueprintId: number) => {
      const blueprint = roomBlueprints.find(
        (roomBlueprint) => roomBlueprint.id === blueprintId,
      );
      const spotCount = SpotSchedulingHelper.getSpotCount(blueprint);
      setFieldValue('roomBlueprintSlots', spotCount);
    },
    [roomBlueprints, setFieldValue],
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
      sectionTitle={t('form.section.specificities.title')}
      sectionIcon={People}
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      {isEditOffer && (
        <MetaActivitySelector
          id="offer-form-edit-meta-activity-selector"
          metaActivities={metaActivities ?? []}
          closeMenuOnSelect
          selectedMetaActivities={
            selectedMetaActivity ? [selectedMetaActivity] : undefined
          }
          noMulti
          selectOption={handleSelectMetaActivity}
          controlBackground={isOfferInGroup && '#F2F2F2'}
          disabled={isOfferInGroup}
        />
      )}

      <div className={classes.formFieldColumns}>
        <OfferFormField
          id="offer-form-effectif-field"
          label={t('form.section.specificities.field.effectif')}
          isRequired
          isError={!!errors.effectif && touched.effectif}
        >
          <div className={classes.errorContainer}>
            <NumericInput
              id="offer-form-effectif-input"
              name="effectif"
              value={effectif}
              onChange={handleChange}
              error={!!errors.effectif && touched.effectif}
              variant="outlined"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              placeholder="20"
              inputClass={classes.mediumWidth}
              onBlur={handleBlur}
            />

            {!!errors.effectif && touched.effectif && (
              <div>
                <Typography variant="caption" color="error">
                  {t(errors.effectif)}
                </Typography>
              </div>
            )}
          </div>
        </OfferFormField>

        <OfferFormField
          label={t('form.section.specificities.field.waitingListMaxSize')}
          isRequired
          isError={!!errors.waitingListMaxSize && touched.waitingListMaxSize}
        >
          <NumericInput
            id="offer-form-waiting-list-input"
            name="waitingListMaxSize"
            value={waitingListMaxSize}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.waitingListMaxSize && touched.waitingListMaxSize}
            helperText={
              !!errors.waitingListMaxSize &&
              touched.waitingListMaxSize &&
              t(errors.waitingListMaxSize)
            }
            variant="outlined"
            size="small"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            placeholder="20"
            inputClass={classNames(classes.mediumWidth, {
              [classes.disabledInput]: isOfferInGroup,
            })}
            disabled={isOfferInGroup}
          />
        </OfferFormField>
      </div>

      <OfferFormField
        id="offer-form-level-field"
        label={t('form.section.specificities.field.level')}
        isRequired
        isFlexColumn={isMobile}
      >
        <LevelSelector
          id="offer-form-level-selector"
          name="level"
          noLabel
          inScrollBar
          selectedLevel={level}
          onSelect={handleSelectLevel}
          customLevels={activeCustomLevels}
          memoryLevels={allCustomLevels}
          fetchLevelList={fetchLevelList}
          onEditLevel={updateLevel}
          onCreateLevel={createLevel}
          onDeleteLevel={deleteLevel}
          selectorClass={classNames({ [classes.bigWidth]: !isMobile })}
          containerStyle={classes.levelSelector}
          buttonContainerStyle={classes.levelSelectorAdd}
          error={!!errors.level}
          isDisabled={isOfferInGroup}
        />
      </OfferFormField>

      <OfferFormField
        id="offer-form-establishment-field"
        label={t('form.section.specificities.field.establishment')}
        isRequired
        isError={!!errors.establishment}
        isFlexColumn={isMobile}
      >
        <div className={classes.errorContainer}>
          <EstablishmentSelector
            id="offer-form-establishment-selector"
            name="establishment"
            noMulti
            selectedEstablishments={selectedEstablishment}
            closeMenuOnSelect
            establishments={availableEstablishments}
            selectOption={handleSelectEstablishment}
            placeholder={t('establishment:search')}
            selectorClass={classes.bigWidth}
            isRequired
            requiredValueIsMissing={
              !!errors.establishment && touched.establishment
            }
            hideError
            onBlur={handleBlur}
          />

          {!!errors.establishment && touched.establishment && (
            <Typography variant="caption" color="error">
              {t(errors.establishment)}
            </Typography>
          )}
        </div>
      </OfferFormField>

      {establishment && !!getAvailableRoomBlueprints().length && (
        <OfferFormField
          id="offer-form-spot-scheduling-field"
          label={t('form.section.specificities.field.roomBlueprint.title')}
          isFlexColumn={isMobile}
        >
          <div
            id="offer-form-spot-scheduling-field-container"
            className={classes.stretchSelf}
          >
            <OfferFormSelector
              id="offer-form-blueprint-selector"
              name="roomBlueprint"
              options={getAvailableRoomBlueprints()}
              className={classes.bigWidth}
              placeholder={t(
                'form.section.specificities.field.roomBlueprint.placeholder',
              )}
              onSelectedOption={handleSetRoomBlueprintSpot}
              isClearable
            />

            <Tooltip
              title={t('form.section.specificities.tooltip.roomBlueprint')}
              className={classes.tooltip}
              onClick={handleDisplaySpotSchedulingTooltip}
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
        id="offer-form-credits-field"
        label={t('form.section.specificities.field.credits')}
        isRequired
        isError={!!errors.credits && touched.credits}
      >
        <NumericInput
          id="offer-form-credits-input"
          name="credits"
          value={credits}
          onChange={handleChange}
          error={!!errors.credits && touched.credits}
          helperText={!!errors.credits && touched.credits && t(errors.credits)}
          variant="outlined"
          size="small"
          InputProps={{ inputProps: { min: 0 } }}
          placeholder="1"
          inputClass={classes.mediumWidth}
          onBlur={handleBlur}
        />

        <Tooltip
          title={t('form.section.specificities.tooltip.credits')}
          className={classes.tooltip}
          onClick={handleDisplayCreditTooltip}
        >
          <Info />
        </Tooltip>

        <OfferFormTooltip
          isOpen={selectedTooltipDialog === 'credit'}
          onClose={handleCloseTooltipDialog}
        >
          {t('form.section.specificities.tooltip.credits')}
        </OfferFormTooltip>
      </OfferFormField>

      {(credits === 0 || credits > 5) && (
        <Alert severity="warning">{t('form.warnings.effectif')}</Alert>
      )}

      {isEditOffer && credits > initialOfferCredits && (
        <Alert severity="warning">
          {t('form.warnings.editOfferInitialCredits')}
        </Alert>
      )}

      {isBroadcast && !isWherebyIntegrationEnabled && (
        <OfferFormField
          id="offer-form-broadcast-link-field"
          label={t('form.section.specificities.field.broadcastLink')}
          isRequired
          isError={!!errors.broadcastLink}
        >
          <TextField
            id="offer-form-broadcast-link-input"
            variant="outlined"
            size="small"
            name="broadcastLink"
            placeholder="https://zoom.us/123456789"
            disabled={zoomAppEnabled && !zoomAppDetail?.is_disabled}
            error={!!errors.broadcastLink && touched.broadcastLink}
            onChange={handleChange}
            onBlur={handleBlur}
            className={classNames(classes.bigWidth, {
              [classes.disabledInput]:
                zoomAppEnabled && !zoomAppDetail?.is_disabled,
            })}
            helperText={
              isBroadcastErrorRequired && touched.broadcastLink
                ? t('form.errors.required')
                : null
            }
          />

          {zoomAppEnabled && !zoomAppDetail?.is_disabled && (
            <>
              <Tooltip
                title={t('form.section.specificities.tooltip.broadcastLink')}
                className={classes.tooltip}
                onClick={handleDisplayBroadcastLinkTooltip}
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
        </OfferFormField>
      )}

      {!!errors.broadcastLink && !isBroadcastErrorRequired && (
        <Typography variant="caption" color="error">
          {t(errors.broadcastLink)}
        </Typography>
      )}
    </FormSection>
  );
};

export default OfferFormSpecificities;
