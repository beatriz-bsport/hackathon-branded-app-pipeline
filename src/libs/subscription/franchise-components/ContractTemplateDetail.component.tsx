import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';

import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import TypographyMultiline from '#src/components/typo/TypographyMultiline.component';
// @ts-expect-error
import TypographyWithShowMore from '#src/components/typo/TypographyWithShowMore.component';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { ContractTemplate } from '../types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import PaymentPackTemplateItem from './PaymentPackTemplateItem.component';
import PrivatePassTemplateItem from './PrivatePassTemplateItem.component';
import FranchiseCompanyChipList from '#src/components/franchise/FranchiseCompanyChipList.component';

import {
  BORDER_RADIUS_CONTRACT_DETAIL,
  FONT_WEIGHT_CONTRACT_DETAIL,
  FONT_SIZE_CONTRACT_DETAIL,
  PRIMARY_BLUE_CONTRACT_DETAIL,
} from '#src/libs/subscription/constants';

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
    recurrence_basis,
    interval,
    private_pass_template,
    payment_pack_template,
    companies,
    description,
    contract,
    auto_renewal,
    manager_only,
    month_billing_day,
    is_usable_by_staff,
  } = contractTemplate || {};

  const associatedPassTemplate = private_pass_template
    ? getPrivatePassTemplateById(private_pass_template)
    : getPaymentPackTemplateById(payment_pack_template);

  const franchiseCompanyList =
    companies && getFranchiseCompanyListById(companies);

  const contractDuration = useMemo(
    () => recurrence_basis * nb_interval,
    [recurrence_basis, nb_interval],
  );

  const priceWithCurrency = useMemo(
    () => getCurrencyDisplayWithPrice(recurrent_price),
    [recurrent_price],
  );

  const currencyDisplayWithPrice = useMemo(
    () => getCurrencyDisplayWithPrice(flat_fee),
    [flat_fee],
  );

  return (
    <Paper className={classes.paperContainer}>
      <Box className={classes.titleContainer}>
        <Typography className={classes.contractName} variant="h4">
          {name}
        </Typography>
        {!!auto_renewal && (
          <div>
            <Alert
              classes={{
                message: classes.autoRenewalInfoMessage,
                icon: classes.noPadding,
              }}
              className={classes.autoRenewalInfoContainer}
              color="info"
              icon={<AutorenewIcon />}
              severity="info"
            >
              {t('contract.autoRenewalInfo')}
            </Alert>
          </div>
        )}
      </Box>
      <div className={classes.priceRow}>
        <Typography className={classes.priceDisplay} variant="h5">
          {currencyDisplayWithPrice}
        </Typography>
        <Typography className={classes.recurrence}>
          {month_billing_day === null
            ? t(`contract.recurrenceInfo.${interval}`, {
                count: recurrence_basis,
              })
            : t('contract.recurrenceInfoFixedDay', {
                day: month_billing_day,
              })}
        </Typography>
        <Typography className={classes.infoTextIcon}>
          {t(`contract.durationInfo.${interval}`, { count: contractDuration })}
        </Typography>
      </div>
      <div className={classes.rows}>
        <div className={classes.pricesContainer}>
          <Typography
            className={classes.secondaryHelperText}
            color="textSecondary"
          >
            {t('parameters.flat_fee', {
              price_with_currency: priceWithCurrency,
            })}
          </Typography>
        </div>
      </div>
      {(!!manager_only || !is_usable_by_staff) && (
        <div className={classes.rowAlignLeft}>
          {!!manager_only && (
            <div className={classes.infoTextIconNoPaddingLeft}>
              <RemoveShoppingCartIcon className={classes.infoIcon} />
              <Typography className={classes.centerText}>
                {t('contract.form.managerOnly.label')}
              </Typography>
            </div>
          )}
          {!is_usable_by_staff && (
            <div className={classes.infoTextIconNoPaddingLeft}>
              <VisibilityOffIcon className={classes.infoIcon} />
              <Typography className={classes.centerText}>
                {t('contract.form.unusableByStaff.label')}
              </Typography>
            </div>
          )}
        </div>
      )}
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
          <Typography variant="h6">
            {t('contractTemplate.filter.associatedPass')}
          </Typography>
          {!!payment_pack_template && (
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
        <Typography variant="h6">{t('contract.description')}</Typography>
        <TypographyMultiline whiteSpace="break-spaces">
          {description}
        </TypographyMultiline>
      </div>
      <div className={classes.block}>
        <Typography variant="h6">{t('contract.legal')}</Typography>
        <TypographyWithShowMore multiline>{contract}</TypographyWithShowMore>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(2),
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginBottom: theme.spacing(3),
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
  recurrence: {
    marginLeft: theme.spacing(2),
    alignSelf: 'center',
  },
  contractName: {
    fontWeight: FONT_WEIGHT_CONTRACT_DETAIL,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  priceRow: {
    display: 'flex',
  },
  priceDisplay: {
    fontWeight: FONT_WEIGHT_CONTRACT_DETAIL,
  },
  autoRenewalInfoContainer: {
    paddingBlock: theme.spacing(0.2),
    padding: theme.spacing(0.5),
    color: PRIMARY_BLUE_CONTRACT_DETAIL,
  },
  rowAlignLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  infoTextIcon: {
    marginLeft: theme.spacing(2),
    alignSelf: 'center',
    backgroundColor: theme.palette.grey[300],
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(1),
    borderRadius: BORDER_RADIUS_CONTRACT_DETAIL,
    display: 'flex',
    flexDirection: 'row',
  },
  infoTextIconNoPaddingLeft: {
    alignSelf: 'center',
    backgroundColor: theme.palette.grey[300],
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(1),
    borderRadius: BORDER_RADIUS_CONTRACT_DETAIL,
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(2),
  },
  centerText: {
    alignSelf: 'center',
  },
  infoIcon: {
    marginInline: theme.spacing(0.5),
    marginBlock: 0,
  },
  autoRenewalInfoMessage: {
    padding: 0,
    alignItems: 'center',
    display: 'flex',
  },
  noPadding: {
    padding: 0,
  },
  secondaryHelperText: {
    color: theme.palette.text.secondary,
    fontSize: FONT_SIZE_CONTRACT_DETAIL,
  },
}));

export default React.memo(ContractTemplateDetail);
