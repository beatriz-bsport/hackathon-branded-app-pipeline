// @flow
import React, { useCallback, useState } from 'react';
import { withTranslation, TFunction } from 'react-i18next';

import { useTheme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import CustomChip from '../chip/CustomChip.component';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import BankAccountFormDialog from '#src/libs/payment/components/BankAccountFormDialog.component';
import BankAccountSuccessDialog from '#src/libs/payment/components/BankAccountSuccess.dialog';
import {
  UpdatePlatformCustomerEntityVatInformationParams,
  PlatformCustomerEntity,
} from '#src/libs/platform-billing/type';
import UpdatePlatformCustomerEntityVatIdDialog from '#src/libs/platform-billing/components/UpdatePlatformCustomerEntityVatIdDialog.component';
import AddressDetail from '../AddressDetail.component';

function getAddress(object, prefix) {
  const pre = prefix ? `${prefix}_` : '';
  return {
    address: object[`${pre}address`],
    city: object[`${pre}city`],
    postal_code: object[`${pre}postal_code`],
    state: object[`${pre}state`],
    country: object[`${pre}country`],
  };
}

type Props = {
  t: TFunction,
  classes: any,
  company: any,
  updateCompanyDetail: () => void,
  platformCustomerEntity: PlatformCustomerEntity,
  updatePlatformCustomerEntityVatInformation: (
    params: UpdatePlatformCustomerEntityVatInformationParams,
  ) => void,
  fetchPlatformCustomerEntity: () => void,
  setAddExternalAccountOpen: (boolean) => void,
  addExternalAccountOpen: boolean,
  setExternalAccountSuccessOpen: (boolean) => void,
  externalAccountSuccessOpen: boolean,
  updatePlatformCustomerEntityVatIdDialogOpen: boolean,
  setUpdatePlatformCustomerEntityVatIdDialogOpen: (boolean) => void,
  attachExternalAccount: (data: any, options: OptionCallback) => void,
  onSuccessDialogConfirmed: () => void,
};

export const CompanyDetail = (props: Props) => {
  const {
    company,
    t,
    classes,
    setAddExternalAccountOpen,
    setExternalAccountSuccessOpen,
    onSuccessDialogConfirmed,
    platformCustomerEntity,
    fetchPlatformCustomerEntity,
    updatePlatformCustomerEntityVatInformation,
  } = props;

  const muiTheme = useTheme();

  const [
    updatePlatformCustomerEntityVatIdDialogOpen,
    setUpdatePlatformCustomerEntityVatIdDialogOpen,
  ] = useState(false);

  const bankAccountFormSuccess = useCallback(() => {
    setAddExternalAccountOpen(false);
    setExternalAccountSuccessOpen(true);
  }, [setAddExternalAccountOpen, setExternalAccountSuccessOpen]);

  const onUpdatePlatformCustomerEntityVatInformationConfirm = useCallback(
    (params, options) => {
      updatePlatformCustomerEntityVatInformation(params, {
        ...options,
        onSuccess: () => {
          fetchPlatformCustomerEntity();
          setUpdatePlatformCustomerEntityVatIdDialogOpen(false);
          options?.onSuccess?.();
        },
      });
    },
    [
      updatePlatformCustomerEntityVatInformation,
      fetchPlatformCustomerEntity,
      setUpdatePlatformCustomerEntityVatIdDialogOpen,
    ],
  );

  return (
    <div className="company-detail">
      <Grid container direction="column" spacing={3}>
        <Grid container>
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="h6">
              {t('companies.bank_details')}
            </Typography>
            <div className={classes.row}>
              <Typography color="textSecondary" variant="subtitle1">
                {`${t('settings:company.bankAccountInfo.content')} `}
                <Link className={classes.link} to="/settings/platform-billing">
                  {t('settings:company.bankAccountInfo.link')}
                </Link>
                .
              </Typography>
            </div>
            <p>
              <strong>{t('companies.fields.iban')} : </strong>
              {`*************${company.external_account_last4}`}
              <br />
              <strong>{t('companies.fields.bank_account_holder')} : </strong>
              {company.bank_account_holder}
              <br />
            </p>
            <Button
              color="primary"
              onClick={() => setAddExternalAccountOpen(true)}
              variant="contained"
            >
              {t('settings:company.bankAccountInfo.update')}
            </Button>
            <Divider className={classes.divider} color="primary" />
            <Typography className={classes.title} variant="h6">
              {t('companies.address')}
            </Typography>
            <AddressDetail address={getAddress(company, '')} />
            <Button
              color="primary"
              onClick={props.updateCompanyDetail}
              variant="contained"
            >
              {t('settings:company.stripe.update')}
            </Button>
            {platformCustomerEntity.is_vat_id_collection_required && (
              <>
                <Divider className={classes.divider} color="primary" />
                <div className={classes.row}>
                  <Typography variant="h6">
                    {t('settings:platformCustomerEntity.vatId.title')}
                  </Typography>
                  {platformCustomerEntity.is_valid_vat_id_missing && (
                    <CustomChip
                      displayedValue={t(
                        'settings:platformCustomerEntity.vatId.errorChip',
                      )}
                      mainColor={muiTheme.palette.error.main}
                    />
                  )}
                </div>
                <Typography color="textSecondary" variant="subtitle1">
                  {t('settings:platformCustomerEntity.vatId.descriptionPart1')}
                  <br />
                  {t('settings:platformCustomerEntity.vatId.descriptionPart2')}
                </Typography>
                <p>{platformCustomerEntity.vat_id}</p>
                <Button
                  color="primary"
                  onClick={() =>
                    setUpdatePlatformCustomerEntityVatIdDialogOpen(true)
                  }
                  variant="contained"
                >
                  {t('settings:platformCustomerEntity.vatId.update')}
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      <BankAccountFormDialog
        company={company}
        country={company.country}
        currency={company.currency}
        onClose={() => setAddExternalAccountOpen(false)}
        onSubmit={(data, options) => props.attachExternalAccount(data, options)}
        onSuccess={bankAccountFormSuccess}
        open={props.addExternalAccountOpen}
      />
      <BankAccountSuccessDialog
        onCancel={() => setExternalAccountSuccessOpen(false)}
        onConfirm={onSuccessDialogConfirmed}
        open={props.externalAccountSuccessOpen}
      />
      <UpdatePlatformCustomerEntityVatIdDialog
        hasAttributedVatId={platformCustomerEntity.has_attributed_vat_id}
        isValidVatIdMissing={platformCustomerEntity.is_valid_vat_id_missing}
        onCancel={() => setUpdatePlatformCustomerEntityVatIdDialogOpen(false)}
        onConfirm={onUpdatePlatformCustomerEntityVatInformationConfirm}
        open={updatePlatformCustomerEntityVatIdDialogOpen}
        vatId={platformCustomerEntity.vat_id}
      />
    </div>
  );
};

const styles = (theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    width: '100%',
    whiteSpace: 'pre-line',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  pageTitle: {
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'underline',
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
    },
  },
});
export default compose(
  withStyles(styles),
  withTranslation(),
  withState('addExternalAccountOpen', 'setAddExternalAccountOpen', false),
  withState(
    'externalAccountSuccessOpen',
    'setExternalAccountSuccessOpen',
    false,
  ),
)(CompanyDetail);
