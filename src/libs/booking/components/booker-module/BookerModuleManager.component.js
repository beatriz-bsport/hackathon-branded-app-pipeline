// @flow
import React, { PureComponent } from 'react';

import flatten from 'lodash/flatten';

import { compose, withState, withHandlers, withProps } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogContent from '@material-ui/core/DialogContent';
import Alert from '@material-ui/lab/Alert';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import Avatar from '#components/Avatar.component';
import Tooltip from '#components/Tooltip.component';
import PaymentPackListItem from '#libs/payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '#libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

import BookingModuleRegisterMethodChoice from './BookingModuleRegisterMethodChoice.component';
import BookingModuleOfferChoice from './BookingModuleOfferChoice.component';
import BookerModuleWarningTagDialog from './BookerModuleWarningTagDialog.component';

import {
  ConsumerPaymentPack,
  MaxoutBooking,
} from '#libs/consumer-payment-pack/types';

import type { WithIsSharedActive } from '../../../relationship/types';
import type { Establishment } from '../../../establishment/types';
import type { Theme as CompanyTheme } from '../../../theme/types';
import type { Role } from '../../../role/types';
import type { OptionCallback } from '../../../../state/types';
import type { Offer } from '../../../offer/types';
import type { PaymentPack } from '../../../payment-packs/types';
import type { Member } from '../../../member/types';
import type { Level, LevelFilterSet } from '../../../level/types';

type Props = {
  loading: boolean,
  consumerPacksLoading: boolean,
  offerId: number,
  offer: ?Offer,
  compatiblePacks: Array<PaymentPack>,
  consumerPacks: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  consumerPacksNonCompatible: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  keep_credits: boolean,
  notify_member: boolean,
  setNotifyMember: () => void,
  setKeepCredits: () => void,
  onCancel: () => void,
  member: { name: string, id: number, photo: ?string },
  similarOffers: Array<Offer>,
  similarOfferLoading: boolean,
  fetchSimilarOffers: () => void,
  registererObject: {
    paymentPack?: PaymentPack,
    consumerPaymentPack?: ConsumerPaymentPack,
  },
  fetchByOfferByMemberAction: (
    offerId: number,
    MemberId: number,
    options: OptionCallback,
  ) => void,
  fetchPaymentPackBulk: (pps: Array<number>) => void,
  fetchNoncompatibleConsumerPackByOfferByMember: (
    offerId: number,
    memberId: number,
    options: OptionCallback,
  ) => void,
  step: number,
  setRegistererObject: (data: {
    consumerPaymentPack?: ConsumerPaymentPack,
    paymentPack?: PaymentPack,
  }) => void,
  registerToOffer: (
    offerId: number,
    registererObject: {
      consumerPaymentPack?: ConsumerPaymentPack,
      paymentPack?: PaymentPack,
    },
    voucher?: number,
    billingEstablishmentId?: number,
  ) => void,

  backToRegistererChoice: () => void,
  t: TFunction,
  onClose: () => void,
  classes: Object,
  openRecurrenceRuleForm: () => void,
  maxoutLoading: boolean,
  cppMaxoutBookingsByCpp: { [key: string]: MaxoutBooking },
  fetchEstablishments: () => void,
  fetchAllEstablishmentBillingGroup: () => void,
  establishments: Array<Establishment>,
  companyTheme: CompanyTheme,
  memberDetails: { [id: number]: Member },

  fetchConsumerPaymentPackLinks: (
    links_id: Array<number>,
    options: OptionCallback,
  ) => void,
  checkOfferTagEligibility: () => void,
  tagWarningDialogOpen: boolean,
  setTagWarningDialogOpen: (open: boolean) => void,
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionCallback<Level[]>,
  ) => void,
  companyId: number,

  fetchGroup: (id: number, option: OptionCallback) => void,
  fetchCompatiblePacks: (offerId: number) => void,
  userRole: Role,
  fetchCompanyUserRoles: () => void,

  fetchIncompatibilitiesReasonsByOfferByConsumerPack: (
    cpp_id: number,
    offer_id: number,
    options: OptionCallback,
  ) => void,
  resetIncompatibilitiesReasonsByOfferByConsumerPack: () => void,
  incompatibilitiesReasons: { [cpp_id: number]: number[] },
  goToPaymentPack: (pp_id: number) => void,
  hasFetchedNonCompatiblePasses: boolean,
  setHasFetchedNonCompatiblePasses: (hasFetch: boolean) => void,
  nonCompatibleByOfferByMemberLoading: boolean,
};

const REGISTER_METHOD_CHOICE = 0;
const OFFER_CHOICE = 1;

export class BookerModuleManager extends PureComponent<Props> {
  componentDidMount() {
    this.props.checkOfferTagEligibility();
    this.props.fetchByOfferByMemberAction(
      this.props.offerId,
      this.props.member.id,
      {
        onSuccess: (consumerPaymentPacks) => {
          if (consumerPaymentPacks.length === 0) {
            this.handleFetchNoncompatibleConsumerPackByOfferByMember();
          }
          this.props.fetchConsumerPaymentPackLinks(
            flatten(
              consumerPaymentPacks.map((cpp) =>
                cpp.src_consumer_payment_pack.map((id) => id),
              ),
            ),
          );
        },
      },
    );

    this.props.fetchEstablishments();
    this.props.fetchAllEstablishmentBillingGroup();

    this.props.fetchCompatiblePacks(this.props.offerId);

    this.props.resetIncompatibilitiesReasonsByOfferByConsumerPack();

    if (this.props.offer.group) {
      this.props.fetchGroup(
        this.props.offer.group?.id ?? this.props.offer.group,
      );
    }
    this.props.fetchCompanyUserRoles();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !(prevProps.member && prevProps.member.id) ||
      (prevProps.member &&
        prevProps.member.id &&
        this.props.member &&
        this.props.member.id &&
        prevProps.member.id !== this.props.member.id)
    ) {
      this.props.checkOfferTagEligibility();
    }
  }

  handleLevelList = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  handleFetchNoncompatibleConsumerPackByOfferByMember = () => {
    if (!this.props.hasFetchedNonCompatiblePasses) {
      this.props.fetchNoncompatibleConsumerPackByOfferByMember(
        this.props.offerId,
        this.props.member.id,
        {
          onSuccess: (cppList) => {
            this.props.setHasFetchedNonCompatiblePasses(true);
            const cpp_ids = cppList.map((cpp) => cpp.payment_pack);
            this.props.fetchPaymentPackBulk(cpp_ids);
            this.props.fetchConsumerPaymentPackLinks(
              flatten(
                cppList.map((cpp) =>
                  cpp.src_consumer_payment_pack.map((id) => id),
                ),
              ),
            );
          },
        },
      );
    }
  };

  render() {
    const {
      t,
      onCancel,
      consumerPacksLoading,
      loading,
      member,
      maxoutLoading,
    } = this.props;
    if (!member || !member.id || loading) {
      return (
        <GenericResponsiveDialog
          onClose={this.props.onClose}
          open
          fullScreenBreakpoint="md"
        >
          <LinearProgress />
          <DialogContent>
            {!!this.props.member.photo && (
              <Avatar size="large" user={{ photo: this.props.member.photo }} />
            )}
            <Typography variant="h4" align="center">
              {this.props.member?.name ?? ''}
            </Typography>
            <Typography variant="h6" align="center">
              {t('offerManagement.forms.register.registerToOffer')}
            </Typography>
            <div className={this.props.classes.centeredLoadingContainer}>
              <Typography variant="h5" color="textSecondary">
                {t('offerManagement.forms.register.loadingData')}
              </Typography>
            </div>
          </DialogContent>
        </GenericResponsiveDialog>
      );
    }

    const hasGroup = this.props.offer.group;

    return (
      <>
        <GenericResponsiveDrawer
          onClose={this.props.onClose}
          open
          fullScreenBreakpoint="md"
          title={t('offerManagement.forms.register.registerToOffer')}
        >
          {(consumerPacksLoading || maxoutLoading) && <LinearProgress />}
          <DialogContent>
            <div className={this.props.classes.container}>
              {!!this.props.member.photo && (
                <Avatar
                  size="large"
                  user={{ photo: this.props.member.photo }}
                />
              )}
              <Typography variant="h4" align="center">
                {this.props.member.name}
              </Typography>
              {hasGroup && (
                <>
                  <Alert severity="error" variant="outlined">
                    {t('offerManagement.forms.register.groupWarning', {
                      name: this.props.offer.group?.name,
                    })}
                  </Alert>
                </>
              )}
              <Divider />
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.props.keep_credits}
                      onChange={(ev) =>
                        this.props.setKeepCredits(ev.target.checked)
                      }
                      value="checkedG"
                    />
                  }
                  label={this.props.t(
                    'offerManagement.forms.register.doNotConsumeCredit',
                  )}
                />
                <FormControlLabel
                  label={this.props.t(
                    'offerManagement.forms.register.forceNotify',
                  )}
                  control={
                    <Checkbox
                      checked={this.props.notify_member}
                      onChange={(ev) =>
                        this.props.setNotifyMember(ev.target.checked)
                      }
                      value="checkedG"
                    />
                  }
                />
              </div>
              <Divider />
              {!!this.props.registererObject.consumerPaymentPack && (
                <ConsumerPackRowItem
                  hideConsumer
                  paymentPack={
                    this.props.registererObject.consumerPaymentPack.payment_pack
                  }
                  consumerPack={this.props.registererObject.consumerPaymentPack}
                />
              )}
              {!this.props.offer.room_blueprint && !this.props.offer.group && (
                <div className={this.props.classes.bookButtonWideContainer}>
                  {!hasGroup && (
                    <Button
                      className={this.props.classes.bookButtonWide}
                      disabled={
                        !this.props.consumerPacks ||
                        this.props.consumerPacks.length === 0
                      }
                      variant="outlined"
                      onClick={() => this.props.openRecurrenceRuleForm()}
                    >
                      {t('booking:recurrenceRule.recurrentRuleBooking')}
                    </Button>
                  )}
                  {(!this.props.consumerPacks ||
                    this.props.consumerPacks.length === 0) && (
                    <Tooltip
                      title={t('booking:recurrenceRule.needConsumerPack')}
                    >
                      <InfoOutlinedIcon className={this.props.classes.icon} />
                    </Tooltip>
                  )}
                </div>
              )}
              {!!this.props.registererObject.paymentPack && (
                <PaymentPackListItem
                  showDuration
                  hidePacksNumber
                  pack={this.props.registererObject.paymentPack}
                />
              )}
              {this.props.step === REGISTER_METHOD_CHOICE && (
                <BookingModuleRegisterMethodChoice
                  compatiblePacks={this.props.compatiblePacks}
                  consumerPacksNonCompatible={
                    this.props.consumerPacksNonCompatible
                  }
                  consumerPacks={this.props.consumerPacks}
                  consumerPacksOrMaxoutLoading={
                    consumerPacksLoading || maxoutLoading
                  }
                  onBookMultiple={this.props.setRegistererObject}
                  registerToOffer={(
                    registererObject,
                    voucher?,
                    billingEstablishmentId?,
                  ) =>
                    this.props.registerToOffer(
                      this.props.offerId,
                      registererObject,
                      voucher,
                      billingEstablishmentId,
                    )
                  }
                  offer={this.props.offer}
                  cppMaxoutBookingsByCpp={this.props.cppMaxoutBookingsByCpp}
                  disableMultiBooking={
                    !!this.props.offer.room_blueprint || hasGroup
                  }
                  establishments={this.props.establishments}
                  enableMultiLocalization={
                    this.props.companyTheme.enable_multi_localization
                  }
                  member={this.props.member}
                  memberDetails={this.props.memberDetails}
                  closeDialog={this.props.onCancel}
                  isNotAllowedToOverbook={
                    !this.props.userRole?.has_booking_override_control
                  }
                  containerHasFetchedNonCompatiblePasses={
                    this.props.hasFetchedNonCompatiblePasses
                  }
                  handleFetchNoncompatibleConsumerPackByOfferByMember={
                    this.handleFetchNoncompatibleConsumerPackByOfferByMember
                  }
                  nonCompatibleByOfferByMemberLoading={
                    this.props.nonCompatibleByOfferByMemberLoading
                  }
                  fetchIncompatibilitiesReasonsByOfferByConsumerPack={
                    this.props
                      .fetchIncompatibilitiesReasonsByOfferByConsumerPack
                  }
                  incompatibilitiesReasons={this.props.incompatibilitiesReasons}
                  goToPaymentPack={this.props.goToPaymentPack}
                />
              )}
              {this.props.step === OFFER_CHOICE && (
                <BookingModuleOfferChoice
                  fetchSimilarOffers={this.props.fetchSimilarOffers}
                  fetchLevelList={this.handleLevelList}
                  similarOfferLoading={this.props.similarOfferLoading}
                  similarOffers={this.props.similarOffers}
                  offer={this.props.offer}
                  registererObject={this.props.registererObject}
                  offerId={this.props.offerId}
                  goBack={this.props.backToRegistererChoice}
                  registerToOffer={this.props.registerToOffer}
                />
              )}
              <Button variant="outlined" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            </div>
          </DialogContent>
        </GenericResponsiveDrawer>
        <BookerModuleWarningTagDialog
          open={this.props.tagWarningDialogOpen}
          onConfirm={() => this.props.setTagWarningDialogOpen(false)}
          onCancel={this.props.onClose}
        />
      </>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  bookButtonWideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'noWrap',
  },
  bookButtonWide: {
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  similarListHeader: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  selectOption: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: 'grey',
    '&:hover': {
      color: 'black',
    },
  },
  noSimilarOfferMessage: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  centeredLoadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(),
  withMobileDialog(),
  withStyles(styles),
  withState('step', 'setStep', REGISTER_METHOD_CHOICE),
  withState('registererObject', 'setRegistererObject', {}),
  withState('notify_member', 'setNotifyMember', false),
  withState('keep_credits', 'setKeepCredits', false),
  withState('memberDetail', 'setMemberDetail', {}),
  withState('tagWarningDialogOpen', 'setTagWarningDialogOpen', false),
  withState(
    'hasFetchedNonCompatiblePasses',
    'setHasFetchedNonCompatiblePasses',
    false,
  ),
  withHandlers({
    backToRegistererChoice:
      ({ setRegistererObject, setStep }) =>
      () => {
        setStep(REGISTER_METHOD_CHOICE);
        setRegistererObject({});
      },
    setRegistererObject:
      ({ setRegistererObject, setStep }) =>
      (object) => {
        setRegistererObject(object);
        setStep(OFFER_CHOICE);
      },
  }),
  withHandlers({
    registerToOffer:
      ({
        registerToOffer,
        notify_member,
        keep_credits,
        registererObject,
        member,
      }) =>
      (
        offerId,
        registererObjectOverride,
        voucher?,
        billingEstablishmentId?,
      ) => {
        registerToOffer(
          member.id,
          offerId,
          registererObjectOverride || registererObject,
          {
            notify_member,
            keep_credits,
          },
          voucher,
          billingEstablishmentId,
        );
      },
  }),
  withProps(
    ({
      fetchByOfferByMemberAction,
      fetchMemberAction,
      fetchPaymentPackBulk,
      fetchConsumerPaymentPackMaxoutBooking,
    }) => ({
      fetchByOfferByMemberAction: (
        offer,
        member,
        options: OptionCallback<ConsumerPaymentPack[]>,
      ) => {
        fetchByOfferByMemberAction(offer, member, {
          onSuccess: (customerPaymentPacks) => {
            if (options && options.onSuccess) {
              options.onSuccess(customerPaymentPacks);
            }
            const pp_ids = customerPaymentPacks.map((cpp) => cpp.payment_pack);
            const cpp_ids = customerPaymentPacks.map((cpp) => cpp.id);
            fetchPaymentPackBulk(pp_ids);
            fetchConsumerPaymentPackMaxoutBooking(cpp_ids);
          },
        });
        fetchMemberAction(member);
      },
    }),
  ),
  withProps(
    ({
      checkOfferTagEligibilityAction,
      offerId,
      member,
      setTagWarningDialogOpen,
    }) => ({
      checkOfferTagEligibility: () => {
        if (member && member.id) {
          checkOfferTagEligibilityAction(
            offerId,
            { member_id: member.id },
            {
              onSuccess: () => setTagWarningDialogOpen(false),
              onError: () => setTagWarningDialogOpen(true),
            },
          );
        }
      },
    }),
  ),
  withHandlers({
    goToPaymentPack:
      ({ pushRouter }) =>
      (consumerPackId) => {
        pushRouter(`/payment-pack/${consumerPackId}`);
      },
  }),
)(BookerModuleManager);
