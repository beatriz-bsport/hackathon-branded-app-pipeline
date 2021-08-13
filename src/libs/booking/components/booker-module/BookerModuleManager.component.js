// @flow
import React, { PureComponent } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState, withHandlers, withProps } from 'recompose';
import Divider from '@material-ui/core/Divider';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';

import Avatar from '../../../../components/Avatar.component';
import Tooltip from '../../../../components/Tooltip.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '../../../consumer-payment-pack/components/ConsumerPackRowItem.component';

import BookingModuleRegisterMethodChoice from './BookingModuleRegisterMethodChoice.component';
import BookingModuleOfferChoice from './BookingModuleOfferChoice.component';
import { MaxoutBooking } from '../../../consumer-payment-pack/types';

type Props = {
  loading: boolean,
  consumerPacksLoading: boolean,
  offerId: number,
  offer: ?Offer,
  compatiblePacks: Array<PaymentPack>,
  consumerPacks: Array<ConsumerPaymentPack>,
  consumerPacksNonCompatible: Array<ConsumerPaymentPack>,
  keep_credits: boolean,
  notify_member: boolean,
  setNotifyMember: () => void,
  setKeepCredits: () => void,
  onCancel: () => void,
  member: ({ name: string, id: number, photo: ?string }) => void,

  similarOffers: Array<Offer>,
  similarOfferLoading: boolean,
  fetchSimilarOffers: () => void,
  registererObject: {
    paymentPack?: PaymentPack,
    consumerPaymentPack?: ConsumerPaymentPack,
  },
  fetchByOfferByMemberAction: () => void,
  fetchPaymentPackBulk: (Array<number>) => void,
  fetchNoncompatibleConsumerPackByOfferByMember: (
    offerId: number,
    memberId: number,
    options: OptionCallback,
  ) => void,
  step: number,
  setRegistererObject: ({
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
  ) => void,

  backToRegistererChoice: () => void,
  t: TFunction,
  fullScreen: boolean,
  onClose: () => void,
  classes: Object,
  openRecurrenceRuleForm: () => void,
  maxoutLoading: boolean,
  cppMaxoutBookingsByCpp: { [key: string]: MaxoutBooking },
};

const REGISTER_METHOD_CHOICE = 0;
const OFFER_CHOICE = 1;

export class BookingModuleManager extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchByOfferByMemberAction(
      this.props.offerId,
      this.props.member.id,
    );
    this.props.fetchNoncompatibleConsumerPackByOfferByMember(
      this.props.offerId,
      this.props.member.id,
      {
        onSuccess: (cppList) => {
          const cpp_ids = cppList.map((cpp) => cpp.payment_pack);
          this.props.fetchPaymentPackBulk(cpp_ids);
        },
      },
    );
  }

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
    return (
      <Dialog
        fullScreen={this.props.fullScreen}
        onClose={this.props.onClose}
        open
      >
        <DialogContent>
          <div className={this.props.classes.container}>
            {!!this.props.member.photo && (
              <Avatar size="large" user={{ photo: this.props.member.photo }} />
            )}
            <Typography variant="h4" align="center">
              {this.props.member.name}
            </Typography>
            <Typography variant="h6" align="center">
              {t('offerManagement.forms.register.registerToOffer')}
            </Typography>
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
            {!this.props.offer.room_blueprint && (
              <div className={this.props.classes.bookButtonWideContainer}>
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
                {(!this.props.consumerPacks ||
                  this.props.consumerPacks.length === 0) && (
                  <Tooltip title={t('booking:recurrenceRule.needConsumerPack')}>
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
                registerToOffer={(registererObject, voucher?) =>
                  this.props.registerToOffer(
                    this.props.offerId,
                    registererObject,
                    voucher,
                  )
                }
                offer={this.props.offer}
                cppMaxoutBookingsByCpp={this.props.cppMaxoutBookingsByCpp}
                disableMultiBooking={!!this.props.offer.room_blueprint}
              />
            )}
            {this.props.step === OFFER_CHOICE && (
              <BookingModuleOfferChoice
                fetchSimilarOffers={this.props.fetchSimilarOffers}
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
});

export default compose(
  withTranslation(),
  withMobileDialog(),
  withStyles(styles),
  withState('step', 'setStep', REGISTER_METHOD_CHOICE),
  withState('registererObject', 'setRegistererObject', {}),
  withState('notify_member', 'setNotifyMember', false),
  withState('keep_credits', 'setKeepCredits', false),
  withHandlers({
    backToRegistererChoice: ({ setRegistererObject, setStep }) => () => {
      setStep(REGISTER_METHOD_CHOICE);
      setRegistererObject({});
    },
    setRegistererObject: ({ setRegistererObject, setStep }) => (object) => {
      setRegistererObject(object);
      setStep(OFFER_CHOICE);
    },
  }),
  withHandlers({
    registerToOffer: ({
      registerToOffer,
      notify_member,
      keep_credits,
      registererObject,
      member,
    }) => (offerId, registererObjectOverride, voucher?) => {
      registerToOffer(
        member.id,
        offerId,
        registererObjectOverride || registererObject,
        {
          notify_member,
          keep_credits,
        },
        voucher,
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
)(BookingModuleManager);
