// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { PaymentPack } from '../../payment-packs/types';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';

const PAGE_SIZE = 10;

type Props = {
  t: TFunction,
  goToMetaActivity: (id: number) => void,
  goToPaymentPackCreate: () => void,
  paymentPacks: Array<PaymentPack>,
  classes: Object,
  metaActivity: MetaActivity,
  fetchPaymentPacks: (id: number) => void,
  loading: boolean,
};

export function CompatiblePaymentPacks(props: Props) {
  return (
    <div>
      <List className={props.classes.list}>
        <div className={props.classes.typographyContainer}>
          <Typography variant="body2" className={props.classes.helperText}>
            {props.t('forms.create.compatible_packs.passHelperText')}
          </Typography>
        </div>
        <PaginatedListBase
          listProps={{ disablePadding: 'true', dense: 'true' }}
          items={props.paymentPacks.items}
          nbItems={props.paymentPacks.count}
          loading={props.paymentPacks.loading}
          page={props.paymentPacks.page}
          itemPerPage={PAGE_SIZE}
          onPageRequested={(page: number, pageSize: number) =>
            props.fetchPaymentPacks(props.metaActivity.id, page, pageSize)
          }
          renderEmpty={() => (
            <div>
              <Typography
                className={props.classes.emptyContainer}
                variant="caption"
                color="textSecondary"
              >
                {props.t('forms.create.compatible_packs.noCompatiblePass')}
              </Typography>
              <Divider />
            </div>
          )}
          renderItem={(pack) => (
            <PaymentPackListItem
              hidePacksNumber
              key={pack.id}
              pack={pack}
              divider
              onClick={() => window.open(`/payment-pack/${pack.id}`)}
            />
          )}
        />
      </List>
      <div className={props.classes.buttonContainer}>
        <Button
          variant="contained"
          className={props.classes.button}
          color="secondary"
          onClick={props.goToPaymentPackCreate}
        >
          {props.t('forms.create.compatible_packs.createPass')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={props.classes.button}
          onClick={() => props.goToMetaActivity(props.metaActivity.id)}
        >
          {props.t('forms.create.compatible_packs.goToActivity')}
        </Button>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  list: {
    margin: theme.spacing.unit * 2,
  },
  emptyContainer: {
    padding: theme.spacing.unit * 2,
    backgroundColor: 'F8F8F8',
  },
  helperText: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  typographyContainer: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['metaActivity']),
)(CompatiblePaymentPacks);
