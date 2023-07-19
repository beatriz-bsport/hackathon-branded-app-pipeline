// @ts-nocheck
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import PaymentPackListItem from '#libs/payment-packs/components/PaymentPackListItem.component';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import TypographyWithShowMore from '#components/typo/TypographyWithShowMore.component';
import PrivatePassListItem from '#libs/private-service/components/pass/PrivatePassListItem.component';
import PaymentComboListItem from '#libs/payment-combo/components/PaymentComboListItem.component';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { ContractWithPaymentPack } from '../../types';
import { getSubscriptionPageUrl } from '#libs/marketplace/routing-utils';
import { CompanyTheme } from '#libs/theme/types';

type Props = {
  contract: ContractWithPaymentPack;
  goToPack: (id: number) => void;
  goToPrivatePass: (id: number) => void;
  company: { id: number; name: string };
  snackbarSuccess: (snackbarText: string) => void;
  goToCombo: (paymentComboId: number) => void;
  companyTheme: CompanyTheme;
};

const ContractDetail = (props: Props) => {
  const {
    name,
    nb_interval,
    recurrent_price,
    flat_fee,
    description,
    contract,
    auto_renewal,
    manager_only,
    payment_pack,
    month_billing_day,
  } = props.contract;
  const classes = useStyles();
  const { t } = useTranslation('subscription');

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Typography className={classes.title} variant="h3">
          {name}
        </Typography>
        {!!month_billing_day && (
          <div>
            <Typography variant="h4">
              {t('contract.monthBillingDay', {
                month_billing_day,
              })}
            </Typography>
          </div>
        )}
        <div className={classes.row}>
          <Typography variant="h4">
            {t('contract.duration', { month: nb_interval })}
          </Typography>
          <div className={classes.pricesContainer}>
            <Typography align="right" variant="h6">
              {`${t(
                'contract.form.recurrent_price.label',
              )} : ${getCurrencyDisplayWithPrice(recurrent_price)}`}
            </Typography>
            <Typography align="right" variant="h6">
              {`${t('parameters.flat_fee')} : ${getCurrencyDisplayWithPrice(
                flat_fee,
              )}`}
            </Typography>
          </div>
        </div>
        {!!props.contract.payment_pack && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.paymentPack')}</Typography>
            <PaymentPackListItem
              divider
              goToPack
              onClick={() => props.goToPack(payment_pack.id)}
              pack={payment_pack}
            />
          </div>
        )}
        {!!props.contract.private_pass && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.privatePass')}</Typography>
            <PrivatePassListItem
              divider
              onClick={() =>
                props.goToPrivatePass(props.contract.private_pass.id)
              }
              pass={props.contract.private_pass}
            />
          </div>
        )}
        {!!props.contract.payment_combo && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.paymentCombo')}</Typography>
            <PaymentComboListItem
              divider
              onClick={() => props.goToCombo(props.contract.payment_combo.id)}
              paymentCombo={props.contract.payment_combo}
            />
          </div>
        )}
        {props.company ? (
          <div className={classes.block}>
            <CopyToClipboard
              text={`${window.location.origin}${getSubscriptionPageUrl(
                props.company.id,
                props.contract.id,
                props.companyTheme?.display_new_checkout_flow,
                { force: 'true' },
              )}`}
            >
              <ButtonBase
                className={classes.link}
                onClick={() => props.snackbarSuccess('link.copied')}
              >
                <LinkIcon />
                <Typography className={classes.linkTypo}>
                  {t('shop:link.copyLink')}
                </Typography>
              </ButtonBase>
            </CopyToClipboard>
          </div>
        ) : null}
        <div className={classes.block}>
          <Typography variant="h6">{t('contract.description')}</Typography>
          <TypographyMultiline>{description}</TypographyMultiline>
        </div>
        <div className={classes.block}>
          <Typography variant="h6">{t('contract.legal')}</Typography>
          <TypographyWithShowMore multiline>{contract}</TypographyWithShowMore>
        </div>
        <div className={classes.booleanField}>
          <Typography className={classes.booleanTitle} variant="h6">
            {t('contract.form.autoRenewal.label')}
          </Typography>
          <Typography>
            {auto_renewal ? t('contract.yes') : t('contract.no')}
          </Typography>
        </div>
        <div className={classes.booleanField}>
          <Typography className={classes.booleanTitle} variant="h6">
            {t('contract.form.managerOnly.label')}
          </Typography>
          <Typography>
            {manager_only ? t('contract.yes') : t('contract.no')}
          </Typography>
        </div>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  pricesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  block: {
    marginBottom: theme.spacing(3),
  },
  booleanTitle: {
    marginRight: theme.spacing(2),
  },
  booleanField: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    marginBottom: theme.spacing(3),
  },
  link: {
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(1),
  },
}));

export default React.memo(ContractDetail);
