// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import { compose, withProps, withState, withHandlers } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import flatten from 'lodash/flatten';
import DialogContent from '@material-ui/core/DialogContent';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import MemberRelationList from '../../libs/relationship/components/MemberRelationList.component';
import RelationSummary from '../../libs/relationship/components/RelationSummary.component';
import RelationForm from '../../libs/relationship/components/RelationForm.component';
import {
  fetchByMember as fetchConsumerPackByMemberAction,
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '../../libs/payment-packs/actions';
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
  withIsSharedActive,
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
  fetchMemberRelations as fetchMemberRelationsAction,
  fetchSharedConsumerPaymentPacks as fetchSharedConsumerPaymentPacksAction,
  linkToMemberRelation as linkConsumerPackToMemberRelationAction,
  createOrUpdateRelation,
  unlinkConsumerPaymentPackLink as unlinkConsumerPaymentPackLinkAction,
  relinkConsumerPaymentPackLink as relinkConsumerPaymentPackLinkAction,
  fetchSharedPrivateConsumerPasses as fetchSharedPrivateConsumerPassesAction,
  linkPrivatePassToMemberRelation as linkPrivatePassToMemberRelationAction,
  unlinkPrivateConsumerPassLink as unlinkPrivateConsumerPassLinkAction,
  relinkPrivateConsumerPassLink as relinkPrivateConsumerPassLinkAction,
  deleteRelation as deleteRelationAction,
} from '../../libs/relationship/actions';
import {
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  fetchPrivateConsumerPassByMember as fetchPrivateConsumerPassByMemberAction,
} from '../../libs/private-service/actions';
import type {
  PrivateConsumerPassLink,
  WithIsSharedActive,
} from '../../libs/relationship/types';
import type { PrivateConsumerPass } from '../../libs/private-service/types';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';

type Props = {
  relationList: Array<MemberRelation>,

  deleteRelation: (id: number, options: OptionCallback) => void,

  selectedRelationId: number,
  fetchMemberRelations: (memberId: number) => void,
  goToRelationDetail: (memberId: number, relationId: number) => void,
  memberId: number,
  relationLoading: boolean,

  classes: Object,
  openConsumerPaymentPackForm: () => void,
  openConsumerPackLinking: boolean,
  searchMembersLoading: boolean,
  fetchMember: (id: number) => void,
  openRelationFormDialog: (data: *) => void,

  consumerPackCurrentPage: number,
  consumerPackCount: number,

  fetchPaymentPackList: () => void,
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
  consumerPassLinkToDelete?: number,
  unlinkPassLinking: (id: number) => void,
  consumerPassLinkToRelink: number,
  relinkPassLinking: (id: number) => void,
  cancelUnlinkRequest: () => void,
  cancelRelinkRequest: () => void,

  setOpenRelationFormDialog: (data: *) => void,
  setOpenConsumerPackLinking: (boolean) => void,
  memberConsumerPacks: Array<WithIsSharedActive<ConsumerPack>>,
  member: Member,
  selectedRelation?: MemberRelation,
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
  privateConsumerPassLinkToDelete?: number,
  unlinkPrivateConsumerPassLinking: (id: number) => void,
  privateConsumerPassLinkToRelink: number,
  relinkPrivateConsumerPassLinking: (id: number) => void,
  cancelUnlinkPrivateConsumerPass: () => void,
  cancelRelinkPrivateConsumerPass: () => void,
  requestUnlinkPrivateConsumerPass: (id: number) => void,
  requestRelinkPrivateConsumerPass: (id: number) => void,
  managerFormConfig: SignUpFormConfigDict,
  waiver: string,
  generalTermsAndConditions: string,
  consumerPassLinkLoading: boolean,
};

export class MemberDetailRelation extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.fetchMember(this.props.memberId);
    this.fetchRelationList();

    this.props.fetchPaymentPackList({ disabled: false, page_size: 70000 });
    if (this.props.selectedRelationId) {
      this.props.fetchSharedConsumerPaymentPacks(this.props.selectedRelationId);
      this.props.fetchSharedPrivateConsumerPasses(
        this.props.selectedRelationId,
      );
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
      this.props.fetchSharedPrivateConsumerPasses(
        this.props.selectedRelationId,
      );
    }
  }

  selectRelationId = (relationId: number) => {
    this.props.goToRelationDetail(this.props.memberId, relationId);
  };

  createOrUpdateRelation = (data, options) => {
    this.props.createOrUpdateRelation(data, {
      onSuccess: () => {
        options?.onSuccess();
        this.fetchRelationList();
        this.props.setOpenRelationFormDialog(null);
      },
      onError: () => {
        options?.onError();
      },
    });
  };

  openEditForm = (relation) => {
    this.props.setOpenRelationFormDialog({
      ...relation,
    });
  };

  render() {
    if (!this.props.member) {
      return <LinearProgress />;
    }
    const relatedMemberIds = flatten([
      this.props.relationList.map((r) => r.src_member.id),
      this.props.relationList.map((r) => r.dst_member.id),
    ]);
    const linkedPassIds = flatten([
      this.props.sharedConsumerPaymentPackLinks
        .filter((s_cpp) => s_cpp.src)
        .map((s_cpp) => s_cpp.src.id),
      this.props.sharedConsumerPaymentPackLinks
        .filter((s_cpp) => s_cpp.dst)
        .map((s_cpp) => s_cpp.dst.id),
    ]);
    const linkedPrivatePassIds = flatten([
      this.props.sharedPrivateConsumerPassLinks
        .filter((s_pcp) => s_pcp.src)
        .map((s_pcp) => s_pcp.src.id),
      this.props.sharedPrivateConsumerPassLinks
        .filter((s_pcp) => s_pcp.dst)
        .map((s_pcp) => s_pcp.dst.id),
    ]);
    return (
      <Grid container direction="row">
        <Grid item md={6} xs={12}>
          <div className={this.props.classes.panel}>
            <MemberRelationList
              goToMember={this.props.goToMember}
              loading={this.props.relationLoading}
              memberId={this.props.memberId}
              onAdd={() => {
                this.props.setOpenRelationFormDialog({
                  src_member: this.props.member,
                });
              }}
              onClickRelation={this.selectRelationId}
              onDelete={this.props.deleteRelation}
              onEdit={this.openEditForm}
              relations={this.props.relationList}
              selectedId={this.props.selectedRelationId}
            />
          </div>
        </Grid>
        <Grid item md={6} xs={12}>
          <div className={this.props.classes.panel}>
            <RelationSummary
              consumerPaymentPackLinks={
                this.props.sharedConsumerPaymentPackLinks
              }
              privateConsumerPassLinks={
                this.props.sharedPrivateConsumerPassLinks
              }
              relation={this.props.selectedRelation}
              relinkPassLinking={this.props.requestRelinkPassLinking}
              relinkPrivateConsumerPass={
                this.props.requestRelinkPrivateConsumerPass
              }
              requestPassLinking={this.props.openConsumerPaymentPackForm}
              requestPrivatePassLinking={this.props.openPrivateConsumerPassForm}
              unlinkPassLinking={this.props.requestUnlinkPassLinking}
              unlinkPrivateConsumerPass={
                this.props.requestUnlinkPrivateConsumerPass
              }
            />
          </div>
        </Grid>
        <ConsumerPassLinkingDeleteDialog
          consumerPackLink={this.props.consumerPassLinkToDelete}
          onCancel={this.props.cancelUnlinkRequest}
          onSubmit={this.props.unlinkPassLinking}
          open={!!this.props.consumerPassLinkToDelete}
          processing={this.props.consumerPassLinkLoading}
        />
        <ConsumerPassRelinkDialog
          consumerPackLink={this.props.consumerPassLinkToRelink}
          onCancel={this.props.cancelRelinkRequest}
          onSubmit={this.props.relinkPassLinking}
          open={!!this.props.consumerPassLinkToRelink}
          processing={this.props.consumerPassLinkLoading}
        />
        <Dialog open={this.props.openConsumerPackLinking}>
          <DialogContent>
            {this.props.consumerPassLinkLoading && <LinearProgress />}
            <ConsumerPackLinkForm
              consumerPacks={this.props.memberConsumerPacks}
              count={this.props.consumerPackCount}
              disabledStuff={this.props.memberConsumerPacks
                .filter(
                  (cpp) =>
                    cpp.dst_consumer_payment_pack ||
                    linkedPassIds.includes(cpp.id),
                )
                .map((cpp) => cpp.id)}
              fetchConsumerPacks={(page, page_size) =>
                this.props.fetchConsumerPacks(
                  this.props.memberId,
                  page,
                  page_size,
                )
              }
              loading={this.props.passLoading}
              onCancel={() => this.props.setOpenConsumerPackLinking(false)}
              onSubmit={this.props.createPassLinking}
              page={this.props.consumerPackCurrentPage}
              processing={this.props.consumerPassLinkLoading}
            />
          </DialogContent>
        </Dialog>
        <PrivateConsumerPassLinkingDeleteDialog
          onCancel={this.props.cancelUnlinkPrivateConsumerPass}
          onSubmit={this.props.unlinkPrivateConsumerPassLinking}
          open={!!this.props.privateConsumerPassLinkToDelete}
          privateConsumerPassLinkId={this.props.privateConsumerPassLinkToDelete}
          processing={this.props.consumerPassLinkLoading}
        />
        <PrivateConsumerPassRelinkDialog
          onCancel={this.props.cancelRelinkPrivateConsumerPass}
          onSubmit={this.props.relinkPrivateConsumerPassLinking}
          open={!!this.props.privateConsumerPassLinkToRelink}
          privateConsumerPassLinkId={this.props.privateConsumerPassLinkToRelink}
          processing={this.props.consumerPassLinkLoading}
        />
        <Dialog open={this.props.openPrivateConsumerPassLinking}>
          <DialogContent>
            {this.props.consumerPassLinkLoading && <LinearProgress />}
            <PrivateConsumerPassLinkForm
              disabledStuff={this.props.privateConsumerPasses
                .filter(
                  (pcp) =>
                    pcp.dst_private_consumer_pass.length > 0 ||
                    !!pcp.linked_consumer_payment_pack ||
                    linkedPrivatePassIds.includes(pcp.id),
                )
                .map((pcp) => pcp.id)}
              loading={this.props.privatePassLoading}
              onCancel={() =>
                this.props.setOpenPrivateConsumerPassLinking(false)
              }
              onSubmit={this.props.createPrivatePassLinking}
              privateConsumerPasses={this.props.privateConsumerPasses}
              processing={this.props.consumerPassLinkLoading}
            />
          </DialogContent>
        </Dialog>
        {!!this.props.openRelationFormDialog && (
          <Dialog open={!!this.props.openRelationFormDialog}>
            <RelationForm
              generalTermsAndConditions={this.props.generalTermsAndConditions}
              initial={this.props.openRelationFormDialog}
              managerFormConfig={this.props.managerFormConfig?.poll_fields}
              onCancel={() => this.props.setOpenRelationFormDialog(null)}
              onSubmit={this.createOrUpdateRelation}
              searchedMembers={this.props.searchedMembers.filter(
                (m) =>
                  m.id !== this.props.memberId &&
                  !relatedMemberIds.includes(m.id),
              )}
              searchLoading={this.props.searchMembersLoading}
              searchMembers={this.props.searchMembers}
              waiver={this.props.waiver}
            />
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
  withState(
    'openPrivateConsumerPassLinking',
    'setOpenPrivateConsumerPassLinking',
    false,
  ),
  withState(
    'privateConsumerPassLinkToDelete',
    'setPrivateConsumerPassLinkToDelete',
    null,
  ),
  withState(
    'privateConsumerPassLinkToRelink',
    'setPrivateConsumerPassLinkToRelink',
    null,
  ),
  connect(
    (state, { selectedRelationId, memberId }) => ({
      theme: state.theme.theme,
      relationList: getMemberRelations(state),
      relation: getMemberRelationById(state, selectedRelationId),
      memberConsumerPacks: withIsSharedActive(
        getConsumerPacksByMemberWithPaymentPack,
      )(state, memberId),
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
      privatePassLoading:
        state.privateService.privateConsumerPass.byMember.loading,
      managerFormConfig: getSignUpFormConfigurationDict(state),
      consumerPassLinkLoading:
        state.relationship.consumer_payment_pack_link.createOrUpdate.loading,
    }),
    {
      fetchMember,
      searchMembers,
      goToMember: (id: number) => push(`/member/${id}/info/`),
      fetchSharedConsumerPaymentPacks: fetchSharedConsumerPaymentPacksAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchMemberRelations: fetchMemberRelationsAction,
      fetchFilteredMembers,
      linkConsumerPackToMemberRelation: linkConsumerPackToMemberRelationAction,
      fetchPaymentPackList: fetchPaymentPackListAction,
      createOrUpdateRelation,
      unlinkConsumerPaymentPackLink: unlinkConsumerPaymentPackLinkAction,
      relinkConsumerPaymentPackLink: relinkConsumerPaymentPackLinkAction,
      fetchConsumerPacks: (memberId: number, page: number, page_size: number) =>
        fetchConsumerPackByMemberAction({ member: memberId, page, page_size }),
      fetchPrivateConsumerPassBulk: fetchPrivateConsumerPassBulkAction,
      fetchPrivateConsumerPassByMember: fetchPrivateConsumerPassByMemberAction,
      fetchSharedPrivateConsumerPasses: fetchSharedPrivateConsumerPassesAction,
      linkPrivatePassToMemberRelation: linkPrivatePassToMemberRelationAction,
      unlinkPrivateConsumerPassLink: unlinkPrivateConsumerPassLinkAction,
      relinkPrivateConsumerPassLink: relinkPrivateConsumerPassLinkAction,
      deleteRelation: deleteRelationAction,
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
      setOpenConsumerPackLinking,
      setConsumerPassLinkToDelete,
      setConsumerPassLinkToRelink,
      fetchSharedConsumerPaymentPacks,
      selectedRelationId,
      linkConsumerPackToMemberRelation,
      unlinkConsumerPaymentPackLink,
      relinkConsumerPaymentPackLink,
      fetchSharedPrivateConsumerPasses,
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
            fetchSharedPrivateConsumerPasses(selectedRelationId);
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
            fetchSharedPrivateConsumerPasses(selectedRelationId);
          },
        });
      },
      createPassLinking: (consumerPackId: number) =>
        linkConsumerPackToMemberRelation(consumerPackId, selectedRelationId, {
          onSuccess: () => {
            fetchSharedConsumerPaymentPacks(selectedRelationId);
            setOpenConsumerPackLinking(false);
            fetchSharedPrivateConsumerPasses(selectedRelationId);
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
      fetchSharedConsumerPaymentPacks,
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
            fetchSharedConsumerPaymentPacks(selectedRelationId);
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
            fetchSharedConsumerPaymentPacks(selectedRelationId);
          },
        });
      },
      createPrivatePassLinking: (privateConsumerPassId: number) =>
        linkPrivatePassToMemberRelation(
          privateConsumerPassId,
          selectedRelationId,
          {
            onSuccess: () => {
              fetchSharedPrivateConsumerPasses(selectedRelationId);
              setOpenPrivateConsumerPassLinking(false);
              fetchSharedConsumerPaymentPacks(selectedRelationId);
            },
          },
        ),
    }),
  ),
  withHandlers({
    deleteRelation:
      ({ deleteRelation, fetchMemberRelations, memberId }) =>
      (id, options) => {
        deleteRelation(id, {
          onSuccess: () => {
            if (options && options.onSuccess) {
              options.onSuccess();
            }
            fetchMemberRelations(memberId);
          },
          onError: () => {
            if (options && options.onError) {
              options.onError();
            }
          },
        });
      },
  }),
  withTitle(({ member }) => (member && member.name) || ''),
)(MemberDetailRelation);
