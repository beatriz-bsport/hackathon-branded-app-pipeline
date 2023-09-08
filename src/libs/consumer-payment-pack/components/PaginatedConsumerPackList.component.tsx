// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import { withTranslation, WithTranslation } from 'react-i18next';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import ConsumerPackRowItem from './ConsumerPackRowItem.component';

import type { ConsumerPaymentPack } from '../types';
import type { PaymentPack } from '../../payment-packs/types';
import { WithIsSharedActive } from '../../relationship/types';
import { MaterialStyleType } from '../../../utils/types';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { hasPaymentPackManagementPermission } from '#libs/payment-packs/utils';

type OwnProps = {
  paymentPack: PaymentPack;
  allowedFranchisees?: Array<number>;
  onClick?: (
    ConsumerPaymentPack: WithIsSharedActive<ConsumerPaymentPack<PaymentPack>>,
  ) => void;
  consumerPacksUpdatingById: { [key: string]: boolean };
  decrementCredit: (id: number) => void;
  incrementCredit: (id: number) => void;
  items: Array<WithIsSharedActive<ConsumerPaymentPack>>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PaginatedConsumerPackList: React.FC<Props> = React.memo(
  (props) => (
    <ObjectLevelPermissionProviderComponent requiredPermission="product.paymentPack.allowed_actions.manageCredit">
      {(hasManageCreditPermission: boolean) => (
        <PaginatedListBase
          itemPerPage={props.itemPerPage}
          items={props.items}
          listProps={{ disablePadding: 'true', dense: 'true' }}
          loading={props.loading}
          nbItems={props.nbItems}
          onPageRequested={(page: number, pageSize: number) =>
            props.onPageRequested(page, pageSize)
          }
          page={props.page}
          renderEmpty={() => (
            <div>
              <Typography
                className={props.classes.emptyContainer}
                color="textSecondary"
                variant="caption"
              >
                {props.t('noConsumerPack')}
              </Typography>
              <Divider />
            </div>
          )}
          renderItem={(
            cpp: WithIsSharedActive<ConsumerPaymentPack<PaymentPack>>,
          ) => {
            const paymentPack = props.paymentPack || cpp.payment_pack || null;
            return (
              <ConsumerPackRowItem
                key={cpp.id}
                consumerPack={cpp}
                decrementCredit={
                  hasPaymentPackManagementPermission(
                    paymentPack,
                    hasManageCreditPermission,
                  ) && props.decrementCredit
                }
                disabled={
                  props.allowedFranchisees?.length &&
                  !props.allowedFranchisees.includes(cpp.payment_pack?.company)
                }
                incrementCredit={
                  hasPaymentPackManagementPermission(
                    paymentPack,
                    hasManageCreditPermission,
                  ) && props.incrementCredit
                }
                onClick={props.onClick ? () => props.onClick(cpp) : null}
                paymentPack={paymentPack}
                updating={
                  (props.consumerPacksUpdatingById || {})[cpp?.id] ?? false
                }
              />
            );
          }}
        />
      )}
    </ObjectLevelPermissionProviderComponent>
  ),
);

const styles = (theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
});

export default compose<any, Props>(
  withTranslation(['paymentPack']),
  withStyles(styles),
)(PaginatedConsumerPackList);
