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

import Avatar from '#src/components/Avatar.component';
import Tooltip from '#src/components/Tooltip.component';
import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '#src/libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import {
  ConsumerPaymentPack,
  MaxoutBooking,
} from '#src/libs/consumer-payment-pack/types';
import BookingModuleRegisterMethodChoice from './BookingModuleRegisterMethodChoice.component';
import BookingModuleOfferChoice from './BookingModuleOfferChoice.component';
import BookerModuleWarningTagDialog from './BookerModuleWarningTagDialog.component';

import type { WithIsSharedActive } from '../../../relationship/types';
import type { EstablishmentBillingGroup } from '../../../establishment/types';
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
  offer?: Offer,
  compatiblePacks: Array<PaymentPack>,
  consumerPacks: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  consumerPacksNonCompatible: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  keep_credits: boolean,
  notify_member: boolean,
  setNotifyMember: () => void,
  setKeepCredits: () => void,
  onCancel: () => void,
  member: { name: string, id: number, photo?: string },
  similarOffers: Array<Offer>,
  similarOfferLoading: boolean,
  similarOfferGroup: Array<Offer>,
  similarOfferGroupLoading: boolean,
  fetchAssociatedOffers: () => void,
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
    voucherReason?: string,
    establishmentBillingGroupId?: number,
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
  establishmentBillingGroups: EstablishmentBillingGroup[],
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
  isAutoBooking: boolean,
  fetchFutureBookingsByMember: (memberId: number) => void,
  futureBookingsByMemberCount: number,
  isInvoiceConfigurationLoading: boolean,
  isCustomDiscountReasonRequired: boolean,
};

const REGISTER_METHOD_CHOICE = 0;
const OFFER_CHOICE = 1;

type State = {
  isNotifyClientPreselected: boolean,
};

export class BookerModuleManager extends PureComponent<Props, State> {
  state = {
    isNotifyClientPreselected: false,
  };

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

    this.props.fetchFutureBookingsByMember(this.props.member.id);

    this.props.fetchEstablishments();
    if (
      this.props.companyTheme.enable_multi_localization &&
      !!this.props.companyId
    ) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.companyId },
      });
    }
    this.props.fetchCompatiblePacks(this.props.offerId);

    this.props.resetIncompatibilitiesReasonsByOfferByConsumerPack();

    if (this.props.offer.group) {
      this.props.fetchGroup(
        this.props.offer.group?.id ?? this.props.offer.group,
      );
    }
    this.props.fetchCompanyUserRoles();
    this.setState({ isNotifyClientPreselected: this.props.isAutoBooking });
  }

  componentDidUpdate(prevProps: Props) {
    const isAnotherMember =
      prevProps.member &&
      prevProps.member.id &&
      this.props.member &&
      this.props.member.id &&
      prevProps.member.id !== this.props.member.id;
    if (!(prevProps.member && prevProps.member.id) || isAnotherMember) {
      this.props.checkOfferTagEligibility();
    }
    if (isAnotherMember) {
      this.props.fetchByOfferByMemberAction(
        this.props.offerId,
        this.props.member.id,
        {
          onSuccess: (consumerPaymentPacks) => {
            if (
              consumerPaymentPacks.length === 0 ||
              prevProps.consumerPacksNonCompatible.length
            ) {
              this.props.setHasFetchedNonCompatiblePasses(false, () =>
                this.handleFetchNoncompatibleConsumerPackByOfferByMember(),
              );
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
      isInvoiceConfigurationLoading,
    } = this.props;
    if (!member || !member.id || loading || isInvoiceConfigurationLoading) {
      return (
        <GenericResponsiveDialog
          open
          fullScreenBreakpoint="md"
          onClose={this.props.onClose}
        >
          <LinearProgress />
          <DialogContent>
            {!!this.props.member.photo && (
              <Avatar size="large" user={{ photo: this.props.member.photo }} />
            )}
            <Typography align="center" variant="h4">
              {this.props.member?.name ?? ''}
            </Typography>
            <Typography align="center" variant="h6">
              {t('offerManagement.forms.register.registerToOffer')}
            </Typography>
            <div className={this.props.classes.centeredLoadingContainer}>
              <Typography color="textSecondary" variant="h5">
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
          open
          fullScreenBreakpoint="md"
          onClose={this.props.onClose}
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
              <Typography align="center" variant="h4">
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
              {!!this.props.companyTheme.max_future_booking &&
                this.props.futureBookingsByMemberCount >=
                  this.props.companyTheme.max_future_booking && (
                  <Typography align="center" color="error" variant="body1">
                    {t('offerManagement.forms.register.bookingLimitReached')}
                  </Typography>
                )}
              <Divider />
              <div>
                <ObjectLevelPermissionWrapper
                  forcedBehavior="hidden"
                  requiredPermission="product.paymentPack.allowed_actions.manageCredit"
                >
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
                </ObjectLevelPermissionWrapper>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        this.props.notify_member ||
                        this.state.isNotifyClientPreselected
                      }
                      onChange={(ev) => {
                        this.setState({ isNotifyClientPreselected: false });
                        this.props.setNotifyMember(ev.target.checked);
                      }}
                      value="checkedG"
                    />
                  }
                  label={this.props.t(
                    'offerManagement.forms.register.forceNotify',
                  )}
                />
              </div>
              <Divider />
              {!!this.props.registererObject.consumerPaymentPack && (
                <ConsumerPackRowItem
                  hideConsumer
                  consumerPack={this.props.registererObject.consumerPaymentPack}
                  paymentPack={
                    this.props.registererObject.consumerPaymentPack.payment_pack
                  }
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
                      onClick={() => this.props.openRecurrenceRuleForm()}
                      variant="outlined"
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
                  hidePacksNumber
                  showDuration
                  pack={this.props.registererObject.paymentPack}
                />
              )}
              {this.props.step === REGISTER_METHOD_CHOICE && (
                <BookingModuleRegisterMethodChoice
                  closeDialog={this.props.onCancel}
                  compatiblePacks={this.props.compatiblePacks}
                  consumerPacks={this.props.consumerPacks}
                  consumerPacksNonCompatible={
                    this.props.consumerPacksNonCompatible
                  }
                  consumerPacksOrMaxoutLoading={
                    consumerPacksLoading || maxoutLoading
                  }
                  containerHasFetchedNonCompatiblePasses={
                    this.props.hasFetchedNonCompatiblePasses
                  }
                  cppMaxoutBookingsByCpp={this.props.cppMaxoutBookingsByCpp}
                  disableMultiBooking={
                    !!this.props.offer.room_blueprint ||
                    this.props.isAutoBooking
                  }
                  enableMultiLocalization={
                    this.props.companyTheme.enable_multi_localization
                  }
                  establishmentBillingGroups={
                    this.props.establishmentBillingGroups
                  }
                  fetchIncompatibilitiesReasonsByOfferByConsumerPack={
                    this.props
                      .fetchIncompatibilitiesReasonsByOfferByConsumerPack
                  }
                  goToPaymentPack={this.props.goToPaymentPack}
                  handleFetchNoncompatibleConsumerPackByOfferByMember={
                    this.handleFetchNoncompatibleConsumerPackByOfferByMember
                  }
                  incompatibilitiesReasons={this.props.incompatibilitiesReasons}
                  isCustomDiscountReasonRequired={
                    this.props.isCustomDiscountReasonRequired
                  }
                  isNotAllowedToOverbook={
                    !this.props.userRole?.has_booking_override_control
                  }
                  member={this.props.member}
                  memberDetails={this.props.memberDetails}
                  nonCompatibleByOfferByMemberLoading={
                    this.props.nonCompatibleByOfferByMemberLoading
                  }
                  offer={this.props.offer}
                  onBookMultiple={this.props.setRegistererObject}
                  registerToOffer={(
                    registererObject,
                    voucher?,
                    voucherReason?,
                    establishmentBillingGroupId?,
                  ) =>
                    this.props.registerToOffer(
                      this.props.offerId,
                      registererObject,
                      voucher,
                      voucherReason,
                      establishmentBillingGroupId,
                    )
                  }
                />
              )}
              {this.props.step === OFFER_CHOICE && (
                <BookingModuleOfferChoice
                  associatedOffers={
                    this.props.offer.group
                      ? this.props.similarOfferGroup
                      : this.props.similarOffers
                  }
                  associatedOffersLoading={
                    this.props.similarOfferLoading ||
                    this.props.similarOfferGroupLoading
                  }
                  fetchAssociatedOffers={this.props.fetchAssociatedOffers}
                  fetchLevelList={this.handleLevelList}
                  goBack={this.props.backToRegistererChoice}
                  offer={this.props.offer}
                  offerId={this.props.offerId}
                  registererObject={this.props.registererObject}
                  registerToOffer={this.props.registerToOffer}
                />
              )}
              <Button onClick={onCancel} variant="outlined">
                {t('common.cancel')}
              </Button>
            </div>
          </DialogContent>
        </GenericResponsiveDrawer>
        <BookerModuleWarningTagDialog
          onCancel={this.props.onClose}
          onConfirm={() => this.props.setTagWarningDialogOpen(false)}
          open={this.props.tagWarningDialogOpen}
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
        voucherReason?,
        establishmentBillingGroupId?,
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
          voucherReason,
          establishmentBillingGroupId,
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
