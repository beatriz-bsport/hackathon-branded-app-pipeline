import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';
import TypographyMultiline from '#src/components/typo/TypographyMultiline.component';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// @ts-expect-error
import TypographyWithShowMore from '#src/components/typo/TypographyWithShowMore.component';
import PrivatePassListItem from '#src/libs/private-service/components/pass/PrivatePassListItem.component';
// @ts-expect-error
import PaymentComboListItem from '#src/libs/payment-combo/components/PaymentComboListItem.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { getContractCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import { ContractWithPaymentPack } from '../../types';

type Props = {
  contract: ContractWithPaymentPack;
  goToPack: (id: number) => void;
  goToPrivatePass: (id: number) => void;
  company: { id: number; name: string };
  snackbarSuccess: (snackbarText: string) => void;
  goToCombo: (paymentComboId: number) => void;
};

const ContractDetail = (props: Props) => {
  const {
    name,
    nb_interval,
    recurrent_price,
    flat_fee,
    recurrence_basis,
    interval,
    description,
    contract,
    auto_renewal,
    manager_only,
    payment_pack,
    month_billing_day,
    nb_interval_after_auto_renewal,
    is_usable_by_staff,
  } = props.contract;
  const classes = useStyles();
  const { t } = useTranslation('subscription');

  const duration = recurrence_basis * nb_interval;
  const durationAfterAutoRenewal =
    nb_interval_after_auto_renewal * recurrence_basis;

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Box className={classes.titleContainer}>
          <Typography className={classes.contractName} variant="h4">
            {name}
          </Typography>
          {auto_renewal && (
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
            {getCurrencyDisplayWithPrice(recurrent_price)}
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
            {t(`contract.durationInfo.${interval}`, { count: duration })}
          </Typography>
        </div>
        <div className={classes.row}>
          <Typography
            className={classes.secondaryHelperText}
            color="textSecondary"
          >
            {t('parameters.flat_fee', {
              price_with_currency: getCurrencyDisplayWithPrice(flat_fee),
            })}
          </Typography>
        </div>
        {nb_interval_after_auto_renewal !== null &&
          nb_interval_after_auto_renewal !== nb_interval && (
            <div className={classes.secondBillingPlan}>
              <Typography variant="h6">
                {t('contract.nbIntervalAfterAutoRenewal.title')}
              </Typography>
              <Typography
                className={classes.secondaryHelperText}
                color="textSecondary"
              >
                {t(`contract.nbIntervalAfterAutoRenewal.details.${interval}`, {
                  durationAfterAutoRenewal,
                })}
              </Typography>
            </div>
          )}
        {(manager_only || !is_usable_by_staff) && (
          <div className={classes.rowAlignLeft}>
            {manager_only && (
              <div className={classes.infoTextIconNoPaddingLeft}>
                <RemoveShoppingCartIcon className={classes.infoIcon} />
                <Typography className={classes.centerText}>
                  {t('contract.form.managerOnly.label')}
                </Typography>
              </div>
            )}
            {!is_usable_by_staff && (
              <div className={classes.infoTextIcon}>
                <VisibilityOffIcon className={classes.infoIcon} />
                <Typography className={classes.centerText}>
                  {t('contract.form.unusableByStaff.label')}
                </Typography>
              </div>
            )}
          </div>
        )}
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
        {props.company ? (
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="billing.allowed_actions.readPaymentLink"
          >
            <div className={classes.block}>
              <CopyToClipboard
                text={`${window.location.origin}${getContractCheckoutUrl(
                  props.company.id,
                  props.contract.id,
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
          </ObjectLevelPermissionWrapper>
        ) : null}
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(3),
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
  rowAlignLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
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
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  priceRow: {
    display: 'flex',
  },
  priceDisplay: {
    fontWeight: 500,
  },
  secondaryHelperText: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  recurrence: {
    marginLeft: theme.spacing(2),
    alignSelf: 'center',
  },
  infoTextIcon: {
    marginLeft: theme.spacing(2),
    alignSelf: 'center',
    backgroundColor: theme.palette.grey[300],
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(1),
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  infoTextIconNoPaddingLeft: {
    alignSelf: 'center',
    backgroundColor: theme.palette.grey[300],
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(1),
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  centerText: {
    alignSelf: 'center',
  },
  infoIcon: {
    marginInline: theme.spacing(0.5),
    marginBlock: 0,
  },
  secondBillingPlan: {
    marginBottom: theme.spacing(3),
  },
  autoRenewalInfoContainer: {
    paddingBlock: theme.spacing(0.2),
    padding: theme.spacing(0.5),
    color: '#0B79D0',
  },
  contractName: {
    fontWeight: 500,
  },
  noPadding: {
    padding: 0,
  },
  autoRenewalInfoMessage: {
    padding: 0,
    alignItems: 'center',
    display: 'flex',
  },
}));

export default React.memo(ContractDetail);
