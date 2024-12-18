import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import Button from '@material-ui/core/Button';

import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
// @ts-expect-error
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

import { Establishment } from '../../establishment/types';
import { PartnershipCompany } from '../types';

type Props = {
  establishmentList: Array<Establishment>;
  initial: PartnershipCompany;
};

const PartnershipConfigurationOverrideForm = (props: Props) => {
  const { t } = useTranslation(['partnership']);
  const classes = useStyles();

  const [overrideAssociatedEstablishment, setOverrideAssociatedEstablishment] =
    React.useState<number | null>(props.initial?.override_establishment_pk);

  return (
    <div>
      <EstablishmentSelector
        closeMenuOnSelect
        noMulti
        establishments={props.establishmentList.map((e) => ({
          ...e,
          id: e.associatedestablishment_set[0],
        }))}
        placeholder={t('parameters.establishment')}
        selectedEstablishments={[]}
        selectOption={(e: { value: number; label: string }) => {
          if (!!e && e.value) setOverrideAssociatedEstablishment(e.value);
        }}
      />
      <div className={classes.establishmentContainer}>
        {overrideAssociatedEstablishment ? (
          <EstablishmentListItem
            establishment={props.establishmentList.find((e) =>
              e.associatedestablishment_set.includes(
                overrideAssociatedEstablishment,
              ),
            )}
          />
        ) : (
          <div className={classes.row}>
            <WarningIcon
              className={classes.iconLeft}
              color="error"
              fontSize="large"
            />
            <Typography>{t('parameters.pleaseChoseEstablishment')}</Typography>
          </div>
        )}
      </div>
      <Button
        color="primary"
        disabled={!overrideAssociatedEstablishment}
        onClick={() =>
          // @ts-expect-error
          props.onSubmit({
            ...(props.initial || {}),
            associated_establishment_ids: [],
            override_establishment_pk: overrideAssociatedEstablishment,
          })
        }
        variant="contained"
      >
        {t('actions.save')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  iconLeft: {
    marginRight: theme.spacing(2),
  },
  establishmentContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #dedede',
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#fefefe',
  },
}));

export default PartnershipConfigurationOverrideForm;
