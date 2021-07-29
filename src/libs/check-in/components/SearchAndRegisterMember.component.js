// @flow
import React from 'react';

import type { TFunction } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import { withTranslation } from 'react-i18next';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ConsumerPackCheckout from '../../consumer-payment-pack/components/ConsumerPaymentPackListItemCheckout.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import { anonymizeEmail } from '../../member/utils';
import CheckInOfferDetailMemberForm from './CheckInOfferDetailMemberForm.component';

import type { OptionCallback } from '../../../state/types';

type RegisterMemberProps = {
  processing: boolean,
  setProcessing: (boolean) => void,

  consumerPacksLoading: boolean,
  consumerPaymentPacks: Array<ConsumerPaymentPack>,
  registerWithPass: (
    consumerPaymentPackId: number,
    { onSuccess: () => void, onError: () => void },
  ) => void,

  member: ?Member,
  setSearchedMember: (?Member) => void,
  offer: Offer,

  onClose: () => void,
  t: TFunction,
};

const RegisterMemberBase = (props: RegisterMemberProps) => (
  <Dialog open onClose={props.onClose}>
    {props.consumerPacksLoading || props.processing ? (
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    ) : (
      <React.Fragment>
        <DialogTitle>{props.member && props.member.name}</DialogTitle>
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
                      props.setSearchedMember(null);
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
              props.setSearchedMember(null);
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
  withTranslation(['selfCheckIn']),
  withState('processing', 'setProcessing', false),
)(RegisterMemberBase);

type Props = {
  loading: boolean,

  consumerPacksLoading: boolean,
  consumerPaymentPacks: Array<ConsumerPaymentPack>,
  setSearchedMember: (member: ?Member) => void,
  registerWithPass: (
    consumerPaymentPackId: number,
    { onSuccess: () => void, onError: () => void },
  ) => void,

  member: ?Member,
  searchedMemberList: Array<Member>,
  searchMembers: (txt: string) => void,

  setSearchedMember: (?Member) => void,
  offer: Offer,

  onClose: () => void,
  upsertMember: (id: ?number, FormData, options: OptionCallback) => void,
  memberDataToComplete: (?{ avatar: string }) => void,
  managerFormConfig: SignUpFormConfigDict,
  waiver: string,
  generalTermsAndConditions: string,
};

export const SearchAndRegister = (props: Props) => {
  if (props.loading) {
    return (
      <Dialog open>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (props.memberDataToComplete) {
    return (
      <Dialog open>
        <CheckInOfferDetailMemberForm
          initial={props.memberDataToComplete}
          onSubmit={props.upsertMember}
          onClose={props.onClose}
          onAlreadyLinkMember={props.onClose}
          onLinkMember={props.onClose}
          managerFormConfig={props.managerFormConfig}
          waiver={props.waiver}
          generalTermsAndConditions={props.generalTermsAndConditions}
        />
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
        member={props.member}
        setSearchedMember={props.setSearchedMember}
      />
    );
  }

  return (
    <MemberSearchModal
      open
      searchedMembers={props.searchedMemberList.map((m) => ({
        ...m,
        email: anonymizeEmail(m.email),
      }))}
      searchMembers={props.searchMembers}
      onClose={props.onClose}
      handlMemberSelected={(memberId, member) => {
        props.setSearchedMember(member);
      }}
      managerFormConfig={props.managerFormConfig}
      waiver={props.waiver}
      generalTermsAndConditions={props.generalTermsAndConditions}
    />
  );
};

export default compose(withTranslation(['selfCheckIn']))(SearchAndRegister);
