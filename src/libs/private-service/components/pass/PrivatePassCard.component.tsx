import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import LinkIcon from '@material-ui/icons/Link';
import StarIcon from '@material-ui/icons/Star';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VisibilityIcon from '@material-ui/icons/Visibility';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import PaymentIcon from '@material-ui/icons/Payment';
import { useTranslation } from 'react-i18next';
import StyleIcon from '@material-ui/icons/Style';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';
import RedButton from '#components/button/RedButton.component';
import { getValidityInfo } from '../../utils';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { PrivatePass, PrivatePassCategory } from '../../types';

type Props = {
  pass: PrivatePass;
  privatePassCategory: PrivatePassCategory;

  snackbarSuccess: (text: string) => void;
  onEditButtonClick: () => void;
  onDeleteButtonClick: () => void;

  isManager?: boolean;
};

export const PrivatePassCard: React.FC<Props> = (props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();

  const { pass, isManager, privatePassCategory } = props;
  const {
    full_vod_access,
    manager_only,
    new_member_only,
    price,
    name,
    tax,
    available_payment_method_identifiers,
  } = pass;

  const renderLinkToPaymentPage = () => {
    return pass.id && pass.company ? (
      <CopyToClipboard
        text={`${window.location.origin}/customer/payment/private-pass/${pass.id}/?membership=${pass.company}`}
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
    ) : (
      <CircularProgress />
    );
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.horizontalBlock}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={8}>
            <div className={classes.header}>
              <div>
                <Typography className={classes.title} variant="h4">
                  {name}
                </Typography>
                {privatePassCategory ? (
                  <Typography className={classes.category} variant="h6">
                    {privatePassCategory.name}
                  </Typography>
                ) : (
                  <div className={classes.marginTop} />
                )}
              </div>
              <div>
                {isManager && (
                  <div className={classes.copyButton}>
                    {renderLinkToPaymentPage()}
                  </div>
                )}

                <div className={isManager ? '' : classes.marginTop}>
                  <div className={classes.detailInfo}>
                    <div className={classes.detailCategory}>
                      <StarIcon className={classes.leftIcon} />
                      <Typography variant="h6">
                        {t('privatePass.detailTitles.credit_quantity')}
                      </Typography>
                    </div>
                    <Typography variant="body1" className={classes.passInfo}>
                      {`${pass.credits}${t('privatePass.parameters.nbCredits', {
                        count: pass.credits,
                      }).toLowerCase()}`}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.columnLeft}>
              <Typography
                variant="h3"
                color="primary"
                className={classes.price}
              >
                {getCurrencyDisplayWithPrice(price)}
              </Typography>
              <Typography variant="caption" className={classes.priceWithoutTax}>
                {`${getCurrencyDisplayWithPrice(
                  (price / ((100 + parseInt(tax, 10)) / 100)).toFixed(2),
                )}${'\u00A0'}
                ${t('privatePass.ht')}`}
              </Typography>
              {isManager && (
                <div className={classes.buttonBlock}>
                  <div className={classes.buttonContainer}>
                    <Button
                      id="button_pass_modify"
                      color="primary"
                      onClick={props.onEditButtonClick}
                      className={`${classes.buttonWidth} ${classes.buttonAlign}`}
                    >
                      <Hidden xsDown>{t('privatePass.edit')}</Hidden>
                    </Button>
                    {!!props.onDeleteButtonClick && (
                      <RedButton
                        id="button_pass_delete"
                        onClick={props.onDeleteButtonClick}
                        className={`${classes.buttonWidth} ${classes.buttonAlign}`}
                      >
                        <Hidden xsDown>{t('privatePass.delete.delete')}</Hidden>
                      </RedButton>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </Grid>

        <div>
          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <DateRangeIcon className={classes.leftIcon} />
              <Typography variant="h6">
                {t('privatePass.detailTitles.validity')}
              </Typography>
            </div>
            <Typography variant="body1" className={classes.passInfo}>
              {getValidityInfo(pass, t, true)}
            </Typography>
          </div>

          {(new_member_only || manager_only) && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <VisibilityIcon className={classes.leftIcon} />
                <Typography variant="h6">
                  {t('privatePass.detailTitles.accessibility')}
                </Typography>
              </div>
              <Typography variant="body1" className={classes.passInfo}>
                {new_member_only && !manager_only && (
                  <p className={classes.detailContent}>
                    {t('privatePass.form.new_member_only.label')}
                  </p>
                )}
                {manager_only && (
                  <p className={classes.detailContent}>
                    {t('privatePass.form.managerOnly.label')}
                  </p>
                )}
              </Typography>
            </div>
          )}

          {full_vod_access && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <OndemandVideoIcon className={classes.leftIcon} />
                <Typography variant="h6">
                  {t('privatePass.detailTitles.vod')}
                </Typography>
              </div>
              <Typography variant="body1" className={classes.passInfo}>
                <p className={classes.detailContent}>
                  {t('privatePass.form.full_vod_access.label')}
                </p>
              </Typography>
            </div>
          )}

          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <PaymentIcon className={classes.leftIcon} />
              <Typography variant="h6">
                {t('privatePass.detailTitles.paymentMeans')}
              </Typography>
            </div>
            <Typography variant="body1" className={classes.passInfo}>
              {available_payment_method_identifiers.includes(CB.id) && (
                <p className={classes.detailContent}>
                  {t(`translation:paymentMethod.${CB.text}`)}
                </p>
              )}
              {available_payment_method_identifiers.includes(
                CREDIT_ACCOUNT.id,
              ) && (
                <p className={classes.detailContent}>
                  {t(`translation:paymentMethod.${CREDIT_ACCOUNT.text}`)}
                </p>
              )}
            </Typography>
          </div>

          {!!pass?.linked_payment_pack && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <StyleIcon className={classes.leftIcon} />
                <Typography variant="h6">
                  {t('paymentPack:detailTitles.universalPass')}
                </Typography>
              </div>
              <Typography variant="body1" className={classes.passInfo}>
                <p className={classes.detailContent}>
                  {t('paymentPack:cardDetails.universalPass')}
                </p>
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 300,
  },
  category: {
    fontStyle: 'italic',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: 400,
  },
  copyButton: {
    marginLeft: -theme.spacing(1),
  },
  detailInfo: {
    marginBottom: theme.spacing(2),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  passInfo: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: theme.spacing(5),
  },
  titleWithSeeAll: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailContent: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  penaltyTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  noRestriction: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  buttonBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  multiDivButton: {
    textAlign: 'right',
  },
  price: {
    fontWeight: 700,
  },
  priceWithoutTax: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  buttonAlign: {
    marginRight: -theme.spacing(1),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  buttonWidth: {
    width: 'min-content',
    marginLeft: 'auto',
  },
  columnLeft: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  restrictionBlock: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  link: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(2),
    textAlign: 'left',
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
}));

export default PrivatePassCard;
