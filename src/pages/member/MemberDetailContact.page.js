// @flow
import React from 'react';
import { compose, withHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  fetchRecipientBulk as fetchRecipientBulkAction,
  fetchCampaignByMember as fetchCampaignByMemberAction,
} from '../../libs/communication/actions';
import CampaignList from '../../libs/communication/components/CampaignList.component';
import { getCampaignAndRecipientByMember } from '../../libs/communication/selectors';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
// import PaymentMethodManager from '../../libs/payment/component/PaymentMethodManager.component';

import type { Campaign, Recipient } from '../../libs/communication/types';

type Props = {
  loading: boolean,
  nextPage: number,
  fetchCampaignList: (page: number) => void,
  campaignRecipientList: Array<[Campaign, Recipient]>,
  fetchResolvedGenericTags: () => void,
  tagCategories: { [tag_name: string]: string[] },
  resolvedGenericTags: ResolvedGenericTags,
} & WithTranslation;
export class MemberDetailContact extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCampaignList(1);
    this.props.fetchResolvedGenericTags();
  }

  render() {
    return (
      <React.Fragment>
        <CampaignList
          campaignList={
            // eslint-disable-next-line
            this.props.campaignRecipientList.filter(([_, b]) => !!b)
          }
          loading={this.props.loading}
          fetchMore={
            this.props.nextPage && this.props.nextPage > 1
              ? () => this.props.fetchCampaignList(this.props.nextPage)
              : null
          }
          resolvedGenericTags={this.props.resolvedGenericTags}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  connect(
    (state, { id }) => ({
      campaignRecipientList: getCampaignAndRecipientByMember(state, id),
      nextPage: state.communication.campaign.byMember.next_page,
      resolvedGenericTags: getResolvedGenericTags(state),
      loading:
        state.communication.campaign.byMember.loading ||
        state.communication.recipient.bulk.loading,
    }),
    {
      fetchRecipientBulk: fetchRecipientBulkAction,
      fetchCampaignByMember: fetchCampaignByMemberAction,
      fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    },
  ),
  withHandlers({
    fetchCampaignList:
      ({ id, fetchCampaignByMember, fetchRecipientBulk }) =>
      (page) => {
        fetchCampaignByMember(id, page, {
          onSuccess: (campaignList) => {
            fetchRecipientBulk(
              id,
              campaignList.map((c) => c.uuid),
            );
          },
        });
      },
  }),
)(MemberDetailContact);
