// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import { compose, withProps, withState } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import _ from 'lodash';
import DialogContent from '@material-ui/core/DialogContent';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import MemberRelationList from '../../libs/relationship/components/MemberRelationList.component';
import RelationSummary from '../../libs/relationship/components/RelationSummary.component';
import RelationForm from '../../libs/relationship/components/RelationForm.component';
import {
  fetchByMember as fetchConsumerPackByMemberAction,
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
} from '../../libs/consumer-payment-pack/actions';
import { fetchAllPaymentPacks as fetchAllPaymentPacksAction } from '../../libs/payment-packs/actions';
import { getConsumerPacksByMemberWithPaymentPack } from '../../libs/consumer-payment-pack/selectors';
import ConsumerPackLinkForm from '../../libs/relationship/components/ConsumerPackLinkForm.component';
import ConsumerPassLinkingDeleteDialog from '../../libs/relationship/components/ConsumerPassLinkingDeleteDialog.component';
import ConsumerPassRelinkDialog from '../../libs/relationship/components/ConsumerPassRelinkDialog.component';
import PrivateConsumerPassLinkForm from '../../libs/relationship/components/PrivateConsumerPassLinkForm.component';
import PrivateConsumerPassLinkingDeleteDialog from '../../libs/relationship/components/PrivateConsumerPassLinkingDeleteDialog.component';
import PrivateConsumerPassRelinkDialog from '../../libs/relationship/components/PrivateConsumerPassRelinkDialog.component';
import { getPrivateConsumerPassByMember } from '../../libs/private-service/selectors/private-consumer-pass';
import withTitle from '../../hocs/with-title.hoc';
import {
  getMemberRelations,
  getMemberRelationById,
  getSharedConsumerPacksByRelation,
  getSharedPrivateConsumerPassesByRelation,
} from '../../libs/relationship/selectors';
import {
  getMemberDetail,
  getSearchedMembers,
} from '../../libs/member/selectors';
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
  fetchSharedPrivateConsumerPasses as fetchSharedPrivateConsumerPassesAction,
  linkPrivatePassToMemberRelation as linkPrivatePassToMemberRelationAction,
  unlinkPrivateConsumerPassLink as unlinkPrivateConsumerPassLinkAction,
  relinkPrivateConsumerPassLink as relinkPrivateConsumerPassLinkAction,
} from '../../libs/relationship/actions';
import {
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  fetchPrivateConsumerPassByMember as fetchPrivateConsumerPassByMemberAction,
} from '../../libs/private-service/actions.ts';
import type { PrivateConsumerPassLink } from '../../libs/relationship/types';
import type { PrivateConsumerPass } from '../../libs/private-service/types.ts';

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

  consumerPackCurrentPage: number,
  consumerPackCount: number,

  fetchAllPaymentPacks: () => void,
  fetchConsumerPacks: (
    memberId: number,
    page: number,
    page_size: number,
  ) => void,
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
  memberConsumerPacks: Array<ConsumerPack>,
  member: Member,
  selectedRelation: ?MemberRelation,
  sharedConsumerPaymentPackLinks: Array<ConsumerPackLink>,
  createPassLinking: (data: *) => void,
  passLoading: boolean,
  searchMembers: (string) => void,
  searchedMembers: Array<Member>,

  createPrivatePassLinking: (data: any) => void,
  fetchSharedPrivateConsumerPasses: (relationId: number) => void,
  openPrivateConsumerPassLinking: boolean,
  openPrivateConsumerPassForm: () => void,
  setOpenPrivateConsumerPassLinking: (boolean) => void,
  sharedPrivateConsumerPassLinks: Array<PrivateConsumerPassLink>,
  privateConsumerPasses: Array<PrivateConsumerPass>,
  privatePassLoading: boolean,
  privateConsumerPassLinkToDelete: ?number,
  unlinkPrivateConsumerPassLinking: (id: number) => void,
  privateConsumerPassLinkToRelink: number,
  relinkPrivateConsumerPassLinking: (id: number) => void,
  cancelUnlinkPrivateConsumerPass: () => void,
  cancelRelinkPrivateConsumerPass: () => void,
  requestUnlinkPrivateConsumerPass: (id: number) => void,
  requestRelinkPrivateConsumerPass: (id: number) => void,
};

export class MemberDetailRelation extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchMember(this.props.memberId);
    this.fetchRelationList();

    this.props.fetchAllPaymentPacks();

    if (this.props.selectedRelationId) {
      this.props.fetchSharedConsumerPaymentPacks(this.props.selectedRelationId);
      this.props.fetchSharedPrivateConsumerPasses(this.props.selectedRelationId);
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
      this.props.fetchSharedPrivateConsumerPasses(this.props.selectedRelationId);
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
      share_email: relation.share_email,
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
    const linkedPrivatePassIds = _.flatten([
      this.props.sharedPrivateConsumerPassLinks
        .filter((s_pcp) => s_pcp.src)
        .map((s_pcp) => s_pcp.src.id),
      this.props.sharedPrivateConsumerPassLinks
        .filter((s_pcp) => s_pcp.dst)
        .map((s_pcp) => s_pcp.dst.id),
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
              privateConsumerPassLinks={this.props.sharedPrivateConsumerPassLinks}
              requestPrivatePassLinking={this.props.openPrivateConsumerPassForm}
              unlinkPrivateConsumerPass={this.props.requestUnlinkPrivateConsumerPass}
              relinkPrivateConsumerPass={this.props.requestRelinkPrivateConsumerPass}
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
              page={this.props.consumerPackCurrentPage}
              count={this.props.consumerPackCount}
              fetchConsumerPacks={(page, page_size) =>
                this.props.fetchConsumerPacks(
                  this.props.memberId,
                  page,
                  page_size,
                )
              }
              consumerPacks={this.props.memberConsumerPacks}
              disabledStuff={this.props.memberConsumerPacks
                .filter(
                  (cpp) =>
                    cpp.dst_consumer_payment_pack ||
                    linkedPassIds.includes(cpp.id),
                )
                .map((cpp) => cpp.id)}
              loading={this.props.passLoading}
              onCancel={() => this.props.setOpenConsumerPackLinking(false)}
              onSubmit={this.props.createPassLinking}
            />
          </DialogContent>
        </Dialog>
        <PrivateConsumerPassLinkingDeleteDialog
          open={!!this.props.privateConsumerPassLinkToDelete}
          onSubmit={this.props.unlinkPrivateConsumerPassLinking}
          privateConsumerPassLinkId={this.props.privateConsumerPassLinkToDelete}
          onCancel={this.props.cancelUnlinkPrivateConsumerPass}
        />
        <PrivateConsumerPassRelinkDialog
          open={!!this.props.privateConsumerPassLinkToRelink}
          onSubmit={this.props.relinkPrivateConsumerPassLinking}
          privateConsumerPassLinkId={this.props.privateConsumerPassLinkToRelink}
          onCancel={this.props.cancelRelinkPrivateConsumerPass}
        />
        <Dialog open={this.props.openPrivateConsumerPassLinking}>
          <DialogContent>
            <PrivateConsumerPassLinkForm
              privateConsumerPasses={this.props.privateConsumerPasses}
              loading={this.props.privatePassLoading}
              onCancel={() => this.props.setOpenPrivateConsumerPassLinking(false)}
              onSubmit={this.props.createPrivatePassLinking}
              disabledStuff={this.props.privateConsumerPasses
                .filter(
                  (pcp) =>
                    pcp.dst_consumer_payment_pack ||
                    linkedPrivatePassIds.includes(pcp.id),
                )
                .map((pcp) => pcp.id)}
            />
          </DialogContent>
        </Dialog>
        {!!this.props.openRelationFormDialog && (
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
        )}
      </Grid>
    );
  }
}

const styles = (theme) => ({ panel: { padding: theme.spacing(1) } });

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
  withState('openPrivateConsumerPassLinking', 'setOpenPrivateConsumerPassLinking', false),
  withState('privateConsumerPassLinkToDelete', 'setPrivateConsumerPassLinkToDelete', null),
  withState('privateConsumerPassLinkToRelink', 'setPrivateConsumerPassLinkToRelink', null),
  connect(
    (state, { selectedRelationId, memberId }) => ({
      relationList: getMemberRelations(state),
      relation: getMemberRelationById(state, selectedRelationId),
      memberConsumerPacks: getConsumerPacksByMemberWithPaymentPack(
        state,
        memberId,
      ),
      consumerPackCount: state.consumerPaymentPack.byMember.count,
      consumerPackCurrentPage: state.consumerPaymentPack.byMember.page,
      sharedConsumerPaymentPackLinks: getSharedConsumerPacksByRelation(
        state,
        selectedRelationId,
      ),
      passLoading: state.consumerPaymentPack.byMember.loading,
      member: getMemberDetail(state, memberId),
      searchedMembers: getSearchedMembers(state),
      searchMembersLoading: state.member.search.loading,
      privateConsumerPasses: getPrivateConsumerPassByMember(state),
      sharedPrivateConsumerPassLinks: getSharedPrivateConsumerPassesByRelation(
        state,
        selectedRelationId,
      ),
      privatePassLoading: state.privateService.privateConsumerPass.byMember.loading,
    }),
    {
      fetchMember,
      searchMembers,
      goToMember: (id: number) => push(`/member/${id}/info/`),
      fetchSharedConsumerPaymentPacks: fetchSharedConsumerPaymentPacksAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchMemberRelations,
      fetchFilteredMembers,
      linkConsumerPackToMemberRelation: linkConsumerPackToMemberRelationAction,
      fetchAllPaymentPacks: fetchAllPaymentPacksAction,
      createOrUpdateRelation,
      unlinkConsumerPaymentPackLink: unlinkConsumerPaymentPackLinkAction,
      relinkConsumerPaymentPackLink: relinkConsumerPaymentPackLinkAction,
      fetchConsumerPacks: (memberId: number, page: number, page_size: number) =>
        fetchConsumerPackByMemberAction(memberId, page, page_size),
      fetchPrivateConsumerPassBulk: fetchPrivateConsumerPassBulkAction,
      fetchPrivateConsumerPassByMember: fetchPrivateConsumerPassByMemberAction,
      fetchSharedPrivateConsumerPasses: fetchSharedPrivateConsumerPassesAction,
      linkPrivatePassToMemberRelation: linkPrivatePassToMemberRelationAction,
      unlinkPrivateConsumerPassLink: unlinkPrivateConsumerPassLinkAction,
      relinkPrivateConsumerPassLink: relinkPrivateConsumerPassLinkAction,
      goToRelationDetail: (memberId, relationId) =>
        push(`/member/${memberId}/relation/${relationId}`),
    },
  ),
  withProps(({ selectedRelationId, relationList }) => ({
    selectedRelation: relationList.find((r) => r.id === selectedRelationId),
  })),
  withProps(
    ({ fetchSharedConsumerPaymentPacks, retrieveConsumerPackBulk }) => ({
      fetchSharedConsumerPaymentPacks: (relationId) =>
        fetchSharedConsumerPaymentPacks(relationId, {
          onSuccess: (data) => {
            if (data.length > 0) {
              retrieveConsumerPackBulk(
                data.reduce((acc, s) => [...acc, s.src, s.dst], []),
              );
            }
          },
        }),
    }),
  ),
  withProps(
    ({
      setOpenConsumerPackLinking,
      setConsumerPassLinkToDelete,
      setConsumerPassLinkToRelink,
      fetchSharedConsumerPaymentPacks,
      selectedRelationId,
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
  withProps(({ setOpenConsumerPackLinking }) => ({
    openConsumerPaymentPackForm: () => {
      setOpenConsumerPackLinking(true);
    },
  })),
  withProps(
    ({ fetchSharedPrivateConsumerPasses, fetchPrivateConsumerPassBulk }) => ({
      fetchSharedPrivateConsumerPasses: (relationId) =>
        fetchSharedPrivateConsumerPasses(relationId, {
          onSuccess: (data) => {
            if (data.length > 0) {
              fetchPrivateConsumerPassBulk(
                data.reduce((acc, s) => [...acc, s.src, s.dst], []),
              );
            }
          },
        }),
    }),
  ),
  withProps(
    ({
      fetchSharedPrivateConsumerPasses,
      setOpenPrivateConsumerPassLinking,
      setPrivateConsumerPassLinkToDelete,
      setPrivateConsumerPassLinkToRelink,
      fetchPrivateConsumerPassByMember,
      linkPrivatePassToMemberRelation,
      unlinkPrivateConsumerPassLink,
      relinkPrivateConsumerPassLink,
      selectedRelationId,
      memberId,
    }) => ({
      openPrivateConsumerPassForm: () => {
        fetchPrivateConsumerPassByMember(memberId);
        setOpenPrivateConsumerPassLinking(true);
      },
      requestUnlinkPrivateConsumerPass: (privateConsumerPassLinkId: number) => {
        setPrivateConsumerPassLinkToDelete(privateConsumerPassLinkId);
      },
      cancelUnlinkPrivateConsumerPass: () => {
        setPrivateConsumerPassLinkToDelete(null);
      },
      unlinkPrivateConsumerPassLinking: (privateConsumerPassLinkId: number) => {
        unlinkPrivateConsumerPassLink(privateConsumerPassLinkId, {
          onSuccess: () => {
            fetchSharedPrivateConsumerPasses(selectedRelationId);
            setPrivateConsumerPassLinkToDelete(null);
          },
        });
      },
      requestRelinkPrivateConsumerPass: (privateConsumerPassLinkId: number) => {
        setPrivateConsumerPassLinkToRelink(privateConsumerPassLinkId);
      },
      cancelRelinkPrivateConsumerPass: () => {
        setPrivateConsumerPassLinkToRelink(null);
      },
      relinkPrivateConsumerPassLinking: (privateConsumerPassLinkId: number) => {
        relinkPrivateConsumerPassLink(privateConsumerPassLinkId, {
          onSuccess: () => {
            fetchSharedPrivateConsumerPasses(selectedRelationId);
            setPrivateConsumerPassLinkToRelink(null);
          },
        });
      },
      createPrivatePassLinking: (privateConsumerPassId: number) =>
        linkPrivatePassToMemberRelation(privateConsumerPassId, selectedRelationId, {
          onSuccess: () => {
            fetchSharedPrivateConsumerPasses(selectedRelationId);
            setOpenPrivateConsumerPassLinking(false);
          },
        }),
    })),
  withTitle(({ member }) => (member && member.name) || ''),
)(MemberDetailRelation);
