// @flow

import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import { urlToMarketplace } from '../../marketplace/utils';
import { buildUrlParams } from '../../../http';
import PrivatePassListItem from '../../private-service/components/pass/PrivatePassListItem.component';
import PaymentComboListItem from '../../payment-combo/components/PaymentComboListItem.component';
import { getCurrencyDisplay } from '../../theme/selectors';

type Props = {
  contract: Contract,
  goToPack: (id: number) => void,
  goToPrivatePass: (id: number) => void,
  company: { id: number, name: string },
  snackbarSuccess: (string) => void,
  goToCombo: (number) => void,
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
  } = props.contract;
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Typography variant="h3" className={classes.title}>
          {name}
        </Typography>
        <div className={classes.row}>
          <Typography variant="h4">
            {t('contract.duration', { month: nb_interval })}
          </Typography>
          <div clasName={classes.pricesContainer}>
            <Typography variant="h6" align="right">
              {`${t(
                'contract.form.recurrent_price.label',
              )} : ${recurrent_price}${getCurrencyDisplay()}`}
            </Typography>
            <Typography variant="h6" align="right">
              {`${t(
                'parameters.flat_fee',
              )} : ${flat_fee}${getCurrencyDisplay()}`}
            </Typography>
          </div>
        </div>
        {!!props.contract.payment_pack && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.paymentPack')}</Typography>
            <PaymentPackListItem
              onClick={() => props.goToPack(payment_pack.id)}
              goToPack
              pack={payment_pack}
              divider
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
              onClick={() => props.goToCombo(props.contract.payment_combo.id)}
              paymentCombo={props.contract.payment_combo}
              divider
            />
          </div>
        )}
        {props.company ? (
          <div className={classes.block}>
            <CopyToClipboard
              text={`${window.location.origin}${urlToMarketplace(
                props.company.name,
                props.company.id,
              )}
              /subscription${buildUrlParams({
                selected: props.contract.id,
              })}`}
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
          <Typography>{description}</Typography>
        </div>
        <div className={classes.block}>
          <Typography variant="h6">{t('contract.legal')}</Typography>
          <Typography>{contract}</Typography>
        </div>
        <div className={classes.booleanField}>
          <Typography variant="h6" className={classes.booleanTitle}>
            {t('contract.form.autoRenewal.label')}
          </Typography>
          <Typography>
            {auto_renewal ? t('contract.yes') : t('contract.no')}
          </Typography>
        </div>
        <div className={classes.booleanField}>
          <Typography variant="h6" className={classes.booleanTitle}>
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

export default ContractDetail;
