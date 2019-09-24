// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import { compose, withProps, withState } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import _ from 'lodash';
import DialogContent from '@material-ui/core/DialogContent';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import MemberRelationList from '../../libs/relationship/components/MemberRelationList.component';
import RelationSummary from '../../libs/relationship/components/RelationSummary.component';
import RelationForm from '../../libs/relationship/components/RelationForm.component';
import { fetchByMember as fetchConsumerPackByMemberAction } from '../../actions/consumer-payment-pack.actions';
import { fetchAll as fetchAllPaymentPacksAction } from '../../actions/paymentPack.actions';
import { getConsumerPacksWithPaymentPack } from '../../libs/consumer-payment-pack/selectors';
import ConsumerPackLinkForm from '../../libs/relationship/components/ConsumerPackLinkForm.component';
import ConsumerPassLinkingDeleteDialog from '../../libs/relationship/components/ConsumerPassLinkingDeleteDialog.component';
import ConsumerPassRelinkDialog from '../../libs/relationship/components/ConsumerPassRelinkDialog.component';
import withTitle from '../../hocs/with-title.hoc';
import {
  getMemberRelations,
  getMemberRelationById,
  getSharedConsumerPacksByRelation,
} from '../../libs/relationship/selectors';
import {
  fetchFilteredMembers,
  fetchMember,
  search as searchMembers,
} from '../../libs/member/actions';
import {
  fetchMemberRelations,
  fetchSharedConsumerPaymentPacks as fetchSharedConsumerPaymentPacksAction,
  linkToMemberRelation as linkConsumerPackToMemberRelationAction,
  createOrUpdateRelation,
  unlinkConsumerPaymentPackLink as unlinkConsumerPaymentPackLinkAction,
  relinkConsumerPaymentPackLink as relinkConsumerPaymentPackLinkAction,
} from '../../libs/relationship/actions';

type Props = {
  relationList: Array<MemberRelation>,

  selectedRelationId: number,
  fetchMemberRelations: (memberId: number) => void,
  goToRelationDetail: (memberId: number, relationId: number) => void,
  memberId: number,
  relationLoading: boolean,

  classes: Object,
  fetchMemberRelations: (memberId: number) => void,
  openConsumerPaymentPackForm: () => void,
  openConsumerPackLinking: boolean,
  searchMembersLoading: boolean,
  fetchMember: (id: number) => void,
  openRelationFormDialog: (data: *) => void,

  fetchAllPaymentPacks: () => void,
  fetchConsumerPacks: (memberId: number) => void,
  fetchSharedConsumerPaymentPacks: (relationId: number) => void,
  fetchFilteredMembers: (queryParams: *) => void,
  createOrUpdateRelation: (data: *) => void,
  goToMember: (id: number) => void,
  requestUnlinkPassLinking: (id: number) => void,
  requestRelinkPassLinking: (id: number) => void,
  consumerPassLinkToDelete: ?number,
  unlinkPassLinking: (id: number) => void,
  consumerPassLinkToRelink: number,
  relinkPassLinking: (id: number) => void,
  cancelUnlinkRequest: () => void,
  cancelRelinkRequest: () => void,

  setOpenRelationFormDialog: (data: *) => void,
  setOpenConsumerPackLinking: (boolean) => void,
  consumerPacks: Array<ConsumerPack>,
  member: Member,
  selectedRelation: ?MemberRelation,
  sharedConsumerPaymentPackLinks: Array<ConsumerPackLink>,
  createPassLinking: (data: *) => void,
  passLoading: boolean,
  searchMembers: (string) => void,
  searchedMembers: Array<Member>,
};

export class MemberDetailRelation extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchMember(this.props.memberId);
    this.fetchRelationList();

    this.props.fetchAllPaymentPacks();

    this.props.fetchConsumerPacks(this.props.memberId);
    if (this.props.selectedRelationId) {
      this.props.fetchSharedConsumerPaymentPacks(this.props.selectedRelationId);
    }
  }

  fetchRelationList = () => {
    this.props.fetchMemberRelations(this.props.memberId, {
      onSuccess: (relations) => {
        const member_ids_to_fetch = relations.map((r) => {
          if (r.src_member === this.props.memberId) return r.dst_member;
          return r.src_member;
        });
        this.props.fetchFilteredMembers({ id__in: member_ids_to_fetch });
      },
    });
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.selectedRelationId !== this.props.selectedRelationId &&
      this.props.selectedRelationId
    ) {
      this.props.fetchSharedConsumerPaymentPacks(this.props.selectedRelationId);
    }
  }

  selectRelationId = (relationId: number) => {
    this.props.goToRelationDetail(this.props.memberId, relationId);
  };

  createOrUpdateRelation = (data: *) => {
    this.props.createOrUpdateRelation(data, {
      onSuccess: () => {
        this.fetchRelationList();
        this.props.setOpenRelationFormDialog(null);
      },
    });
  };

  openEditForm = (relation) => {
    this.props.setOpenRelationFormDialog({
      src_member: relation.src_member,
      src_name: relation.src_name,
      dst_name: relation.dst_name,
      dst_member: relation.dst_member,
      id: relation.id,
    });
  };

  render() {
    const relatedMemberIds = _.flatten([
      this.props.relationList.map((r) => r.src_member.id),
      this.props.relationList.map((r) => r.dst_member.id),
    ]);
    const linkedPassIds = _.flatten([
      this.props.sharedConsumerPaymentPackLinks
        .filter((s_cpp) => s_cpp.src)
        .map((s_cpp) => s_cpp.src.id),
      this.props.sharedConsumerPaymentPackLinks
        .filter((s_cpp) => s_cpp.dst)
        .map((s_cpp) => s_cpp.dst.id),
    ]);
    return (
      <Grid container direction="row">
        <Grid item xs={12} md={6}>
          <div className={this.props.classes.panel}>
            <MemberRelationList
              loading={this.props.relationLoading}
              memberId={this.props.memberId}
              relations={this.props.relationList}
              selectedId={this.props.selectedRelationId}
              onClickRelation={this.selectRelationId}
              onEdit={this.openEditForm}
              onDelete={this.setOpenDeleteDialog}
              goToMember={this.props.goToMember}
              onAdd={() => {
                this.props.setOpenRelationFormDialog({
                  src_member: this.props.member,
                });
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={this.props.classes.panel}>
            <RelationSummary
              relation={this.props.selectedRelation}
              consumerPaymentPackLinks={
                this.props.sharedConsumerPaymentPackLinks
              }
              requestPassLinking={this.props.openConsumerPaymentPackForm}
              unlinkPassLinking={this.props.requestUnlinkPassLinking}
              relinkPassLinking={this.props.requestRelinkPassLinking}
            />
          </div>
        </Grid>
        <ConsumerPassLinkingDeleteDialog
          open={!!this.props.consumerPassLinkToDelete}
          onSubmit={this.props.unlinkPassLinking}
          consumerPackLink={this.props.consumerPassLinkToDelete}
          onCancel={this.props.cancelUnlinkRequest}
        />
        <ConsumerPassRelinkDialog
          open={!!this.props.consumerPassLinkToRelink}
          onSubmit={this.props.relinkPassLinking}
          consumerPackLink={this.props.consumerPassLinkToRelink}
          onCancel={this.props.cancelRelinkRequest}
        />
        <Dialog open={this.props.openConsumerPackLinking}>
          <DialogContent>
            <ConsumerPackLinkForm
              consumerPacks={this.props.consumerPacks.filter(
                (cpp) =>
                  !cpp.dst_consumer_payment_pack &&
                  !linkedPassIds.includes(cpp.id),
              )}
              loading={this.props.passLoading}
              onCancel={() => this.props.setOpenConsumerPackLinking(false)}
              onSubmit={this.props.createPassLinking}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={!!this.props.openRelationFormDialog}>
          <DialogContent>
            <RelationForm
              initial={this.props.openRelationFormDialog}
              searchMembers={this.props.searchMembers}
              searchLoading={this.props.searchMembersLoading}
              searchedMembers={this.props.searchedMembers.filter(
                (m) =>
                  m.id !== this.props.memberId &&
                  !relatedMemberIds.includes(m.id),
              )}
              onCancel={() => this.props.setOpenRelationFormDialog(null)}
              onSubmit={this.createOrUpdateRelation}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }
}

const styles = (theme) => ({ panel: { padding: theme.spacing.unit } });

export default compose(
  withStyles(styles),
  routerParamsToProps({
    id: 'memberId:number',
    relation: 'selectedRelationId:number',
  }),
  withState('openConsumerPackLinking', 'setOpenConsumerPackLinking', false),
  withState('openRelationFormDialog', 'setOpenRelationFormDialog', false),
  withState('consumerPassLinkToDelete', 'setConsumerPassLinkToDelete', null),
  withState('consumerPassLinkToRelink', 'setConsumerPassLinkToRelink', null),
  connect(
    (state, { selectedRelationId }) => ({
      relationList: getMemberRelations(state),
      relation: getMemberRelationById(state, selectedRelationId),
      consumerPacks: getConsumerPacksWithPaymentPack(state),
      sharedConsumerPaymentPackLinks: getSharedConsumerPacksByRelation(
        state,
        selectedRelationId,
      ),
      passLoading: state.consumerPaymentPack.byMember.loading,
      member: state.member.member,
      searchedMembers: state.member.search.items,
      searchMembersLoading: state.member.search.loading,
    }),
    {
      fetchMember,
      searchMembers,
      goToMember: (id: number) => push(`/member/${id}`),
      fetchSharedConsumerPaymentPacks: fetchSharedConsumerPaymentPacksAction,
      fetchMemberRelations,
      fetchFilteredMembers,
      linkConsumerPackToMemberRelation: linkConsumerPackToMemberRelationAction,
      fetchAllPaymentPacks: fetchAllPaymentPacksAction,
      createOrUpdateRelation,
      unlinkConsumerPaymentPackLink: unlinkConsumerPaymentPackLinkAction,
      relinkConsumerPaymentPackLink: relinkConsumerPaymentPackLinkAction,
      fetchConsumerPacks: (memberId: number) =>
        fetchConsumerPackByMemberAction(memberId),
      goToRelationDetail: (memberId, relationId) =>
        push(`/member/${memberId}/relation/${relationId}`),
    },
  ),
  withProps(({ selectedRelationId, relationList }) => ({
    selectedRelation: relationList.find((r) => r.id === selectedRelationId),
  })),
  withProps(
    ({
      setOpenConsumerPackLinking,
      setConsumerPassLinkToDelete,
      setConsumerPassLinkToRelink,
      fetchSharedConsumerPaymentPacks,
      selectedRelationId,
      fetchConsumerPacks,
      memberId,
      linkConsumerPackToMemberRelation,
      unlinkConsumerPaymentPackLink,
      relinkConsumerPaymentPackLink,
    }) => ({
      requestRelinkPassLinking: (consumerPackLink: ConsumerPaymentPackLink) => {
        setConsumerPassLinkToRelink(consumerPackLink);
      },
      cancelRelinkRequest: () => {
        setConsumerPassLinkToRelink(null);
      },
      relinkPassLinking: (consumerPackLinkId: number) => {
        relinkConsumerPaymentPackLink(consumerPackLinkId, {
          onSuccess: () => {
            fetchSharedConsumerPaymentPacks(selectedRelationId);
            fetchConsumerPacks(memberId);
            setConsumerPassLinkToRelink(null);
          },
        });
      },
      requestUnlinkPassLinking: (consumerPackLink: ConsumerPaymentPackLink) => {
        setConsumerPassLinkToDelete(consumerPackLink);
      },
      cancelUnlinkRequest: () => {
        setConsumerPassLinkToDelete(null);
      },
      unlinkPassLinking: (consumerPackLinkId: number) => {
        unlinkConsumerPaymentPackLink(consumerPackLinkId, {
          onSuccess: () => {
            fetchSharedConsumerPaymentPacks(selectedRelationId);
            fetchConsumerPacks(memberId);
            setConsumerPassLinkToDelete(null);
          },
        });
      },
      createPassLinking: (consumerPackId: number) =>
        linkConsumerPackToMemberRelation(consumerPackId, selectedRelationId, {
          onSuccess: () => {
            fetchSharedConsumerPaymentPacks(selectedRelationId);
            setOpenConsumerPackLinking(false);
          },
        }),
    }),
  ),
  withProps(({ setOpenConsumerPackLinking, fetchConsumerPacks, memberId }) => ({
    openConsumerPaymentPackForm: () => {
      setOpenConsumerPackLinking(true);
      fetchConsumerPacks(memberId);
    },
  })),
  withTitle(({ member }) => (member && member.name) || ''),
)(MemberDetailRelation);
