import React from 'react';

import { DateTime } from 'luxon';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { VOUCHER_TYPE_AMOUNT } from '@bsport/common/lib/master-data/coupon';
import CompanyChip from '#src/components/franchise/CompanyChip.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import { isCurrentlyActive } from '../utils';

import type { CouponTemplate } from '../types';

type Props = {
  couponTemplate: CouponTemplate;
  onEditTemplate: () => void;
  onDeleteTemplate: () => void;
  onCreateInstance: () => void;
  onDeleteInstance: (instanceId: number) => void;
};

export const CouponCard = (props: Props) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();
  const { couponTemplate } = props;
  // @ts-expect-error
  const currentlyActive = isCurrentlyActive(couponTemplate);

  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.headline}>
        <div>
          <Typography variant="h4">{couponTemplate.name}</Typography>
          <Typography variant="h5">{couponTemplate.code}</Typography>
        </div>
        <div className={classes.headlineRight}>
          {currentlyActive ? (
            <CheckCircleOutlineIcon
              className={classes.isActiveIcon}
              color="primary"
            />
          ) : (
            <CancelIcon className={classes.isActiveIcon} color="error" />
          )}
          <Typography align="right" variant="h5">
            {couponTemplate.voucher_type === VOUCHER_TYPE_AMOUNT
              ? `${getCurrencyDisplayWithPrice(couponTemplate.amount_off)}`
              : `${couponTemplate.percent_off}%`}
          </Typography>
        </div>
      </div>
      <List>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${t('card.uses')} ${props.couponTemplate.nb_discounts}/${
              props.couponTemplate.usage_total
            }`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              couponTemplate.usage_per_member === 1
                ? `${t('card.limitation')} ${
                    couponTemplate.usage_per_member
                  } ${t('card.member_use')}`
                : `${t('card.limitation')} ${
                    couponTemplate.usage_per_member
                  } ${t('card.member_uses')}`
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              couponTemplate.combinable
                ? t('card.cumulable')
                : t('card.no_cumulable')
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${t('card.validity')} ${t(
              `form.applies_to.choices.${couponTemplate.applies_to}`,
            )}`}
          />
        </ListItem>
        {couponTemplate.only_on_first_checkout ? (
          <ListItem>
            <ListItemIcon>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary={t('card.first_buy')} />
          </ListItem>
        ) : null}
        <ListItem>
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              couponTemplate.expiration_date
                ? `${t('card.expiration')} ${DateTime.fromISO(
                    couponTemplate.expiration_date,
                  ).toLocaleString(DateTime.DATE_SHORT)}`
                : t('card.no_expiration')
            }
          />
        </ListItem>
      </List>
      <div className={classes.templateInstanceContainer}>
        <Typography variant="h5">
          {t(
            'paymentPack:paymentPackTemplate.specification.companySharedWithTitle',
          )}
        </Typography>

        <div className={classes.companyInnerContainer}>
          {!couponTemplate.companies.length && (
            <div className={classes.emptyExplain}>
              <InfoOutlinedIcon className={classes.iconLeft} />
              <Typography color="textSecondary">
                {t('couponTemplateInstance.companyEmpty')}
              </Typography>
            </div>
          )}
          <div className={classes.chipListContainer}>
            {couponTemplate.companies.map((c) => (
              <div className={classes.chipContainer}>
                <CompanyChip
                  key={c.id}
                  // @ts-expect-error
                  company={c}
                  onDelete={
                    props.onDeleteInstance &&
                    (() => props.onDeleteInstance(c.id))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          className={classes.addInstanceButton}
          color="primary"
          onClick={props.onCreateInstance}
          variant="outlined"
        >
          <AddIcon />
          {t('paymentPack:paymentPackTemplateInstance.actions.addCompany')}
        </Button>
      </div>
      <div className={classes.actionButtons}>
        <Button className={classes.greyColor} onClick={props.onDeleteTemplate}>
          {t('modal.delete.actions.submit')}
        </Button>
        <Button color="primary" onClick={props.onEditTemplate}>
          {t('detail.seeParameters')}
        </Button>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  chipListContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyExplain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  companyInnerContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    '&>*': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  addInstanceButton: {
    marginTop: theme.spacing(2),
  },
  headline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  allTagContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  chipContainer: {
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tagContainer: {
    marginLeft: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    width: '100%',
  },
  isActiveIcon: {
    marginRight: theme.spacing(1),
  },
  headlineRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    '& button': {
      marginLeft: theme.spacing(3),
    },
  },
  greyColor: { color: theme.palette.grey[600] },
  templateInstanceContainer: {
    marginTop: theme.spacing(2),
  },
}));

export default CouponCard;
