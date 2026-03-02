// @flow
import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';

import { withTranslation, TFunction } from 'react-i18next';
import { URLS_PERMISSIONS } from '#src/libs/role/constants';
import PaymentPackFormDrawer from '#src/libs/payment-packs/components/PaymentPackForm';
import type { PaymentPack } from '../../payment-packs/types';
import type { PaymentPackWithContractId } from '#src/libs/subscription/types';
import type { PaginatedState } from '#src/state/types';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import CheckPermissionComponent from '../../role/components/CheckPermission.component';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

const PAGE_SIZE = 10;

type Props = {
  t: TFunction,
  goToMetaActivity: (id: number) => void,
  paymentPacks: Array<PaymentPack>,
  paymentPacksWithContractIdPaginated?: PaginatedState<PaymentPackWithContractId>,
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

  const shouldDisplayNewSubscriptionContracts = useSafeFlag(
    FeatureFlags.NEW_SUBSCRIPTION_CONTRACTS,
  );

  const closeDrawer = () => {
    setOpenPaymentPackForm(false);
  };
  const toggleDrawerOpen = () => {
    setOpenPaymentPackForm(!openPaymentPackForm);
  };
  const renderPaymentPackListItem = useCallback((pack) => {
    if (pack) {
      return (
        <PaymentPackListItem
          key={pack.id}
          divider
          hidePacksNumber
          onClick={() => openNewBackOfficeWindow(`/payment-pack/${pack.id}`)}
          pack={pack}
        />
      );
    }
    return null;
  }, []);

  const renderContractWithPaymentPackListItem = useCallback(
    (paymentPackWithContractId) => {
      if (paymentPackWithContractId) {
        const link = paymentPackWithContractId.contract_id
          ? `/subscription/contract/${paymentPackWithContractId.contract_id}`
          : `/payment-pack/${paymentPackWithContractId.id}`;

        return (
          <PaymentPackListItem
            key={paymentPackWithContractId.id}
            divider
            hidePacksNumber
            onClick={() => openNewBackOfficeWindow(link)}
            pack={{
              ...paymentPackWithContractId,
              // Override flags to hide "manager only" / "not usable by staff" icons for contract-based packs
              ...(paymentPackWithContractId.contract_id && {
                manager_only: false,
                is_usable_by_staff: true,
              }),
            }}
          />
        );
      }
      return null;
    },
    [],
  );

  const paymentPacks = shouldDisplayNewSubscriptionContracts
    ? props.paymentPacksWithContractIdPaginated
    : props.paymentPacks;

  const renderPaymentPacks = shouldDisplayNewSubscriptionContracts
    ? renderContractWithPaymentPackListItem
    : renderPaymentPackListItem;

  return (
    <div>
      <List className={props.classes.list}>
        <div className={props.classes.typographyContainer}>
          <Typography className={props.classes.helperText} variant="body1">
            {props.t('forms.create.compatible_packs.passHelperText')}
          </Typography>
        </div>
        <PaginatedListBase
          itemPerPage={PAGE_SIZE}
          items={paymentPacks?.items}
          listProps={{ disablePadding: 'true', dense: 'true' }}
          loading={paymentPacks?.loading}
          nbItems={paymentPacks?.count}
          onPageRequested={(page: number, pageSize: number) =>
            props.fetchPaymentPacksAsConsumer(
              props.metaActivity.id,
              page,
              pageSize,
            )
          }
          page={paymentPacks.page}
          renderEmpty={() => (
            <div>
              <Typography
                className={props.classes.emptyContainer}
                color="textSecondary"
                variant="caption"
              >
                {props.t('forms.create.compatible_packs.noCompatiblePass')}
              </Typography>
              <Divider />
            </div>
          )}
          renderItem={renderPaymentPacks}
        />
      </List>

      <div className={props.classes.buttonContainer}>
        <CheckPermissionComponent requiredPermissions={ADD_PASS_PERMISSION}>
          <Button className={props.classes.button} onClick={toggleDrawerOpen}>
            {props.t('forms.create.compatible_packs.createPass')}
          </Button>
        </CheckPermissionComponent>
        <Button
          className={props.classes.button}
          color="primary"
          id="button_activity_display"
          onClick={() => props.goToMetaActivity(props.metaActivity.id)}
          variant="contained"
        >
          {props.t('forms.create.compatible_packs.goToActivity')}
        </Button>
      </div>
      <PaymentPackFormDrawer
        availableEstablishmentList={props.availableEstablishmentList}
        categoryList={props.categoryList}
        closeForm={closeDrawer}
        metaActivityList={props.metaActivityList}
        onSubmit={props.onSubmit}
        open={openPaymentPackForm}
        paymentPackCategories={props.paymentPackCategories}
        tagList={props.tagList}
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
