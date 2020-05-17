// @flow
import React, { PureComponent } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import WarningIcon from '@material-ui/icons/Warning';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ConsumerPackRowItem from '../../libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import {
  fetchByOfferByMember,
  fetchNonCompatibleByOfferByMember,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk } from '../../libs/payment-packs/actions';
import {
  withPaymentPack,
  getByOfferByMember,
  getNonCompatibleByOfferByMember,
} from '../../libs/consumer-payment-pack/selectors';
import { fetchMember } from '../../libs/member/actions';

import PaymentPackSummary from '../../components/payment-pack/PaymentPackSummary.component';

type Props = {
  loading: boolean,
  consumerPacksLoading: boolean,

  memberId: Member,
  memberName: string,
  offerId: number,
  compatiblePacks: Array<PaymentPack>,
  consumerPacks: Array<ConsumerPaymentPack>,
  consumerPacksNonCompatible: Array<ConsumerPaymentPack>,
  keep_credits: boolean,
  notify_member: boolean,
  changeNotifyMemberOption: () => void,
  changeKeepCreditsOption: () => void,
  onCancel: () => void,
  fetchConsumerPackByOfferByMember: (offerId: number, memberId: number) => void,
  subscribeToPackAndOffer: (paymentPackId: number) => void,
  subscribeToOffer: (id: number) => void,

  fetchPaymentPackBulk: (Array<number>) => void,
  fetchNoncompatibleConsumerPackByOfferByMember: (
    offerId: number,
    memberId: number,
    options: OptionCallback,
  ) => void,
  fetchConsumerPackByOfferByMember: (
    offerId: number,
    memberId: number,
    options: OptionCallback,
  ) => void,

  t: TFunction,
};

export class RegisterMemberToOfferForm extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchConsumerPackByOfferByMember(
      this.props.offerId,
      this.props.memberId,
      {
        onSuccess: (cppList) =>
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp) => cpp.payment_pack),
          ),
      },
    );
    this.props.fetchNoncompatibleConsumerPackByOfferByMember(
      this.props.offerId,
      this.props.memberId,
      {
        onSuccess: (cppList) =>
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp) => cpp.payment_pack),
          ),
      },
    );
  }

  renderWarning = (text: string) => (
    <Grid container direction="row" spacing={3}>
      <Grid item>
        <WarningIcon color="error" />
      </Grid>
      <Grid item>
        <Typography>{text}</Typography>
      </Grid>
    </Grid>
  );

  renderPaymentPacks = () => {
    const { compatiblePacks, t } = this.props;
    if (!compatiblePacks.length) {
      return this.renderWarning(t('offer.noPackAvailableForOfferPurchase'));
    }
    return (
      <List>
        {compatiblePacks
          .filter((pack) => !pack.disabled)
          .map((pack) => (
            <PaymentPackSummary
              buyButton={
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => this.props.subscribeToPackAndOffer(pack.id)}
                >
                  {t('offer.bill')}
                </Button>
              }
              key={pack.id}
              paymentPack={pack}
              hideConsumer
            />
          ))}
      </List>
    );
  };

  renderConsumerPacks = () => {
    const { consumerPacks, t, subscribeToOffer } = this.props;
    if (!consumerPacks.length) {
      return (
        <div>
          {this.renderWarning(t('offer.noConsumerPackAvailableForPurchase'))}
          {this.props.consumerPacksNonCompatible.length > 0 && (
            <Typography variant="h6" component="h4">
              {t('offer.noncompatibleConsumerPaymentPacksAre')}
            </Typography>
          )}
          {this.props.consumerPacksNonCompatible.map((cp) => (
            <ConsumerPackRowItem
              key={cp.id}
              hideConsumer
              isNonCompatible
              paymentPack={cp.payment_pack}
              consumerPack={cp}
            />
          ))}
        </div>
      );
    }
    return (
      <List>
        {this.props.consumerPacks.map((cp) => (
          <ConsumerPackRowItem
            key={cp.id}
            hideConsumer
            subscribeToOffer={subscribeToOffer}
            consumerPack={cp}
            paymentPack={cp.payment_pack}
          />
        ))}
      </List>
    );
  };

  renderKeepCredit = () => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={this.props.keep_credits}
            onChange={this.props.changeKeepCreditsOption}
            value="checkedG"
          />
        }
        label={
          // eslint-disable-next-line
          "Ne pas décompter de crédits aux membres pour l'inscription"
        }
      />
    );
  };

  renderNotify = () => {
    return (
      <FormControlLabel
        label={this.props.t('offerManagement.forms.register.forceNotify')}
        control={
          <Checkbox
            checked={this.props.notify_member}
            onChange={this.props.changeNotifyMemberOption}
            value="checkedG"
          />
        }
      />
    );
  };

  render() {
    const {
      t,
      onCancel,
      memberId,
      consumerPacksLoading,
      loading,
      memberName,
    } = this.props;
    if (!memberId || loading || consumerPacksLoading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography variant="h4" align="center">
            {memberName}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" align="center">
            {t('offerManagement.forms.register.registerToOffer')}
          </Typography>
        </Grid>
        <Divider />
        <Grid item>
          <div>
            {this.renderKeepCredit()}
            {this.renderNotify()}
          </div>
        </Grid>

        <Grid item>
          <Typography variant="h6" component="h4">
            {t('offerManagement.forms.register.passOwnedByMember')}
          </Typography>
        </Grid>
        <Grid item>{this.renderConsumerPacks()}</Grid>
        <Grid item>
          <Typography variant="h6" component="h4">
            {t('offerManagement.forms.register.passCompatibleNotOwnedByMember')}
          </Typography>
        </Grid>
        <Grid item>{this.renderPaymentPacks()}</Grid>
        <Grid item>
          <Button variant="outlined" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withNamespaces(),
  connect(
    (state) => ({
      consumerPacksLoading: state.consumerPaymentPack.byOfferByMember.loading,
      consumerPacks: withPaymentPack(getByOfferByMember)(state),
      consumerPacksNonCompatible: withPaymentPack(
        getNonCompatibleByOfferByMember,
      )(state),
    }),
    {
      fetchConsumerPackByOfferByMember: fetchByOfferByMember,
      fetchPaymentPackBulk,
      fetchNoncompatibleConsumerPackByOfferByMember: fetchNonCompatibleByOfferByMember,
      fetchByOfferByMemberAction: fetchByOfferByMember,
      fetchMemberAction: fetchMember,
    },
  ),
  withProps(({ fetchByOfferByMemberAction, fetchMemberAction }) => ({
    fetchConsumerPackByOfferByMember: (offer, member) => {
      fetchByOfferByMemberAction(offer, member);
      fetchMemberAction(member);
    },
  })),
)(RegisterMemberToOfferForm);
