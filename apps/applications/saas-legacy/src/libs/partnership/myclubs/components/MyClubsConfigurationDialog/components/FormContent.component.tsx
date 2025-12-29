import { FieldArray, useFormikContext } from 'formik';
import uniq from 'lodash/uniq';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  List,
  ListSubheader,
  Typography,
} from '@material-ui/core';

import EstablishmentSelector from '#src/libs/establishment/components/EstablishmentSelector.component';

import type {
  Establishment,
  EstablishmentGroupByAddress,
  EstablishmentListGroupByAddress,
  EstablishmentSelectOption,
} from '#src/libs/establishment/types';
import { PartnershipIdentifier } from '#src/libs/partnership/types';
// @ts-expect-error
import EstablishmentListItem from '#src/libs/establishment/components/EstablishmentListItem.component';
import { FormValues } from '../MyClubsConfigurationDialog.component';

type Props = {
  partnershipIdentifier: PartnershipIdentifier;
  isCreation: boolean;
  establishments: Establishment[];
  establishmentIdsLinked: number[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const groupSelectedEstablishmentsByAddress = (
  establishments: Establishment[],
  selectedEstablishmentIds: number[],
): { address: string; establishmentList: Establishment[] }[] =>
  establishments
    ?.filter((establishment: Establishment) =>
      selectedEstablishmentIds.includes(establishment.id),
    )
    ?.reduce<EstablishmentListGroupByAddress>((accumulator, establishment) => {
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
    }, []);

const FormDialogContent: React.FC<Props> = ({
  partnershipIdentifier,

  establishments,
  establishmentIdsLinked,
  isLoading,
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
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<FormValues>();

  const establishmentSelectedGroupedByAddress = React.useMemo(
    () =>
      groupSelectedEstablishmentsByAddress(
        establishments,
        values.establishmentIds,
      ),
    [establishments, values.establishmentIds],
  );

  const { error: establishmentIdsError, touched: establishmentIdsTouched } =
    getFieldMeta('establishmentIds');

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
            (establishmentId) => establishmentId !== establishment.id,
          ),
        ),
      ),
    [setFieldValue, values.establishmentIds],
  );

  return (
    <>
      <DialogContent className={classes.content}>
        <Typography variant="subtitle1">
          {t(`${partnershipIdentifier}.configuration.dialog.helperText`)}
        </Typography>
        <div className={classes.establishmentsField}>
          <Typography variant="body2">
            {t(
              `${partnershipIdentifier}.configuration.dialog.field.establishmentIds.title`,
            )}
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
                `${partnershipIdentifier}.configuration.dialog.field.establishmentIds.placeholder`,
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
        <Button className={classes.cancelButton} onClick={onClose}>
          {t(`${partnershipIdentifier}.configuration.dialog.action.cancel`)}
        </Button>
        <Button
          color="primary"
          disabled={!isValid || isSubmitting || isValidating || isLoading}
          onClick={onSubmit}
        >
          {isLoading || isSubmitting ? (
            <CircularProgress />
          ) : (
            t(`${partnershipIdentifier}.configuration.dialog.action.save`)
          )}
        </Button>
      </DialogActions>
    </>
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

export default React.memo(FormDialogContent);
