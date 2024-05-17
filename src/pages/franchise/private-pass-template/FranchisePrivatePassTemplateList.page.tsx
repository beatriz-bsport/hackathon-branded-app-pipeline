import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { push as pushAction } from 'connected-react-router';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import { buildUrlParams } from '../../../http';

import { RootState } from '../../../reducers';

import PrivatePassTemplateListItem from '../../../libs/private-service/components/pass/PrivatePassTemplateListItem.component';
import IsEmptyList from '../../../components/navigation/IsEmptyList.component';
import PrivatePassTemplateFormDrawer from '../../../libs/private-service/components/pass/private-pass-template-form/PrivatePassTemplateFormDrawer.component';
import PrivatePassTemplateDeleteDialog from '../../../libs/private-service/components/pass/PrivatePassTemplateDeleteDialog.component';
import { PrivatePassTemplateAPI } from '../../../libs/private-service/types';
import { OptionCallback } from '../../../state/types';
import {
  fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction,
  createOrUpdatePrivatePassTemplate as createOrUpdatePrivatePassTemplateAction,
  deletePrivatePassTemplate as deletePrivatePassTemplateAction,
} from '../../../libs/private-service/actions';
import {
  getPrivatePassTemplateListManagerOnly,
  getPrivatePassTemplateListAvailable,
  getPrivatePassTemplateData,
} from '../../../libs/private-service/selectors/private-pass';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: '20vh',
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(3),
    },
  });

type OwnProps = {
  closeCreateDialog: () => void;
  onCreateOpen: () => void;
  loading: boolean;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

export class FranchisePrivatePassTemplateListPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchPrivatePassTemplateList();
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        {this.props.loading && <LinearProgress />}
        <IsEmptyList
          button={t('privatePassTemplate.actions.create')}
          hideEmptyText={
            this.props.loading ||
            !!this.props.privatePassTemplateListAvailable.length ||
            !!this.props.privatePassTemplateListManagerOnly.length
          }
          // @ts-expect-error
          onCreate={this.props.openCreateDialog}
          onCreateLabel={t('privatePassTemplate.actions.create')}
          text={t('privatePassTemplate.isEmptyExplain')}
        />
        <div className={classes.container}>
          {!!this.props.privatePassTemplateListAvailable.length && (
            <>
              <Typography variant="h4">
                {t('privatePassTemplate.section.titleAvailable')}
              </Typography>
              <Divider className={classes.divider} />
              <Paper>
                {this.props.privatePassTemplateListAvailable.map((ppt) => (
                  <PrivatePassTemplateListItem
                    key={ppt.id}
                    // @ts-expect-error
                    divider
                    onClick={this.props.goToTemplateDetail}
                    // @ts-expect-error
                    onDelete={this.props.openDeleteDialog}
                    // @ts-expect-error
                    onEdit={this.props.openEditDialog}
                    privatePassTemplate={ppt}
                  />
                ))}
              </Paper>
            </>
          )}
          {!!this.props.privatePassTemplateListManagerOnly.length && (
            <>
              <Typography className={classes.title} variant="h4">
                {t('privatePassTemplate.section.titleManagerOnly')}
              </Typography>
              <Divider className={classes.divider} />
              <Paper>
                {this.props.privatePassTemplateListManagerOnly.map((ppt) => (
                  <PrivatePassTemplateListItem
                    key={ppt.id}
                    // @ts-expect-error
                    divider
                    onClick={this.props.goToTemplateDetail}
                    // @ts-expect-error
                    onDelete={this.props.openDeleteDialog}
                    // @ts-expect-error
                    onEdit={this.props.openEditDialog}
                    privatePassTemplate={ppt}
                  />
                ))}
              </Paper>
            </>
          )}
        </div>
        {/* @ts-expect-error */}
        {!!this.props.createModalOpen && (
          <PrivatePassTemplateFormDrawer
            onCancel={this.props.closeCreateDialog}
            // @ts-expect-error
            onSubmit={this.props.createOrUpdatePrivatePassTemplate}
            // @ts-expect-error
            open={this.props.createModalOpen}
          />
        )}
        <PrivatePassTemplateDeleteDialog
          // @ts-expect-error
          onClose={this.props.closeDeleteDialog}
          // @ts-expect-error
          onSubmit={this.props.deletePrivatePassTemplate}
          // @ts-expect-error
          open={!!this.props.templateToDelete}
        />
        {/* @ts-expect-error */}
        {!!this.props.privatePassTemplateForEdit && (
          <PrivatePassTemplateFormDrawer
            // @ts-expect-error
            initial={this.props.privatePassTemplateForEdit}
            // @ts-expect-error
            onCancel={this.props.closeEditDialog}
            // @ts-expect-error
            onSubmit={this.props.createOrUpdatePrivatePassTemplate}
            // @ts-expect-error
            open={this.props.privatePassTemplateForEdit}
          />
        )}
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    privatePassTemplateListManagerOnly:
      getPrivatePassTemplateListManagerOnly(state),
    privatePassTemplateListAvailable:
      getPrivatePassTemplateListAvailable(state),
    privatePassTemplateData: getPrivatePassTemplateData(state),
    loading: state.privateService.privatePassTemplate.loading,
  }),
  {
    fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
    goToTemplateDetail: (id: number, params: any = {}) =>
      pushAction(`/f/private-pass-template/${id}/${buildUrlParams(params)}`),
    createOrUpdatePrivatePassTemplate: createOrUpdatePrivatePassTemplateAction,
    deletePrivatePassTemplate: deletePrivatePassTemplateAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
  connector,
  withStateHandlers(
    {
      createModalOpen: false,
      privatePassTemplateForEdit: null,
      templateToDelete: null,
    },
    {
      openCreateDialog: () => () => ({ createModalOpen: true }),
      closeCreateDialog: () => () => ({ createModalOpen: false }),
      openEditDialog:
        // @ts-expect-error


          (_, { privatePassTemplateData }) =>
          (id) => ({
            privatePassTemplateForEdit: privatePassTemplateData[id],
          }),
      closeEditDialog: () => () => ({ privatePassTemplateForEdit: null }),
      openDeleteDialog: () => (id) => ({ templateToDelete: id }),
      closeDeleteDialog: () => () => ({ templateToDelete: null }),
    },
  ),
  withHandlers({
    deletePrivatePassTemplate:
      ({
        deletePrivatePassTemplate,
        templateToDelete,
        closeDeleteDialog,
        fetchPrivatePassTemplateList,
      }) =>
      () =>
        deletePrivatePassTemplate(templateToDelete, {
          onSuccess: () => {
            fetchPrivatePassTemplateList();
            closeDeleteDialog();
          },
        }),
    createOrUpdatePrivatePassTemplate:
      ({
        createOrUpdatePrivatePassTemplate,
        closeCreateDialog,
        closeEditDialog,
        goToTemplateDetail,
      }) =>
      (data: any, options: OptionCallback<PrivatePassTemplateAPI>) => {
        createOrUpdatePrivatePassTemplate(data, {
          onError: options && options.onError,
          onSuccess: (template: PrivatePassTemplateAPI) => {
            if (!template.private_pass_template_instances.length) {
              goToTemplateDetail(template.id, {
                openTemplateInstanceForm: true,
              });
            }
            closeCreateDialog();
            closeEditDialog();
            if (options && options.onSuccess) {
              options.onSuccess(template);
            }
          },
        });
      },
  }),
)(FranchisePrivatePassTemplateListPage);
