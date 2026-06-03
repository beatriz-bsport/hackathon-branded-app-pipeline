import React from 'react';
import uniq from 'lodash/uniq';
import { useTranslation } from 'react-i18next';
import { FieldArray, useFormikContext, withFormik } from 'formik';
import * as Yup from 'yup';

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

import EstablishmentSelector from '#src/libs/establishment/components/EstablishmentSelector.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type {
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
  EstablishmentSelectOption,
} from '#src/libs/establishment/types';
// @ts-expect-error JS file
import EstablishmentListItem from '#src/libs/establishment/components/EstablishmentListItem.component';

export type WellpassConfigurationFormValues = {
  establishmentIds: number[];
};

type Props = {
  establishmentIdsLinked: number[];
  establishments: Establishment[];
  externalId: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: WellpassConfigurationFormValues) => Promise<void>;
};

type HOCProps = Props & WellpassConfigurationFormValues;

const WellpassConfigurationDialog: React.FC<Props> = ({
  establishmentIdsLinked,
  establishments,
  externalId,
  isLoading,
  isOpen,
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
    resetForm,
    setFieldTouched,
    setFieldValue,
    setSubmitting,
  } = useFormikContext<WellpassConfigurationFormValues>();

  const establishmentSelectedGroupedByAddress =
    React.useMemo<EstablishmentListGroupByAddress>(() => {
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
        | null
        | number,
    ) => {
      if (
        suggestion &&
        typeof suggestion === 'object' &&
        !Array.isArray(suggestion) &&
        'value' in suggestion
      ) {
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
    !isValid || isSubmitting || isLoading || isValidating;

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      onClose={handleCloseDialog}
      open={isOpen}
    >
      <DialogTitle>
        {t('wellpass.configuration.dialog.title.edition', { externalId })}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant="body2">
          {t('wellpass.configuration.dialog.helperText')}
        </Typography>
        <div className={classes.establishmentsField}>
          <Typography variant="body2">
            {t('wellpass.configuration.dialog.field.establishmentIds.title')}
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
                'wellpass.configuration.dialog.field.establishmentIds.placeholder',
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
          {t('wellpass.configuration.dialog.action.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={isSubmitDisabled}
          onClick={handleSubmitForm}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            t('wellpass.configuration.dialog.action.save')
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
  establishmentIds: Yup.array()
    .of(Yup.number())
    .min(
      1,
      'partnership:wellpass.configuration.dialog.field.establishmentIds.error.required',
    ),
});

const withFormikWrapper = withFormik<HOCProps, WellpassConfigurationFormValues>(
  {
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema,
    mapPropsToValues: ({ establishmentIds }) => ({
      establishmentIds: establishmentIds || [],
    }),
    handleSubmit: (_values, { setSubmitting }) => {
      setSubmitting(false);
    },
  },
);

export default React.memo(withFormikWrapper(WellpassConfigurationDialog));
