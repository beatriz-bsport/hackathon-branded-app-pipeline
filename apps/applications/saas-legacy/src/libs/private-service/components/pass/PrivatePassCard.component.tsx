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
} from '@bsport/common/lib/master-data/payment-methods.js';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import RedButton from '#src/components/button/RedButton.component';

import TypographyMultilineComponent from '#src/components/typo/TypographyMultiline.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import type { PrivatePass, PrivatePassCategory } from '../../types';
import { getValidityInfo } from '../../utils';

type Props = {
  pass: PrivatePass;
  privatePassCategory: PrivatePassCategory;

  snackbarSuccess: (text: string) => void;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;

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
    description,
  } = pass;

  const renderLinkToPaymentPage = () => {
    return pass.id && pass.company ? (
      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="billing.allowed_actions.readPaymentLink"
      >
        <CopyToClipboard
          text={`${window.location.origin}/customer/payment/private-pass/${pass.id}/?membership=${pass.company}&force=true`}
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
      </ObjectLevelPermissionWrapper>
    ) : (
      <CircularProgress />
    );
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.horizontalBlock}>
        <Grid
          container
          alignItems="flex-start"
          direction="row"
          justify="space-between"
        >
          <Grid item xs={8}>
            <div className={classes.header}>
              <div>
                <Typography variant="h4">{name}</Typography>
                {privatePassCategory ? (
                  <Typography className={classes.category} variant="h6">
                    {privatePassCategory.name}
                  </Typography>
                ) : (
                  <div className={classes.marginTop} />
                )}
              </div>

              {description && (
                <TypographyMultilineComponent
                  className={classes.description}
                  variant="caption"
                >
                  {description}
                </TypographyMultilineComponent>
              )}

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
                      <Typography variant="subtitle2">
                        {t('privatePass.detailTitles.credit_quantity')}
                      </Typography>
                    </div>
                    <Typography
                      className={classes.passInfo}
                      color="textSecondary"
                      variant="caption"
                    >
                      {`${getCreditsDividedDisplay(pass.credits)}${t(
                        'privatePass.parameters.nbCredits',
                        {
                          count: getCreditsDividedValue(pass.credits),
                        },
                      ).toLowerCase()}`}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.columnLeft}>
              <Typography
                className={classes.price}
                color="primary"
                variant="h3"
              >
                {getCurrencyDisplayWithPrice(price)}
              </Typography>
              <Typography className={classes.priceWithoutTax} variant="caption">
                {`${getCurrencyDisplayWithPrice(price, true, tax)}${'\u00A0'}
                ${t('privatePass.ht')}`}
              </Typography>
              {isManager && (
                <div className={classes.buttonBlock}>
                  <div className={classes.buttonContainer}>
                    {props.onEditButtonClick && (
                      <Button
                        className={`${classes.buttonWidth} ${classes.buttonAlign}`}
                        color="primary"
                        id="button_pass_modify"
                        onClick={props.onEditButtonClick}
                      >
                        <Hidden xsDown>{t('privatePass.edit')}</Hidden>
                      </Button>
                    )}
                    {!!props.onDeleteButtonClick && (
                      <RedButton
                        className={`${classes.buttonWidth} ${classes.buttonAlign}`}
                        id="button_pass_delete"
                        onClick={props.onDeleteButtonClick}
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
              <Typography variant="subtitle2">
                {t('privatePass.detailTitles.validity')}
              </Typography>
            </div>
            <Typography
              className={classes.passInfo}
              color="textSecondary"
              variant="caption"
            >
              {getValidityInfo(pass, t, true)}
            </Typography>
          </div>

          {(new_member_only || manager_only) && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <VisibilityIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('privatePass.detailTitles.accessibility')}
                </Typography>
              </div>
              <div className={classes.flexInfo}>
                {new_member_only && !manager_only && (
                  <Typography
                    className={classes.passInfo}
                    color="textSecondary"
                    variant="caption"
                  >
                    {t('privatePass.form.new_member_only.label')}
                  </Typography>
                )}
                {manager_only && (
                  <Typography
                    className={classes.passInfo}
                    color="textSecondary"
                    variant="caption"
                  >
                    {t('privatePass.form.managerOnly.label')}
                  </Typography>
                )}
              </div>
            </div>
          )}

          {full_vod_access && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <OndemandVideoIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('privatePass.detailTitles.vod')}
                </Typography>
              </div>
              <Typography
                className={classes.passInfo}
                color="textSecondary"
                variant="caption"
              >
                {t('privatePass.form.full_vod_access.label')}
              </Typography>
            </div>
          )}

          <div className={classes.detailInfo}>
            <div className={classes.detailCategory}>
              <PaymentIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('privatePass.detailTitles.paymentMeans')}
              </Typography>
            </div>
            <div className={classes.flexInfo}>
              {available_payment_method_identifiers.includes(CB.id) && (
                <Typography
                  className={classes.passInfo}
                  color="textSecondary"
                  variant="caption"
                >
                  {t(`payment:paymentMethod.onlinePayments`)}
                </Typography>
              )}
              {available_payment_method_identifiers.includes(
                CREDIT_ACCOUNT.id,
              ) && (
                <Typography
                  className={classes.passInfo}
                  color="textSecondary"
                  variant="caption"
                >
                  {t(`payment:paymentMethod.${CREDIT_ACCOUNT.id}`)}
                </Typography>
              )}
            </div>
          </div>

          {!!pass?.linked_payment_pack && (
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <StyleIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('paymentPack:detailTitles.universalPass')}
                </Typography>
              </div>
              <Typography
                className={classes.passInfo}
                color="textSecondary"
                variant="caption"
              >
                {t('paymentPack:cardDetails.universalPass')}
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
    marginLeft: theme.spacing(5),
  },
  detailContent: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  buttonBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
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
  link: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
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
  flexInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
  },
}));

export default PrivatePassCard;
