// @flow
import React from 'react';
import { compose } from 'recompose';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import CampaignList from '../../libs/communication/components/CampaignList.component';
import { fetchCampaignSmartlist } from '../../libs/communication/actions';
import { getCampaignBySmartlist } from '../../libs/communication/selectors';

type Props = {
  fetchCampaignSmartlist: (page: number) => void,
  goToCampaignReport: (id: number) => void,
  campaignState: Object,
  loading: boolean,
  campaignList: Array<Campaign>,
};

export class SmartListCampaign extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCampaignSmartlist(1);
  }

  render() {
    return (
      <CampaignList
        campaignList={this.props.campaignList.map((c) => [c, null])}
        loading={this.props.loading}
        onClickReport={this.props.goToCampaignReport}
        fetchMore={
          this.props.campaignState.next_page
            ? () =>
                this.props.fetchCampaignSmartlist(
                  this.props.campaignState.next_page,
                )
            : null
        }
      />
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state) => ({
      campaignList: getCampaignBySmartlist(state),
      campaignState: state.communication.campaign.bySmartlist,
      loading: state.communication.campaign.bySmartlist.loading,
    }),
    (dispatch, { id }) => ({
      fetchCampaignSmartlist: (page) =>
        dispatch(fetchCampaignSmartlist(id, page)),
      goToCampaignReport: (campaignId) =>
        dispatch(push(`/smart-list/${id}/campaign/${campaignId}/`)),
    }),
  ),
)(SmartListCampaign);
