// @flow
import React from 'react';

import type { TFunction } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import { withNamespaces } from 'react-i18next';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ConsumerPackCheckout from '../../consumer-payment-pack/components/ConsumerPaymentPackListItemCheckout.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import { anonymizeEmail } from '../../member/utils';

type RegisterMemberProps = {
  open: boolean,

  processing: boolean,
  setProcessing: (boolean) => void,

  consumerPacksLoading: boolean,
  consumerPaymentPacks: Array<ConsumerPaymentPack>,
  registerWithPass: (
    consumerPaymentPackId: number,
    { onSuccess: () => void, onError: () => void },
  ) => void,

  member: ?Member,
  setMember: (?Member) => void,
  offer: Offer,

  onClose: () => void,
  t: TFunction,
};

const RegisterMemberBase = (props: RegisterMemberProps) => (
  <Dialog open={!!props.open} onClose={props.onClose}>
    {props.consumerPacksLoading || props.processing ? (
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    ) : (
      <React.Fragment>
        <DialogTitle>{props.member.name}</DialogTitle>
        <DialogContent>
          <List disablePadding>
            {props.consumerPaymentPacks.length === 0
              ? props.t('offerDetail.noConsumerPaymentPack')
              : null}
            {props.consumerPaymentPacks.map((cpp) => (
              <ConsumerPackCheckout
                key={cpp.id}
                consumerPack={cpp}
                creditPrice={props.offer.credit_price}
                onBookFromPack={() => {
                  props.setProcessing(true);
                  props.registerWithPass(cpp.id, {
                    onSuccess: () => {
                      props.setMember(null);
                      props.setProcessing(false);
                    },
                    onError: () => {
                      props.setProcessing(false);
                    },
                  });
                }}
              />
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.setMember(null);
              props.onClose();
            }}
          >
            {props.t('offerDetail.cancelRegistration')}
          </Button>
        </DialogActions>
      </React.Fragment>
    )}
  </Dialog>
);

const RegisterMember = compose(
  withNamespaces(['selfCheckIn']),
  withState('processing', 'setProcessing', false),
)(RegisterMemberBase);

type Props = {
  open: boolean,

  consumerPacksLoading: boolean,
  consumerPaymentPacks: Array<ConsumerPaymentPack>,
  fetchCompatiblePass: (memberId: number) => void,
  registerWithPass: (
    consumerPaymentPackId: number,
    { onSuccess: () => void, onError: () => void },
  ) => void,

  member: ?Member,
  searchedMembers: Array<Member>,
  searchMembers: (txt: string) => void,

  setMember: (?Member) => void,
  offer: Offer,

  onClose: () => void,
};

export const SearchAndRegister = (props: Props) => {
  if (!props.open) {
    return null;
  }
  if (props.loading) {
    return (
      <Dialog open>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }
  if (props.member) {
    return (
      <RegisterMember
        onClose={props.onClose}
        registerWithPass={props.registerWithPass}
        consumerPacksLoading={props.consumerPacksLoading}
        consumerPaymentPacks={props.consumerPaymentPacks}
        offer={props.offer}
        open={!!props.member}
        member={props.member}
        setMember={props.setMember}
      />
    );
  }

  return (
    <MemberSearchModal
      open={!props.member}
      searchedMembers={props.searchedMembers.map((m) => ({
        ...m,
        email: anonymizeEmail(m.email),
      }))}
      searchMembers={props.searchMembers}
      onClose={props.onClose}
      handlMemberSelected={(memberId, member) => {
        props.fetchCompatiblePass(memberId);
        props.setMember(member);
      }}
    />
  );
};

export default compose(
  withNamespaces(['selfCheckIn']),
  withState('member', 'setMember', null),
)(SearchAndRegister);
