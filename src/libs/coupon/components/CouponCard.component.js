// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import { withTranslation, TFunction } from 'react-i18next';

import { compose } from 'recompose';
import {
  CouponKind,
  VOUCHER_TYPE_AMOUNT,
} from '@bsport/common/lib/master-data/coupon';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { isCurrentlyActive } from '../utils';
import TagChip from '../../tag/components/TagChip.component';

import Config from '../../../config';
import type { Coupon } from '../types';

type Props = {
  coupon: Coupon,
  classes: Object,
  t: TFunction,
  goToEdit: () => void,
  isLoading: boolean,
  openVoucherCodesDialog: () => void,
};

export const CouponCard = React.memo(
  ({
    coupon,
    classes,
    t,
    goToEdit,
    isLoading,
    openVoucherCodesDialog,
  }: Props) => {
    const currentlyActive = isCurrentlyActive(coupon);

    const displayNbUses = `${t('card.uses')}: ${coupon.nb_discounts}${
      coupon.coupon_template_instance ? '' : `/${coupon.usage_total}`
    }`;

    const isDevelopment = ['dev', 'local'].includes(
      Config.REACT_APP_SENTRY_ENVIRONMENT,
    );

    const isCouponViaUniqueCode =
      coupon?.coupon_type === CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE;

    const numberOfUsedVouchers = `${t('card.uses')}: ${
      coupon?.nb_discounts
    }${`/${coupon?.nb_unique_codes}`}`;

    if (!coupon) {
      return null;
    }

    return (
      <Paper className={classes.paperContainer}>
        <div className={classes.headline}>
          <div>
            <Typography variant="h4">{coupon.name}</Typography>
            <Typography variant="h5">{coupon.code}</Typography>
          </div>
          {!isCouponViaUniqueCode && (
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
                {coupon.voucher_type === VOUCHER_TYPE_AMOUNT
                  ? `${getCurrencyDisplayWithPrice(coupon.amount_off)}`
                  : `${coupon.percent_off}%`}
              </Typography>
            </div>
          )}
        </div>
        <List>
          <ListItem>
            <ListItemIcon>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                isCouponViaUniqueCode && isDevelopment
                  ? numberOfUsedVouchers
                  : displayNbUses
              }
            />
          </ListItem>
          {!isCouponViaUniqueCode && (
            <>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    coupon.usage_per_member === 1
                      ? `${t('card.limitation')} ${coupon.usage_per_member} ${t(
                          'card.member_use',
                        )}`
                      : `${t('card.limitation')} ${coupon.usage_per_member} ${t(
                          'card.member_uses',
                        )}`
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    coupon.combinable
                      ? t('card.cumulable')
                      : t('card.no_cumulable')
                  }
                />
              </ListItem>
            </>
          )}
          <ListItem>
            <ListItemIcon>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${t('card.validity')} ${t(
                `form.applies_to.choices.${coupon.applies_to}`,
              )}`}
            />
          </ListItem>
          {coupon.only_on_first_checkout ? (
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
                coupon.expiration_date
                  ? `${t('card.expiration')} ${coupon.expiration_date}`
                  : t('card.no_expiration')
              }
            />
          </ListItem>
        </List>
        <div className={classes.allTagContainer}>
          {coupon?.whitelist_tags && coupon?.whitelist_tags?.length !== 0 ? (
            <div className={classes.tagContainer}>
              <Typography>{t('card.allowedFor')}</Typography>
              <div className={classes.chipContainer}>
                {coupon?.whitelist_tags?.map((tag) => {
                  return <TagChip key={tag.id} tag={tag} />;
                })}
              </div>
            </div>
          ) : null}
          {coupon?.blacklist_tags && coupon?.blacklist_tags?.length !== 0 ? (
            <div className={classes.tagContainer}>
              <Typography>{t('card.unallowedFor')}</Typography>
              <div className={classes.chipContainer}>
                {coupon?.blacklist_tags?.map((tag) => {
                  return <TagChip key={tag.id} tag={tag} />;
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className={classes.actionButtons}>
          {isDevelopment && isCouponViaUniqueCode && (
            <Button
              color="secondary"
              disabled={isLoading}
              onClick={openVoucherCodesDialog}
              startIcon={<VisibilityIcon />}
            >
              {t('detail.seeVouchers')}
            </Button>
          )}
          <Button
            color="primary"
            disabled={isLoading}
            onClick={goToEdit}
            startIcon={<CreateIcon />}
          >
            {t('detail.seeParameters')}
          </Button>
        </div>
      </Paper>
    );
  },
);

const styles = (theme) => ({
  allTagContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  chipContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
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
  headline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['coupon']),
)(CouponCard);
