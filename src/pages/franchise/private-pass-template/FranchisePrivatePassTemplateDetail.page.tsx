import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withTranslation, WithTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
// import omit from 'lodash/omit';

import {
  retrievePrivatePassTemplate as retrievePrivatePassTemplateAction,
  createPrivatePassTemplateInstance as createPrivatePassTemplateInstanceAction,
  deletePrivatePassTemplateInstance as deletePrivatePassTemplateInstanceAction,
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAction,
} from '#src/libs/private-service/actions';
import {
  getFranchiseCompanies,
  getAllowedFranchisees,
} from '#src/libs/franchise/selectors';
import { getPrivatePassTemplate } from '#src/libs/private-service/selectors/private-pass';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withTitle from '#src/hocs/with-title.hoc';

import PrivatePassTemplateInstanceDeleteDialog from '#src/libs/private-service/components/pass/PrivatePassTemplateInstanceDeleteDialog.component';
import PaginatedConsumerPrivatePass from '#src/libs/private-service/components/pass/PaginatedConsumerPrivatePass.component';
// / import PrivateConsumerPassFilters from '#src/libs/private-service/components/pass/PrivateConsumerPassFilters.component';

import PrivatePassTemplateCard from '#src/libs/private-service/components/pass/PrivatePassTemplateCard.component';
import PrivatePassTemplateInstanceFormDialog from '#src/libs/private-service/components/pass/PrivatePassTemplateInstanceFormDialog.component';

import {
  getPrivateConsumerPassList,
  withMember,
} from '#src/libs/private-service/selectors/private-consumer-pass';
import { openNewWindowToImpersonate } from '#src/utils/windows';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '../../../libs/member/actions';
import { RootState } from '../../../reducers';
import { parseQueryString } from '../../../http';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';

type OwnProps = { privatePassTemplateId: number };

const PAGINATION_SIZE = 30;

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

export class FranchisePrivatePassTemplateDetail extends Component<Props> {
  componentDidMount() {
    this.props.retrievePrivatePassTemplate(this.props.privatePassTemplateId);

    if (
      // eslint-disable-next-line
      parseQueryString(location.search || '').openTemplateInstanceForm
    ) {
      // @ts-expect-error
      this.props.openCreateForm();
    }
  }

  goToPrivateConsumerPassDetail = (
    companyId: number,
    memberId: number,
    consumerPackId: number,
  ) => {
    openNewWindowToImpersonate(
      companyId,
      `/member/${memberId}/private-consumer-pass/${consumerPackId}`,
    );
  };

  render() {
    if (!this.props.privatePassTemplate) {
      return <LinearProgress />;
    }
    return (
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <PrivatePassTemplateCard
            // @ts-expect-error
            onCreatePrivatePassTemplateInstance={this.props.openCreateForm}
            // @ts-expect-error
            onDeleteCompany={this.props.openDeleteDialog}
            privatePassTemplate={this.props.privatePassTemplate}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper>
            {/*
            * TODO: add filtering
            <PrivateConsumerPassFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={this.props.filters}
              />
              */}
            <Divider />
            <PaginatedConsumerPrivatePass
              allowedFranchisees={this.props.allowedFranchisees}
              // @ts-expect-error
              consumerPrivatePassUpdating={this.props.consumerPass.updating}
              itemPerPage={PAGINATION_SIZE}
              // @ts-expect-error
              items={this.props.consumerPass.items}
              loading={this.props.consumerPass.loading}
              nbItems={this.props.consumerPass.count}
              onClick={(cpp: {
                member: { id: number };
                private_pass: { company: number };
                id: number;
              }) => {
                this.goToPrivateConsumerPassDetail(
                  cpp.private_pass.company,
                  cpp.member?.id,
                  cpp.id,
                );
              }}
              onPageRequested={(page: number, pageSize: number) => {
                // @ts-expect-error
                this.props.fetchPrivateConsumerPassList(page, pageSize);
              }}
              page={this.props.consumerPass.page}
            />
          </Paper>
        </Grid>
        <PrivatePassTemplateInstanceFormDialog
          // @ts-expect-error
          companies={this.props.companies}
          // @ts-expect-error
          onClose={this.props.closeCreateForm}
          onSubmit={this.props.createPrivatePassTemplateInstance}
          // @ts-expect-error
          open={this.props.createFormOpen}
        />
        <PrivatePassTemplateInstanceDeleteDialog
          // @ts-expect-error
          companyId={this.props.companyTemplateInstanceIdToDelete}
          // @ts-expect-error
          onClose={this.props.closeDeleteDialog}
          onSubmit={this.props.deletePrivatePassTemplateInstance}
          // @ts-expect-error
          open={!!this.props.companyTemplateInstanceIdToDelete}
          privatePassTemplate={this.props.privatePassTemplate}
        />
      </Grid>
    );
  }
}

const connector = connect(
  (
    state: RootState,
    { privatePassTemplateId }: { privatePassTemplateId: number },
  ) => ({
    allowedFranchisees: getAllowedFranchisees(state),
    privatePassTemplate: getPrivatePassTemplate(state, privatePassTemplateId),
    consumerPass: {
      // @ts-expect-error
      count: state.privateService.privateConsumerPass.count,
      loading: state.privateService.privateConsumerPass.loading,
      // @ts-expect-error
      page: state.privateService.privateConsumerPass.page,
      items: withMember(getPrivateConsumerPassList)(state),
    },
    companies: getFranchiseCompanies(state),
  }),
  {
    retrievePrivatePassTemplate: retrievePrivatePassTemplateAction,
    createPrivatePassTemplateInstance: createPrivatePassTemplateInstanceAction,
    deletePrivatePassTemplateInstance: deletePrivatePassTemplateInstanceAction,
    fetchPrivateConsumerPassList: fetchPrivateConsumerPassListAction,
    fetchPrivatePassBulk: fetchPrivatePassBulkAction,
    fetchFilteredMembers: fetchFilteredMembersAction,
  },
);

export default compose(
  withTranslation(),
  routerParamsToProps({
    privatePassTemplateId: 'privatePassTemplateId:number',
  }),
  /*
   * TODO: add filtering
  withState('filters', 'setFilters', { reverted: false }),
  withState('open', 'setOpen', {}),
  withHandlers({
    setOpenValue:
      ({ setOpen, open }) =>
      (name: string) => {
        setOpen({
          ...open,
          [name]: !open[name],
        });
      },
    setFilterValue:
      ({ setFilters, filters }) =>
      (name: string, value) => {
        if (value === null) {
          setFilters(omit(filters, name));
        } else {
          setFilters({
            ...filters,
            [name]: value,
          });
        }
      },
      }),
   */
  withStateHandlers(
    {
      createFormOpen: false,
      companyTemplateInstanceIdToDelete: null,
    },
    {
      openCreateForm: () => () => ({ createFormOpen: true }),
      closeCreateForm: () => () => ({ createFormOpen: false }),
      openDeleteDialog: () => (companyTemplateInstanceIdToDelete) => ({
        companyTemplateInstanceIdToDelete,
      }),
      closeDeleteDialog: () => () => ({
        companyTemplateInstanceIdToDelete: null,
      }),
    },
  ),
  connector,
  withHandlers({
    deletePrivatePassTemplateInstance:
      ({
        deletePrivatePassTemplateInstance,
        privatePassTemplateId,
        retrievePrivatePassTemplate,
        closeDeleteDialog,
      }) =>
      // @ts-expect-error
      (id, options) => {
        deletePrivatePassTemplateInstance(id, {
          // @ts-expect-error
          onSuccess: (...args) => {
            retrievePrivatePassTemplate(privatePassTemplateId);
            closeDeleteDialog();
            if (options && options.onSuccess) options.onSuccess(...args);
          },
          onError: options?.onError,
        });
      },
    createPrivatePassTemplateInstance:
      ({
        createPrivatePassTemplateInstance,
        privatePassTemplateId,
        retrievePrivatePassTemplate,
        closeCreateForm,
      }) =>
      // @ts-expect-error
      (data, options) => {
        createPrivatePassTemplateInstance(
          { ...data, private_pass_template: privatePassTemplateId },
          {
            // @ts-expect-error
            onSuccess: (...args) => {
              retrievePrivatePassTemplate(privatePassTemplateId);
              closeCreateForm();
              if (options && options.onSuccess) options.onSuccess(...args);
            },
            onError: options?.onError,
          },
        );
      },
    fetchPrivateConsumerPassList:
      ({
        fetchPrivateConsumerPassList,
        fetchPrivatePassBulk,
        fetchFilteredMembers,
        privatePassTemplateId: private_pass_template,
      }) =>
      (page: number, page_size: number) => {
        fetchPrivateConsumerPassList(
          { page, page_size, private_pass_template },
          {
            // @ts-expect-error
            onSuccess: (consumerPackList) => {
              fetchPrivatePassBulk(
                // @ts-expect-error
                consumerPackList.map((cpp) => cpp.private_pass?.id),
              );
              fetchFilteredMembers({
                id__in: consumerPackList.map((b: any) => b.member),
              });
            },
          },
        );
      },
  }),
  withTitle(({ privatePassTemplate }) =>
    privatePassTemplate ? privatePassTemplate.name : '',
  ),
)(FranchisePrivatePassTemplateDetail);
