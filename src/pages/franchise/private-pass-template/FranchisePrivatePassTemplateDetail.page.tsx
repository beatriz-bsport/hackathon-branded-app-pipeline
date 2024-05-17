import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withTranslation, WithTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
// import omit from 'lodash/omit';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { parseQueryString } from '../../../http';

import { RootState } from '../../../reducers';

import {
  retrievePrivatePassTemplate as retrievePrivatePassTemplateAction,
  createPrivatePassTemplateInstance as createPrivatePassTemplateInstanceAction,
  deletePrivatePassTemplateInstance as deletePrivatePassTemplateInstanceAction,
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAction,
} from '#libs/private-service/actions';
import {
  getFranchiseCompanies,
  getAllowedFranchisees,
} from '#libs/franchise/selectors';
import { getPrivatePassTemplate } from '#libs/private-service/selectors/private-pass';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '../../../libs/member/actions';

import PrivatePassTemplateInstanceDeleteDialog from '#libs/private-service/components/pass/PrivatePassTemplateInstanceDeleteDialog.component';
// @ts-expect-error
import { navigateAsCompanyAdmin } from '../../../actions/auth.actions';
import PaginatedConsumerPrivatePass from '#libs/private-service/components/pass/PaginatedConsumerPrivatePass.component';
// / import PrivateConsumerPassFilters from '#libs/private-service/components/pass/PrivateConsumerPassFilters.component';

import PrivatePassTemplateCard from '#libs/private-service/components/pass/PrivatePassTemplateCard.component';
import PrivatePassTemplateInstanceFormDialog from '#libs/private-service/components/pass/PrivatePassTemplateInstanceFormDialog.component';

import {
  getPrivateConsumerPassList,
  withMember,
} from '#libs/private-service/selectors/private-consumer-pass';

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
                this.props.goToPrivateConsumerPassDetail(
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
    // @ts-expect-error
    goToPrivateConsumerPassDetail: (companyId, memberId, consumerPackId) =>
      navigateAsCompanyAdmin(
        companyId,
        `/member/${memberId}/private-consumer-pass/${consumerPackId}`,
      ),
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
