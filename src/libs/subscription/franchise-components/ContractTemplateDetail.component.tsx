import React from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { ContractTemplate } from '../types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import PaymentPackTemplateItem from './PaymentPackTemplateItem.component';
import PrivatePassTemplateItem from './PrivatePassTemplateItem.component';
import FranchiseCompanyChipList from '#src/components/franchise/FranchiseCompanyChipList.component';

type Props = {
  contractTemplate: ContractTemplate;
  getPrivatePassTemplateById: (id: number) => PrivatePassTemplate;
  getPaymentPackTemplateById: (id: number) => PaymentPackTemplate;
  getFranchiseCompanyListById: (id__in: number[]) => FranchiseCompany[];
  onPrivatePassTemplateClick: (id: number) => void;
  onPaymentPackTemplateClick: (id: number) => void;
};

const ContractTemplateDetail: React.FC<Props> = ({
  contractTemplate,
  getPrivatePassTemplateById,
  getPaymentPackTemplateById,
  getFranchiseCompanyListById,
  onPrivatePassTemplateClick,
  onPaymentPackTemplateClick,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const {
    name,
    nb_interval,
    flat_fee,
    recurrent_price,
    private_pass_template,
    payment_pack_template,
    companies,
    description,
    contract,
    auto_renewal,
    manager_only,
  } = contractTemplate || {};

  const associatedPassTemplate = private_pass_template
    ? getPrivatePassTemplateById(private_pass_template)
    : getPaymentPackTemplateById(payment_pack_template);

  const franchiseCompanyList =
    companies && getFranchiseCompanyListById(companies);
  return (
    <Paper className={classes.paperContainer}>
      <Typography className={classes.title} variant="h4">
        {name ?? null}
      </Typography>
      <div className={classes.rows}>
        <Typography variant="h5">
          {t('contract.duration', { month: nb_interval })}
        </Typography>
        <div className={classes.pricesContainer}>
          <Typography variant="subtitle1">
            {`${t(
              'contract.form.recurrent_price.label',
            )} : ${getCurrencyDisplayWithPrice(recurrent_price)}`}
          </Typography>
          <Typography variant="subtitle1">
            {`${t('parameters.flat_fee')} ${getCurrencyDisplayWithPrice(
              flat_fee,
            )}`}
          </Typography>
        </div>
      </div>
      <div className={classes.block}>
        <Typography variant="subtitle2">
          {t('contractTemplate.detailPage.sharedStudios')}
        </Typography>
        {!!franchiseCompanyList && (
          <FranchiseCompanyChipList
            companies={franchiseCompanyList}
            nbCompanyChips={franchiseCompanyList.length}
          />
        )}
      </div>
      {!!associatedPassTemplate && (
        <div className={classes.block}>
          <Typography variant="subtitle1">
            {t('contractTemplate.filter.associatedPass')}
          </Typography>
          {payment_pack_template && (
            <PaymentPackTemplateItem
              onClick={onPaymentPackTemplateClick}
              paymentPackTemplate={
                associatedPassTemplate as PaymentPackTemplate
              }
            />
          )}
          {!!private_pass_template && (
            <PrivatePassTemplateItem
              onClick={onPrivatePassTemplateClick}
              privatePassTemplate={
                associatedPassTemplate as PrivatePassTemplate
              }
            />
          )}
        </div>
      )}
      <div className={classes.block}>
        <Typography className={classes.block} variant="subtitle1">
          {t('contract.description')}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </div>
      <div className={classes.block}>
        <Typography className={classes.block} variant="subtitle1">
          {t('contract.legal')}
        </Typography>
        <Typography variant="body1">{contract}</Typography>
      </div>
      <div className={classes.autoRenewal}>
        <Typography className={classes.inlineText} variant="subtitle1">
          {t('contract.form.autoRenewal.label')}
        </Typography>
        <Typography variant="body1">
          {auto_renewal ? t('contract.yes') : t('contract.no')}
        </Typography>
      </div>
      <div className={classes.managerOnly}>
        <Typography className={classes.inlineText} variant="subtitle1">
          {t('contract.form.managerOnly.label')}
        </Typography>
        <Typography variant="body1">
          {manager_only ? t('contract.yes') : t('contract.no')}
        </Typography>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginBottom: theme.spacing(1),
  },
  pricesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  block: {
    marginBottom: theme.spacing(1),
  },
  autoRenewal: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  managerOnly: {
    display: 'flex',
    alignItems: 'center',
  },
  inlineText: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(ContractTemplateDetail);
