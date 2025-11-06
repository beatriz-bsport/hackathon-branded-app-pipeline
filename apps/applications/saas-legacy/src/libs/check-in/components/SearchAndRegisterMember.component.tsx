import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, withState } from 'recompose';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
} from '@material-ui/core';

// @ts-expect-error JS
import ConsumerPackCheckout from '#src/libs/consumer-payment-pack/components/ConsumerPaymentPackListItemCheckout.component';
import MemberSearchModal from '#src/libs/member/components/MemberSearchModal.component';
import CheckInOfferDetailMemberForm from '#src/libs/check-in/components/CheckInOfferDetailMemberForm.component';
import { anonymizeEmail } from '#src/libs/member/utils';

import type { OptionCallback } from '#src/state/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import type { Member } from '#src/libs/member/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { SignUpFormConfigDict } from '#src/libs/sign-up-form/types';

type RegisterMemberOwnProps = {
  processing: boolean;
  consumerPaymentPacksLoading: boolean;
  consumerPaymentPacks: ConsumerPaymentPack[];
  member: Member;
  offer: OfferREST;
  setProcessing: (value: boolean) => void;
  registerWithPass: (
    consumerPaymentPackId: number,
    options: OptionCallback,
  ) => void;
  setSearchedMember: (member: Member) => void;
  onClose: () => void;
};

type RegisterMemberProps = RegisterMemberOwnProps & WithTranslation;

type SearchAndRegisterOwnProps = {
  loading: boolean;
  consumerPaymentPacksLoading: boolean;
  consumerPaymentPacks: ConsumerPaymentPack[];
  member: Member;
  searchedMemberList: Member[];
  offer: OfferREST;
  managerFormConfig: SignUpFormConfigDict['poll_fields'];
  waiver: string;
  generalTermsAndConditions: string;
  companyCountry: string;
  setSearchedMember: (member: Member) => void;
  registerWithPass: (
    consumerPaymentPackId: number,
    options: OptionCallback,
  ) => void;
  searchMembers: (text: string) => void;
  onClose: () => void;
  upsertMember: (
    id: number,
    FormData: FormData,
    options: OptionCallback,
  ) => void;
  memberDataToComplete: (data: { avatar: string }) => void;
};

type SearchAndRegisterProps = SearchAndRegisterOwnProps & WithTranslation;

const RegisterMemberBase = (props: RegisterMemberProps) => (
  <Dialog open onClose={props.onClose}>
    {props.consumerPaymentPacksLoading || props.processing ? (
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

const RegisterMember = compose<RegisterMemberOwnProps, RegisterMemberOwnProps>(
  withTranslation(['selfCheckIn']),
  withState('processing', 'setProcessing', false),
)(RegisterMemberBase);

export const SearchAndRegister = (props: SearchAndRegisterProps) => {
  if (props.memberDataToComplete) {
    return (
      <Dialog open>
        <CheckInOfferDetailMemberForm
          // @ts-expect-error TODO - typing
          companyCountry={props.companyCountry}
          generalTermsAndConditions={props.generalTermsAndConditions}
          initial={props.memberDataToComplete}
          managerFormConfig={props.managerFormConfig}
          onAlreadyLinkMember={props.onClose}
          onClose={props.onClose}
          onLinkMember={props.onClose}
          onSubmit={props.upsertMember}
          waiver={props.waiver}
        />
      </Dialog>
    );
  }

  if (props.offer && props.member) {
    return (
      // @ts-expect-error TODO - typing
      <RegisterMember
        consumerPaymentPacks={props.consumerPaymentPacks}
        consumerPaymentPacksLoading={props.consumerPaymentPacksLoading}
        member={props.member}
        offer={props.offer}
        onClose={props.onClose}
        registerWithPass={props.registerWithPass}
        setSearchedMember={props.setSearchedMember}
      />
    );
  }

  return (
    <MemberSearchModal
      open
      generalTermsAndConditions={props.generalTermsAndConditions}
      handlMemberSelected={(memberId, member) => {
        props.setSearchedMember(member);
      }}
      loading={props.loading}
      // @ts-expect-error TODO - typing
      managerFormConfig={props.managerFormConfig}
      onClose={props.onClose}
      searchedMembers={props.searchedMemberList.map((m) => ({
        ...m,
        email: anonymizeEmail(m.email),
      }))}
      searchMembers={props.searchMembers}
      waiver={props.waiver}
    />
  );
};

export default compose<SearchAndRegisterOwnProps, SearchAndRegisterProps>(
  withTranslation(['selfCheckIn']),
)(SearchAndRegister);
