import React from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import PaymentIcon from '@material-ui/icons/Payment';
import { Theme, useTheme } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import type { Member } from '../types';
import RedFab from '#components/button/RedFab.component';
import GreenFab from '#components/button/GreenFab.component';
import FabWithItems from '#components/button/FabWithItems';

type OwnProps = {
  billMember: () => void;
  subscribeMember: () => void;
  interrogateMemberStatus: () => void;
  unArchiveMember: () => void;
  member: Member;
};
type Props = OwnProps;
export const MemberActions: React.FC<Props> = (props: Props) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation('member');
  const classes = useStyles();
  const speedDialogMode = useMediaQuery(theme.breakpoints.down('sm'));

  if (speedDialogMode) {
    return (
      <FabWithItems
        label={t('actions')}
        items={[
          {
            label: t('paymentAction.toBill'),
            onClick: () => props.billMember(),
          },
          {
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
      />
    );
  }
  return (
    <div className={classes.bottomButtonContainer}>
      <Fab
        color="primary"
        variant="extended"
        className={classes.bottomButton}
        onClick={props.billMember}
      >
        <>
          <EuroSymbolIcon className={classes.leftIcon} />
          {t('paymentAction.toBill')}
        </>
      </Fab>
      <Fab
        color="secondary"
        className={classes.bottomButton}
        variant="extended"
        onClick={props.subscribeMember}
      >
        <PaymentIcon className={classes.leftIcon} />
        {t('paymentAction.toSubscribe')}
      </Fab>
      <>
        {props.member && props.member.archived ? (
          <GreenFab
            variant="extended"
            className={classes.bottomButton}
            onClick={props.unArchiveMember}
          >
            <RestoreFromTrashIcon className={classes.leftIcon} />
            {t('restoreMember')}
          </GreenFab>
        ) : (
          <RedFab
            className={classes.bottomButton}
            onClick={props.interrogateMemberStatus}
          >
            <DeleteIcon />
          </RedFab>
        )}
      </>
    </div>
  );
};
export default compose<any, OwnProps>()(MemberActions);

const useStyles = makeStyles((theme) => ({
  bottomButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));
