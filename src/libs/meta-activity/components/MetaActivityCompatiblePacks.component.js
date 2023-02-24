// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';

import { withTranslation, TFunction } from 'react-i18next';
import type { PaymentPack } from '../../payment-packs/types';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import CheckPermissionComponent from '../../role/components/CheckPermission.component';

import { URLS_PERMISSIONS } from '#libs/role/constants';
import PaymentPackFormDrawer from '#libs/payment-packs/components/PaymentPackForm';

const PAGE_SIZE = 10;

type Props = {
  t: TFunction,
  goToMetaActivity: (id: number) => void,
  paymentPacks: Array<PaymentPack>,
  classes: Object,
  metaActivity: MetaActivity,
  fetchPaymentPacksAsConsumer: (metaActiviyId: number) => void,
  loading: boolean,
  availableEstablishmentList: any,
  metaActivityList: any,
  tagList: any,
  paymentPackCategories: any,
  onSubmit: (data: any, options: any) => void,
  categoryList: any,
};

const [ADD_PASS_PERMISSION] = URLS_PERMISSIONS['/payment-pack'];

export function CompatiblePaymentPacks(props: Props) {
  const [openPaymentPackForm, setOpenPaymentPackForm] =
    React.useState<boolean>(false);
  const closeDrawer = () => {
    setOpenPaymentPackForm(false);
  };
  const toggleDrawerOpen = () => {
    setOpenPaymentPackForm(!openPaymentPackForm);
  };

  return (
    <div>
      <List className={props.classes.list}>
        <div className={props.classes.typographyContainer}>
          <Typography variant="body1" className={props.classes.helperText}>
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
            props.fetchPaymentPacksAsConsumer(
              props.metaActivity.id,
              page,
              pageSize,
            )
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
        <CheckPermissionComponent requiredPermissions={ADD_PASS_PERMISSION}>
          <Button className={props.classes.button} onClick={toggleDrawerOpen}>
            {props.t('forms.create.compatible_packs.createPass')}
          </Button>
        </CheckPermissionComponent>
        <Button
          id="button_activity_display"
          variant="contained"
          color="primary"
          className={props.classes.button}
          onClick={() => props.goToMetaActivity(props.metaActivity.id)}
        >
          {props.t('forms.create.compatible_packs.goToActivity')}
        </Button>
      </div>
      <PaymentPackFormDrawer
        open={openPaymentPackForm}
        categoryList={props.categoryList}
        availableEstablishmentList={props.availableEstablishmentList}
        metaActivityList={props.metaActivityList}
        tagList={props.tagList}
        paymentPackCategories={props.paymentPackCategories}
        closeForm={closeDrawer}
        onSubmit={props.onSubmit}
      />
    </div>
  );
}

const styles = (theme) => ({
  list: {
    margin: theme.spacing(2),
  },
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
  helperText: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  typographyContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['metaActivity']),
)(CompatiblePaymentPacks);
