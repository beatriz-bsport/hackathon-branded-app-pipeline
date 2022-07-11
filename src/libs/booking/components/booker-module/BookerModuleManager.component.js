// @flow
import React, { PureComponent } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation, TFunction } from 'react-i18next';
import { compose, withState, withHandlers, withProps } from 'recompose';
import Divider from '@material-ui/core/Divider';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { Alert } from '@material-ui/lab';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Radio from '@material-ui/core/Radio';
// import Collapse from '@material-ui/core/Collapse';
// import ButtonBase from '@material-ui/core/ButtonBase';
// import List from '@material-ui/core/List';

import flatten from 'lodash/flatten';
import Avatar from '../../../../components/Avatar.component';
import Tooltip from '../../../../components/Tooltip.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '../../../consumer-payment-pack/components/ConsumerPackRowItem.component';

import BookingModuleRegisterMethodChoice from './BookingModuleRegisterMethodChoice.component';
import BookingModuleOfferChoice from './BookingModuleOfferChoice.component';
import {
  ConsumerPaymentPack,
  MaxoutBooking,
} from '../../../consumer-payment-pack/types';
import { WithIsSharedActive } from '../../../relationship/types';

import type { Establishment } from '../../../establishment/types';
import type { Theme as CompanyTheme } from '../../../theme/types';
import type { OptionCallback } from '../../../../state/types';
import BookerModuleWarningTagDialog from './BookerModuleWarningTagDialog.component';
import { Role } from '#libs/role/types';
// import OfferListItem from '#libs/offer/components/OfferListItemV2.component';

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
  fetchByOfferByMemberAction: () => void,
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
  fullScreen: boolean,
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
  // similarOfferGroup: Offer[],
  // isBookingSimilarGroup: boolean,
  // setIsBookingSimilarGroup: (value: boolean) => void,
  // selectedSimilarGroupOfferIds: number[],
  // setSelectedSimilarGroupOfferIds: (value: number[]) => void,
  // fetchOffersInGroup: (id: number) => void,
  fetchCompatiblePacks: (offerId: number) => void,
  userRole: Role,
  fetchCompanyUserRoles: () => void,
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
        onSuccess: (cppList) => {
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
    this.props.fetchNoncompatibleConsumerPackByOfferByMember(
      this.props.offerId,
      this.props.member.id,
      {
        onSuccess: (cppList) => {
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
    this.props.fetchEstablishments();
    this.props.fetchAllEstablishmentBillingGroup();

    this.props.fetchCompatiblePacks(this.props.offerId);

    if (this.props.offer.group) {
      // this.props.fetchOffersInGroup(
      //   this.props.offer.group?.id ?? this.props.offer.group,
      //   {
      //     onSuccess: (offers) => {
      //       this.props.setIsBookingSimilarGroup('true');
      //       this.props.setSelectedSimilarGroupOfferIds(offers.map((o) => o.id));
      //     },
      //   },
      // );

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

  render() {
    const {
      t,
      onCancel,
      consumerPacksLoading,
      loading,
      member,
      maxoutLoading,
    } = this.props;
    if (
      !member ||
      !member.id ||
      loading ||
      consumerPacksLoading ||
      maxoutLoading
    ) {
      return (
        <Dialog
          fullScreen={this.props.fullScreen}
          onClose={this.props.onClose}
          open
        >
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      );
    }

    const hasGroup = this.props.offer.group;

    return (
      <>
        <Dialog
          fullScreen={this.props.fullScreen}
          onClose={this.props.onClose}
          open
        >
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
              <Typography variant="h6" align="center">
                {t('offerManagement.forms.register.registerToOffer')}
              </Typography>
              {hasGroup && (
                <>
                  <Alert severity="error" variant="outlined">
                    {t('offerManagement.forms.register.groupWarning', {
                      name: this.props.offer.group?.name,
                    })}
                  </Alert>
                  {/* <RadioGroup
                    value={this.props.isBookingSimilarGroup}
                    onChange={(_, value) => {
                      this.props.setIsBookingSimilarGroup(value);
                    }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label={t(
                        'offerManagement.forms.register.bookMoreInGroup',
                      )}
                    />
                    <Collapse in={this.props.isBookingSimilarGroup === 'true'}>
                      <ButtonBase
                        onClick={() =>
                          this.props.setSelectedSimilarGroupOfferIds(
                            this.props.similarOfferGroup
                              .filter((o) => o.id !== this.props.offer.id)
                              .map((o) => o.id),
                          )
                        }
                        className={this.props.classes.selectOption}
                      >
                        <Typography variant="caption">
                          {t('offer:liveOfferEdit.selectAll')}
                        </Typography>
                      </ButtonBase>
                      <ButtonBase
                        onClick={() =>
                          this.props.setSelectedSimilarGroupOfferIds([])
                        }
                        className={this.props.classes.selectOption}
                      >
                        <Typography variant="caption">
                          {t('offer:liveOfferEdit.unselectAll')}
                        </Typography>
                      </ButtonBase>
                      {!(this.props.similarOfferGroup || []).length ? (
                        <div
                          className={this.props.classes.noSimilarOfferMessage}
                        >
                          <Typography variant="body">
                            {t('offer:liveOfferEdit.noSimilarOffer')}
                          </Typography>
                        </div>
                      ) : (
                        <List component="nav">
                          <OfferListItem
                            similarOffer
                            offer={this.props.offer}
                            handleChange={() => {}}
                            disabled
                            checked
                          />
                          {this.props.similarOfferGroup.map((so) => (
                            <OfferListItem
                              key={so.id}
                              similarOffer
                              offer={so}
                              handleChange={() => {
                                const indexOf =
                                  this.props.selectedSimilarGroupOfferIds.indexOf(
                                    so.id,
                                  );
                                if (indexOf === -1) {
                                  this.props.setSelectedSimilarGroupOfferIds([
                                    ...this.props.selectedSimilarGroupOfferIds,
                                    so.id,
                                  ]);
                                  return;
                                }
                                this.props.setSelectedSimilarGroupOfferIds([
                                  ...this.props.selectedSimilarGroupOfferIds.splice(
                                    0,
                                    indexOf,
                                  ),
                                  ...this.props.selectedSimilarGroupOfferIds.splice(
                                    indexOf + 1,
                                  ),
                                ]);
                              }}
                              checked={this.props.selectedSimilarGroupOfferIds.includes(
                                so.id,
                              )}
                            />
                          ))}
                        </List>
                      )}
                    </Collapse>
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label={t(
                        'offerManagement.forms.register.bookSingleInGroup',
                      )}
                    />
                  </RadioGroup> */}
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
        </Dialog>
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
  // withState('isBookingSimilarGroup', 'setIsBookingSimilarGroup', 'false'),
  // withState(
  //   'selectedSimilarGroupOfferIds',
  //   'setSelectedSimilarGroupOfferIds',
  //   [],
  // ),
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
      fetchByOfferByMemberAction: (offer, member) => {
        fetchByOfferByMemberAction(offer, member, {
          onSuccess: (cppList) => {
            const pp_ids = cppList.map((cpp) => cpp.payment_pack);
            const cpp_ids = cppList.map((cpp) => cpp.id);
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
)(BookerModuleManager);
