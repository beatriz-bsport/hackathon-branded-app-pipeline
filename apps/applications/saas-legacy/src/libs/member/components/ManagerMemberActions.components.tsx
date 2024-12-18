import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PaymentIcon from '@material-ui/icons/Payment';
import { Theme, useTheme } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import RedFab from '#src/components/button/RedFab.component';
import GreenFab from '#src/components/button/GreenFab.component';
import FabWithItems from '#src/components/button/FabWithItems';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { Member } from '../types';
import { getCurrencyDisplay } from '../../theme/selectors';

type OwnProps = {
  billMember: () => void;
  subscribeMember?: () => void;
  interrogateMemberStatus: () => void;
  unArchiveMember: () => void;
  member: Member;
  // eslint-disable-next-line react/no-unused-prop-types
  openCommunicationDrawer: () => void;
  numberOfUnreadAnswers: number;
};
type Props = OwnProps;
export const MemberActions: React.FC<Props> = (props: Props) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation('member');
  const classes = useStyles();
  const speedDialogMode = useMediaQuery(theme.breakpoints.down('sm'));

  if (speedDialogMode) {
    return (
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'product.contract.allowed_actions.createBillingPlan',
          'billing.allowed_actions.createInvoice',
        ]}
      >
        {([
          hasCreateBillingPlanPermission,
          hasCreateInvoicePermission,
        ]: boolean[]) => (
          <FabWithItems
            badgeValue={props.numberOfUnreadAnswers}
            items={[
              hasCreateInvoicePermission && {
                label: t('paymentAction.toBill'),
                onClick: () => props.billMember(),
              },
              hasCreateBillingPlanPermission && {
                label: t('paymentAction.toSubscribe'),
                onClick: () => props.subscribeMember(),
              },
              props.member?.archived
                ? {
                    label: t('restoreMember'),
                    onClick: () => props.unArchiveMember(),
                  }
                : {
                    label: t('archiveMember'),
                    onClick: () => props.interrogateMemberStatus(),
                  },
            ]}
            label={t('actions')}
          />
        )}
      </ObjectLevelPermissionProvider>
    );
  }
  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'product.contract.allowed_actions.createBillingPlan',
        'member.allowed_actions.delete',
        'billing.allowed_actions.createInvoice',
      ]}
    >
      {([
        hasCreateBillingPlanPermission,
        hasDeleteMemberPermission,
        hasCreateInvoicePermission,
      ]: boolean[]) => (
        <div className={classes.bottomButtonContainer}>
          {hasCreateInvoicePermission && (
            <Fab
              className={classes.bottomButton}
              color="primary"
              onClick={props.billMember}
              variant="extended"
            >
              <>
                {getCurrencyDisplay() === '€' ? (
                  <EuroSymbolIcon className={classes.leftIcon} />
                ) : (
                  <AttachMoneyIcon className={classes.leftIcon} />
                )}
                {t('paymentAction.toBill')}
              </>
            </Fab>
          )}
          {hasCreateBillingPlanPermission && (
            <Fab
              className={classes.bottomButton}
              color="secondary"
              onClick={props.subscribeMember}
              variant="extended"
            >
              <PaymentIcon className={classes.leftIcon} />
              {t('paymentAction.toSubscribe')}
            </Fab>
          )}
          {hasDeleteMemberPermission &&
          props.member &&
          props.member.archived ? (
            // @ts-expect-error
            <GreenFab
              className={classes.bottomButton}
              onClick={props.unArchiveMember}
              variant="extended"
            >
              <RestoreFromTrashIcon className={classes.leftIcon} />
              {t('restoreMember')}
            </GreenFab>
          ) : (
            // @ts-expect-error
            <RedFab
              className={classes.bottomButton}
              onClick={props.interrogateMemberStatus}
            >
              <DeleteIcon />
            </RedFab>
          )}
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};
export default compose<any, OwnProps>()(MemberActions);

const useStyles = makeStyles((theme) => ({
  bottomButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 999,
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));
