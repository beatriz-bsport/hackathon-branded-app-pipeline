import React from 'react';
import uniq from 'lodash/uniq';
import { useTranslation } from 'react-i18next';
import { FieldArray, useFormikContext, withFormik } from 'formik';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListSubheader,
  Typography,
} from '@material-ui/core';

import { DelayedNumberInputField } from '#src/components/form-fields';
import { WellhubConfigurationValidationSchema } from '#src/libs/wellhub/components/WellhubConfigurationDialog/validationSchema';
import EstablishmentSelector from '#src/libs/establishment/components/EstablishmentSelector.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type {
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
  EstablishmentSelectOption,
} from '#src/libs/establishment/types';
import type { GymAvailabilityResponse } from '#src/libs/wellhub/types';

// @ts-expect-error
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

type Props = {
  establishmentIdsLinked: number[];
  establishments: Establishment[];
  isCreation: boolean;
  isOpen: boolean;
  wellhubGymAvailabilityError: Error | null;
  wellhubGymAvailabilityLoading: boolean;
  checkAvailability: (gymId: number) => void;
  getWellhubGymAvailability: (gymId: number) => GymAvailabilityResponse;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  unitId: number | null;
  establishmentIds: number[];
};

type HOCProps = Props & FormValues;

const WellhubConfigurationDialog: React.FC<Props> = ({
  establishmentIdsLinked,
  establishments,
  isCreation,
  isOpen,
  wellhubGymAvailabilityError,
  wellhubGymAvailabilityLoading,
  checkAvailability,
  getWellhubGymAvailability,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  const {
    isSubmitting,
    isValid,
    isValidating,
    values,
    getFieldMeta,
    resetForm,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<FormValues>();
  const previousUnitId = React.useRef<number>(values.unitId);

  const title = React.useMemo(
    () =>
      isCreation
        ? t('wellhub.configuration.dialog.title.creation')
        : t('wellhub.configuration.dialog.title.edition'),
    [isCreation, t],
  );

  const establishmentSelectedGroupedByAddress = React.useMemo(() => {
    const establishmentGourpByAddress = establishments
      ?.filter((establishment: Establishment) =>
        values.establishmentIds.includes(establishment.id),
      )
      ?.reduce<EstablishmentListGroupByAddress>(
        (accumulator, establishment) => {
          const currentEstablishmentIndex = accumulator.findIndex(
            (group) =>
              group.address.toUpperCase() ===
              establishment.location.address.toUpperCase(),
          );
          if (currentEstablishmentIndex === -1) {
            accumulator.push({
              address: establishment.location.address,
              establishmentList: [establishment],
            });
          } else {
            accumulator[currentEstablishmentIndex].establishmentList.push(
              establishment,
            );
          }
          return accumulator;
        },
        [],
      );
    return establishmentGourpByAddress ?? [];
  }, [establishments, values.establishmentIds]);

  const { error: establishmentIdsError, touched: establishmentIdsTouched } =
    getFieldMeta('establishmentIds');

  const isGymIdAvailable = React.useMemo(() => {
    if (!isCreation) return true;

    const valueHasChanged = previousUnitId.current != values.unitId;
    if (
      !values.unitId ||
      wellhubGymAvailabilityLoading ||
      (wellhubGymAvailabilityError && !valueHasChanged)
    ) {
      return false;
    }

    valueHasChanged && checkAvailability(values.unitId);

    const gymAvailability = getWellhubGymAvailability(values.unitId);
    if (gymAvailability) {
      return gymAvailability.is_available;
    }
    checkAvailability(values.unitId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWellhubGymAvailability, values.unitId]);

  const unitIdErrorMessage = React.useMemo(() => {
    if (values?.unitId) {
      return (
        // @ts-expect-error: Error must be better typed
        wellhubGymAvailabilityError?.response?.data?.error_message ??
        (!isGymIdAvailable
          ? t('wellhub.configuration.dialog.field.unitId.error.unavailable')
          : undefined)
      );
    }
    return undefined;
  }, [
    isGymIdAvailable,
    t,
    values?.unitId,
    // @ts-expect-error: Error must be better typed
    wellhubGymAvailabilityError?.response?.data?.error_message,
  ]);

  const selectedEstablishmentIds = React.useMemo(
    () => uniq([...establishmentIdsLinked, ...values.establishmentIds]),
    [establishmentIdsLinked, values.establishmentIds],
  );

  const enabledEstablishments = React.useMemo(
    () =>
      establishments.filter(
        (establishment) => !!establishment && !establishment.disabled,
      ),
    [establishments],
  );

  const handleEstablishmentFieldTouched = React.useCallback(
    () => setFieldTouched('establishmentIds'),
    [setFieldTouched],
  );

  const handleSelectEstablishment = React.useCallback(
    (suggestion: EstablishmentSelectOption) =>
      setFieldValue(
        'establishmentIds',
        uniq([...values.establishmentIds, suggestion.value]),
      ),
    [setFieldValue, values.establishmentIds],
  );

  const handleRemoveEstablishment = React.useCallback(
    (establishment: Establishment) => () =>
      setFieldValue(
        'establishmentIds',
        uniq(
          values.establishmentIds.filter(
            (establishmentId) => establishmentId != establishment.id,
          ),
        ),
      ),
    [setFieldValue, values.establishmentIds],
  );

  const handleCloseDialog = React.useCallback(() => {
    onClose();

    /** When the dialog closes, MUI applies a 300ms fade-out transition.
     * To prevent resetting the data before the dialog fully disappears,
     * we add a 300ms timeout for the data reset.
     * This ensures a smooth visual experience. */
    setTimeout(resetForm, 300);
  }, [onClose, resetForm]);

  const handleSubmitForm = React.useCallback(() => {
    onSubmit(values);
  }, [onSubmit, values]);

  React.useEffect(() => {
    if (previousUnitId.current !== values.unitId) {
      previousUnitId.current = values.unitId;
    }
  }, [values]);

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      onClose={handleCloseDialog}
      open={isOpen}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.content}>
        <DelayedNumberInputField
          fullWidth
          required
          disabled={!isCreation}
          errorMessage={unitIdErrorMessage}
          isLoading={isValidating || wellhubGymAvailabilityLoading}
          isValid={isGymIdAvailable}
          label={t('wellhub.configuration.dialog.field.unitId.placeholder')}
          name="unitId"
          withValidationIcon={!!values?.unitId}
        />
        <div className={classes.establishmentsField}>
          <Typography variant="body2">
            {t('wellhub.configuration.dialog.field.establishmentIds.title')}
          </Typography>
          <div>
            <EstablishmentSelector
              closeMenuOnSelect
              isClearable
              isOptionDisabled
              noMulti
              nullCurrentValue
              disabled={isSubmitting}
              error={!!establishmentIdsError && establishmentIdsTouched}
              establishments={enabledEstablishments}
              onBlur={handleEstablishmentFieldTouched}
              placeholder={t(
                'wellhub.configuration.dialog.field.establishmentIds.placeholder',
              )}
              selectedEstablishments={selectedEstablishmentIds}
              selectOption={handleSelectEstablishment}
            />
            {!!establishmentIdsError && establishmentIdsTouched && (
              <Typography color="error" variant="caption">
                {t(establishmentIdsError)}
              </Typography>
            )}
          </div>
          <FieldArray name="establishmentIds">
            {() =>
              establishmentSelectedGroupedByAddress?.map(
                (group: EstablishmentGroupByAddress, index: number) => (
                  <List
                    key={index}
                    component="nav"
                    subheader={
                      <ListSubheader
                        className={classes.listSubHeader}
                        component="div"
                      >
                        <LocationOnIcon color="primary" />
                        <Typography color="initial" variant="caption">
                          {group.address}
                        </Typography>
                      </ListSubheader>
                    }
                  >
                    {group.establishmentList.map((establishment) => (
                      <EstablishmentListItem
                        key={establishment.id}
                        button
                        noDivider
                        establishment={establishment}
                        onClickDelete={handleRemoveEstablishment(establishment)}
                      />
                    ))}
                  </List>
                ),
              )
            }
          </FieldArray>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className={classes.cancelButton} onClick={handleCloseDialog}>
          {t('wellhub.configuration.dialog.action.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={
            !isGymIdAvailable ||
            !isValid ||
            isSubmitting ||
            isValidating ||
            wellhubGymAvailabilityLoading
          }
          onClick={handleSubmitForm}
        >
          {isSubmitting ? (
            <CircularProgress />
          ) : (
            t('wellhub.configuration.dialog.action.save')
          )}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gap: theme.spacing(2),
    width: '100%',
  },
  listSubHeader: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(0.5),
    paddingLeft: 0,
  },
  cancelButton: {
    color: theme.palette.grey[600],
  },
  establishmentsField: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  enableReinitialize: true,
  validateOnMount: true,
  validationSchema: WellhubConfigurationValidationSchema,
  mapPropsToValues: ({ unitId, establishmentIds }) => ({
    unitId: unitId || undefined,
    establishmentIds: establishmentIds || [],
  }),
  handleSubmit: (_values, { setSubmitting }) => {
    setSubmitting(false);
  },
});

export default React.memo(withFormikWrapper(WellhubConfigurationDialog));
