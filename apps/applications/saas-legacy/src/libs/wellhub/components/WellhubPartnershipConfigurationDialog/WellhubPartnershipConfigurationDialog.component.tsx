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

import { DelayedNumericInput } from '#src/components/DelayedNumericInput.component';

import EstablishmentSelector from '#src/libs/establishment/components/EstablishmentSelector.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { useValidateExternalId } from '#src/libs/partnership/hooks';

import type {
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
  EstablishmentSelectOption,
} from '#src/libs/establishment/types';

// @ts-expect-error
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import * as Yup from 'yup';

export type WellhubPartnershipConfigurationFormValues = {
  externalId: string;
  establishmentIds: number[];
};

type Props = {
  establishmentIdsLinked: number[];
  establishments: Establishment[];
  isCreation: boolean;
  isLoading: boolean;
  isOpen: boolean;
  partnershipId: number;
  onClose: () => void;
  onSubmit: (
    values: WellhubPartnershipConfigurationFormValues,
  ) => Promise<void>;
};

type HOCProps = Props & WellhubPartnershipConfigurationFormValues;

const WellhubPartnershipConfigurationDialog: React.FC<Props> = ({
  establishmentIdsLinked,
  establishments,
  isCreation,
  isLoading,
  isOpen,
  partnershipId,
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
    errors,
    touched,
    handleBlur,
    resetForm,
    setFieldTouched,
    setFieldValue,
    setSubmitting,
  } = useFormikContext<WellhubPartnershipConfigurationFormValues>();

  const [validateExternalIdState, doValidateExternalId] =
    useValidateExternalId(partnershipId);

  const title = React.useMemo(
    () =>
      isCreation
        ? t('wellhub.configuration.dialog.title.creation')
        : t('wellhub.configuration.dialog.title.edition'),
    [isCreation, t],
  );

  const handleExternalIdChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('externalId', e.target.value);
      if (isCreation && e.target.value) {
        doValidateExternalId(e.target.value);
      }
    },
    [setFieldValue, isCreation, doValidateExternalId],
  );

  const isExternalIdValid = React.useMemo(() => {
    if (!isCreation) return true;
    if (!values.externalId) return false;
    if (validateExternalIdState.loading) return false;
    return validateExternalIdState.value?.is_valid ?? false;
  }, [
    isCreation,
    values.externalId,
    validateExternalIdState.loading,
    validateExternalIdState.value,
  ]);

  const externalIdErrorMessage = React.useMemo(() => {
    if (!values.externalId) return undefined;
    if (
      validateExternalIdState.value &&
      !validateExternalIdState.value.is_valid
    ) {
      return t(
        'wellhub.configuration.dialog.field.externalId.error.unavailable',
      );
    }
    return undefined;
  }, [values.externalId, validateExternalIdState.value, t]);

  const establishmentSelectedGroupedByAddress = React.useMemo(() => {
    return (
      establishments
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
        ) ?? []
    );
  }, [establishments, values.establishmentIds]);

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
    (
      suggestion:
        | EstablishmentSelectOption[]
        | EstablishmentSelectOption
        | number,
    ) => {
      if (typeof suggestion === 'object' && 'value' in suggestion) {
        setFieldValue(
          'establishmentIds',
          uniq([...values.establishmentIds, suggestion.value]),
        );
      }
    },
    [setFieldValue, values.establishmentIds],
  );

  const handleRemoveEstablishment = React.useCallback(
    (establishment: Establishment) => () =>
      setFieldValue(
        'establishmentIds',
        uniq(
          values.establishmentIds.filter(
            (establishmentId) => establishmentId !== establishment.id,
          ),
        ),
      ),
    [setFieldValue, values.establishmentIds],
  );

  // Reset form whenever the dialog closes, regardless of how it was closed
  // (user-triggered or programmatic close after successful submission).
  // MUI applies a 300ms fade-out — wait before resetting to avoid a visual glitch.
  React.useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(resetForm, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, resetForm]);

  const handleCloseDialog = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmitForm = React.useCallback(async () => {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [onSubmit, values, setSubmitting]);

  const isSubmitDisabled =
    (isCreation && !isExternalIdValid) ||
    !isValid ||
    isSubmitting ||
    isLoading ||
    isValidating ||
    validateExternalIdState.loading;

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      onClose={handleCloseDialog}
      open={isOpen}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.content}>
        <div>
          <DelayedNumericInput
            fullWidth
            isPositive
            required
            disabled={!isCreation}
            error={
              isCreation &&
              !!values.externalId &&
              !isExternalIdValid &&
              !validateExternalIdState.loading
            }
            helperText={externalIdErrorMessage}
            label={t(
              'wellhub.configuration.dialog.field.externalId.placeholder',
            )}
            name="externalId"
            onBlur={handleBlur}
            onChange={handleExternalIdChange}
            value={values.externalId ? Number(values.externalId) : null}
            variant="outlined"
          />
        </div>
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
              error={!!errors.establishmentIds && touched.establishmentIds}
              establishments={enabledEstablishments}
              onBlur={handleEstablishmentFieldTouched}
              placeholder={t(
                'wellhub.configuration.dialog.field.establishmentIds.placeholder',
              )}
              selectedEstablishments={selectedEstablishmentIds}
              selectOption={handleSelectEstablishment}
            />
            {!!errors.establishmentIds && touched.establishmentIds && (
              <Typography color="error" variant="caption">
                {t(errors.establishmentIds as string)}
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
          disabled={isSubmitDisabled}
          onClick={handleSubmitForm}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
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

const validationSchema = Yup.object().shape({
  externalId: Yup.string().required(
    'partnership:wellhub.configuration.dialog.field.externalId.error.required',
  ),
  establishmentIds: Yup.array()
    .of(Yup.number())
    .min(
      1,
      'partnership:wellhub.configuration.dialog.field.establishmentIds.error.required',
    ),
});

const withFormikWrapper = withFormik<
  HOCProps,
  WellhubPartnershipConfigurationFormValues
>({
  enableReinitialize: true,
  validateOnMount: true,
  validationSchema,
  mapPropsToValues: ({ externalId, establishmentIds }) => ({
    externalId: externalId || '',
    establishmentIds: establishmentIds || [],
  }),
  handleSubmit: (_values, { setSubmitting }) => {
    setSubmitting(false);
  },
});

export default React.memo(
  withFormikWrapper(WellhubPartnershipConfigurationDialog),
);
