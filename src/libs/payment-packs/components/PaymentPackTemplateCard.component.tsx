// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import classnames from 'classnames';
import { DateRange, Share, Star } from '@material-ui/icons';
import { getCreditInfo, getValidityInfo } from '../utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PaymentPackTemplate } from '../types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';
import RedButtonComponent from '#components/button/RedButton.component';
import TypographyMultilineComponent from '#components/typo/TypographyMultiline.component';

import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#libs/payment-packs/constants';

type Props = {
  paymentPackTemplate: PaymentPackTemplate;
  buyPaymentPackTemplateInstance?: () => void;
  onCreatePaymentPackTemplateInstance?: () => void;
  onDeleteCompany?: (id: number) => void;
  isManager?: boolean;
  editPaymentPackTemplate?: () => void;
  deletePaymentPackTemplate?: () => void;
};

const RestrictionsSection: React.FC<{
  paymentPackTemplate: PaymentPackTemplate;
}> = ({ paymentPackTemplate }) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();
  if (!paymentPackTemplate) {
    return null;
  }
  const {
    max_bookings_per_day,
    max_bookings_per_week,
    max_bookings_per_month,
    max_purchase_per_member,
    penalty_active,
    penalty_kind,
    penalty_nb_late_cancellations,
    penalty_days_blocked,
    penalty_account_value,
    penalty_nb_days,
  } = paymentPackTemplate;
  if (
    max_bookings_per_day ||
    max_bookings_per_week ||
    max_bookings_per_month ||
    max_purchase_per_member
  ) {
    return (
      <>
        <div className={classes.detailInfo}>
          <div className={classes.detailCategory}>
            <NotInterestedIcon className={classes.leftIcon} />
            <Typography variant="h6">
              {t('detailTitles.restrictions')}
            </Typography>
          </div>
          <div className={classes.packInfo}>
            <Typography variant="body1" color="textSecondary">
              {max_bookings_per_day && (
                <p className={classes.detailContent}>
                  {t('cardDetails.maxBookingPerDay')}
                  {max_bookings_per_day}
                </p>
              )}
              {max_bookings_per_week && (
                <p className={classes.detailContent}>
                  {t('cardDetails.maxBookingPerWeek')}
                  {max_bookings_per_week}
                </p>
              )}
              {max_bookings_per_month && (
                <p className={classes.detailContent}>
                  {t('cardDetails.maxBookingPerMonth')}
                  {max_bookings_per_month}
                </p>
              )}
              {max_purchase_per_member && (
                <p className={classes.detailContent}>
                  {t('cardDetails.maxPurchasePerMember')}
                  {max_purchase_per_member}
                </p>
              )}
              {!!penalty_active && (
                <>
                  {penalty_kind === PENALTY_KIND_BLOCK_CPP && (
                    <p className={classes.detailContent}>
                      {t('penalty.block', {
                        nb_cancellations: penalty_nb_late_cancellations,
                        nb_days: penalty_nb_days,
                        days_blocked: penalty_days_blocked,
                      })}
                    </p>
                  )}
                  {penalty_kind === PENALTY_KIND_NEGATIVE_ACCOUNT && (
                    <p className={classes.detailContent}>
                      {t('penalty.account', {
                        nb_cancellations: penalty_nb_late_cancellations,
                        nb_days: penalty_nb_days,
                        account_value: getCurrencyDisplayWithPrice(
                          penalty_account_value,
                        ),
                      })}
                    </p>
                  )}
                </>
              )}
            </Typography>
          </div>
        </div>
      </>
    );
  }
  return null;
};

const VODSection: React.FC<{ paymentPackTemplate: PaymentPackTemplate }> = ({
  paymentPackTemplate,
}) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();
  if (!paymentPackTemplate) {
    return null;
  }
  const { only_vod_access, full_vod_access } = paymentPackTemplate;

  if (only_vod_access || full_vod_access) {
    return (
      <>
        <div className={classes.detailInfo}>
          <div className={classes.detailCategory}>
            <OndemandVideoIcon className={classes.leftIcon} />
            <Typography variant="h6">{t('detailTitles.vod')}</Typography>
          </div>
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.packInfo}
          >
            {full_vod_access && !only_vod_access && (
              <p className={classes.detailContent}>{t('full_vod')}</p>
            )}
            {only_vod_access && (
              <p className={classes.detailContent}>{t('only_vod_access')}</p>
            )}
          </Typography>
        </div>
      </>
    );
  }
  return null;
};
const PaymentPackTemplateCard = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const {
    paymentPackTemplate: template,
    onCreatePaymentPackTemplateInstance,
    buyPaymentPackTemplateInstance,
    onDeleteCompany,
    isManager,
    editPaymentPackTemplate,
    deletePaymentPackTemplate,
  } = props;
  if (!template) {
    return null;
  }

  return (
    <Paper
      className={classnames(
        classes.paper,
        template.disabled ? classes.disabled : null,
      )}
    >
      <div className={classes.container}>
        <div className={classes.horizontalBlock}>
          {template.disabled ? (
            <div className={classes.disabledLabel}>
              <Typography color="error" variant="h6">
                {t('disabled')}
              </Typography>
            </div>
          ) : null}
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={8}>
              <div>
                <Typography className={classes.title} variant="h4">
                  {template.name}
                </Typography>
              </div>
              {template.description && (
                <div>
                  <TypographyMultilineComponent
                    className={classes.description}
                    variant="caption"
                  >
                    {template.description}
                  </TypographyMultilineComponent>
                </div>
              )}
            </Grid>
            <Grid item xs={4}>
              <div className={classes.columnLeft}>
                <Typography
                  variant="h3"
                  color="primary"
                  className={classes.price}
                >
                  {getCurrencyDisplayWithPrice(
                    template.price,
                    false,
                    template.tax,
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  className={classes.priceWithoutTax}
                >
                  {getCurrencyDisplayWithPrice(
                    template.price,
                    true,
                    template.tax,
                  )}
                  {t('ht')}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={classes.horizontalBlock}>
          <div className={classes.row}>
            <div className={`${classes.leftPart} ${classes.restrictionBlock}`}>
              <div className={classes.detailInfo}>
                <div className={classes.detailCategory}>
                  <Star className={classes.leftIcon} />
                  <Typography variant="h6">
                    {t('detailTitles.credit_quantity')}
                  </Typography>
                </div>
                <Typography variant="body1" className={classes.packInfo}>
                  {getCreditInfo(template, t, isManager)}
                </Typography>
              </div>
              <div className={classes.detailInfo}>
                <div className={classes.detailCategory}>
                  <DateRange className={classes.leftIcon} />
                  <Typography variant="h6">
                    {t('detailTitles.validity')}
                  </Typography>
                </div>
                <Typography variant="body1" className={classes.packInfo}>
                  {getValidityInfo(template, t, true)}
                </Typography>
              </div>
            </div>
            <div className={classes.rightPart}>
              {editPaymentPackTemplate && (
                <Button
                  color="primary"
                  onClick={() => editPaymentPackTemplate()}
                >
                  {t('actions.edit')}
                </Button>
              )}
              {deletePaymentPackTemplate && (
                <RedButtonComponent onClick={() => deletePaymentPackTemplate()}>
                  {t('actions.delete')}
                </RedButtonComponent>
              )}
            </div>
          </div>
          <RestrictionsSection
            paymentPackTemplate={props.paymentPackTemplate}
          />
          <VODSection paymentPackTemplate={props.paymentPackTemplate} />
          <div className={classes.restrictionBlock}>
            <div className={classes.detailInfo}>
              <div className={classes.detailCategory}>
                <Share className={classes.leftIcon} />
                <Typography variant="h6">
                  {t(
                    'paymentPackTemplate.specification.companySharedWithTitle',
                  )}
                </Typography>
              </div>
              <div className={classes.companyInnerContainer}>
                {!template.companies.length && (
                  <div className={classes.emptyExplain}>
                    <InfoOutlinedIcon className={classes.iconLeft} />
                    <Typography color="textSecondary">
                      {t('paymentPackTemplateInstance.companyEmpty')}
                    </Typography>
                  </div>
                )}
                <div className={classes.chipListContainer}>
                  {template.companies.map((c) => (
                    <div className={classes.chipContainer}>
                      <CompanyChip
                        company={c}
                        key={c.id}
                        onDelete={
                          onDeleteCompany && (() => onDeleteCompany(c.id))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              {onCreatePaymentPackTemplateInstance && (
                <div>
                  <Button
                    className={classes.button}
                    onClick={onCreatePaymentPackTemplateInstance}
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                  >
                    {t('paymentPackTemplateInstance.actions.addCompany')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {buyPaymentPackTemplateInstance && (
        <Button
          onClick={() => buyPaymentPackTemplateInstance()}
          color="primary"
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
        >
          {t('paymentPackTemplateInstance.actions.buy')}
        </Button>
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  leftPart: { width: '80%' },
  rightPart: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  row: { display: 'flex' },
  priceWithoutTax: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  button: { marginLeft: theme.spacing(5) },
  container: {
    paddingBottom: theme.spacing(3),
  },
  detailInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  price: {
    fontWeight: 700,
  },
  paper: {
    paddingTop: theme.spacing(3),
  },
  emptyExplain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  companySectionTitle: {
    marginBottom: theme.spacing(2),
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  disabled: {
    backgroundColor: '#F8F8F8',
  },
  horizontalBlock: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  columnLeft: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  restrictionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  disabledLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
  companyContainer: {
    marginBottom: theme.spacing(3),
  },
  companyInnerContainer: {
    marginLeft: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    '&>*': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  chipListContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipContainer: {
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  packInfo: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: theme.spacing(5),
  },
  detailContent: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  description: {
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
  },
}));

export default PaymentPackTemplateCard;
