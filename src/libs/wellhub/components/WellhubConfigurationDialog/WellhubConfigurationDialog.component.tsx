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
import EstablishmentSelector from '#src/libs/establishment/components/EstablishmentSelector.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import { ESTABLISHMENT_LIST } from '#src/libs/wellhub/components/WellhubConfigurationDialog/constants';
import { WellhubConfigurationValidationSchema } from '#src/libs/wellhub/components/WellhubConfigurationDialog/validationSchema';

import type {
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
  EstablishmentSelectOption,
} from '#src/libs/establishment/types';

// @ts-expect-error
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

type Props = {
  isCreation: boolean;
  isOpen: boolean;
  establishments?: Establishment[];
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  unitId: number | null;
  establishmentIds: number[];
};

type HOCProps = Props & FormValues;

const WellhubConfigurationDialog: React.FC<Props> = ({
  isCreation,
  isOpen,
  establishments,
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

  const title = React.useMemo(
    () =>
      isCreation
        ? t('wellhub.configuration.dialog.title.creation')
        : t('wellhub.configuration.dialog.title.edition'),
    [isCreation, t],
  );

  const establishmentList = React.useMemo(
    () => (establishments?.length > 0 ? establishments : ESTABLISHMENT_LIST),
    [establishments],
  );

  const establishmentSelectedGroupedByAddress = React.useMemo(() => {
    const establishmentGourpByAddress = establishmentList
      ?.filter((item: Establishment) =>
        values.establishmentIds.includes(item.id),
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
  }, [establishmentList, values.establishmentIds]);

  const { error: establishmentIdsError, touched: establishmentIdsTouched } =
    getFieldMeta('establishmentIds');

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
          isValid
          required
          isLoading={isValidating}
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
              establishments={establishmentList}
              onBlur={handleEstablishmentFieldTouched}
              placeholder={t(
                'wellhub.configuration.dialog.field.establishmentIds.placeholder',
              )}
              selectedEstablishments={values.establishmentIds}
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
          disabled={isSubmitting || !isValid}
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
