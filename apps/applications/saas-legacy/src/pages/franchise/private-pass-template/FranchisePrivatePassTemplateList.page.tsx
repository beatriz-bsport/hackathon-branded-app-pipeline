import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { push as pushAction } from 'connected-react-router';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import { buildUrlParams } from '#src/http';

import type { RootState } from '#src/reducers';

import PrivatePassTemplateListItem from '#src/libs/private-service/components/pass/PrivatePassTemplateListItem.component';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import PrivatePassTemplateFormDrawer from '#src/libs/private-service/components/pass/private-pass-template-form/PrivatePassTemplateFormDrawer.component';
import PrivatePassTemplateDeleteDialog from '#src/libs/private-service/components/pass/PrivatePassTemplateDeleteDialog.component';
import PrivatePassTemplateRestoreDialog from '#src/libs/private-service/components/pass/PrivatePassTemplateRestoreDialog.component';
import type { PrivatePassTemplateAPI } from '#src/libs/private-service/types';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { OptionCallback } from '#src/state/types';
import {
  fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction,
  createOrUpdatePrivatePassTemplate as createOrUpdatePrivatePassTemplateAction,
  deletePrivatePassTemplate as deletePrivatePassTemplateAction,
  restorePrivatePassTemplate as restorePrivatePassTemplateAction,
} from '#src/libs/private-service/actions';
import {
  getPrivatePassTemplateListManagerOnly,
  getPrivatePassTemplateListAvailable,
  getPrivatePassTemplateData,
  getPrivatePassTemplateListArchived,
} from '#src/libs/private-service/selectors/private-pass';
import type { WithHandlerType } from '#src/utils/types';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

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
      marginTop: theme.spacing(5),
    },
    disabledList: {
      marginTop: theme.spacing(5),
      paddingBottom: theme.spacing(16),
    },
    buttonTitle: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: theme.spacing(1),
    },
    sectionTitle: {
      marginBottom: theme.spacing(1),
    },
  });

type Props = ConnectedPropsWithStateHandlers & WithStyles & WithTranslation;

/**
 * @deprecated TODO: This page must be reworkedthe same way payment pack template pages have been reworked.
 * The reworked must include at least: Pagination, Functionnal component, better state management, back-end search
 * and a completly reworked redux-store.
 **/
export class FranchisePrivatePassTemplateListPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchPrivatePassTemplateList();
  }

  onShowDisabled = () => {
    this.props.setShowDisabled(!this.props.showDisabled);
  };

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
            !!this.props.privatePassTemplateListManagerOnly.length ||
            !!this.props.privatePassTemplateListArchived.length
          }
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
                    onClick={this.props.goToTemplateDetail}
                    onDelete={this.props.openDeleteDialog}
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
                    onClick={this.props.goToTemplateDetail}
                    onDelete={this.props.openDeleteDialog}
                    onEdit={this.props.openEditDialog}
                    privatePassTemplate={ppt}
                  />
                ))}
              </Paper>
            </>
          )}
          {this.props.privatePassTemplateListArchived?.length ? (
            <div className={classes.disabledList}>
              <div className={classes.buttonTitle}>
                <Typography className={classes.sectionTitle} variant="h4">
                  {`${t('privatePassTemplate.section.titleArchived')} (${
                    (this.props.privatePassTemplateListArchived ?? []).length
                  })`}
                </Typography>

                <IconButton onClick={this.onShowDisabled}>
                  {this.props.showDisabled ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <Collapse
                unmountOnExit
                className={classes.collapse}
                in={this.props.showDisabled}
              >
                <Paper>
                  {this.props.privatePassTemplateListArchived.map((ppt) => (
                    <PrivatePassTemplateListItem
                      key={ppt.id}
                      onRestore={this.props.openRestoreDialog}
                      privatePassTemplate={ppt}
                    />
                  ))}
                </Paper>
              </Collapse>
            </div>
          ) : null}
        </div>
        {!!this.props.createModalOpen && (
          <PrivatePassTemplateFormDrawer
            onCancel={this.props.closeCreateDialog}
            // @ts-expect-error
            onSubmit={this.props.createOrUpdatePrivatePassTemplate}
            open={this.props.createModalOpen}
          />
        )}
        <PrivatePassTemplateDeleteDialog
          onClose={this.props.closeDeleteDialog}
          // @ts-expect-error
          onSubmit={this.props.deletePrivatePassTemplate}
          open={!!this.props.templateToDelete}
        />
        <PrivatePassTemplateRestoreDialog
          onClose={this.props.closeRestoreDialog}
          // @ts-expect-error
          onSubmit={this.props.restorePrivatePassTemplate}
          open={!!this.props.templateToRestore}
        />
        {!!this.props.privatePassTemplateForEdit && (
          <PrivatePassTemplateFormDrawer
            // @ts-expect-error
            initial={this.props.privatePassTemplateForEdit}
            onCancel={this.props.closeEditDialog}
            onSubmit={this.props.createOrUpdatePrivatePassTemplate}
            open={this.props.privatePassTemplateForEdit}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  privatePassTemplateListManagerOnly:
    getPrivatePassTemplateListManagerOnly(state),
  privatePassTemplateListAvailable: getPrivatePassTemplateListAvailable(state),
  privatePassTemplateListArchived: getPrivatePassTemplateListArchived(state),
  // eslint-disable-next-line react/no-unused-prop-types
  privatePassTemplateData: getPrivatePassTemplateData(state),
  loading: state.privateService.privatePassTemplate.loading,
});

const mapDispatchToProps = {
  fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
  goToTemplateDetail: (id: number, params: any = {}) =>
    pushAction(`/f/private-pass-template/${id}/${buildUrlParams(params)}`),
  createOrUpdatePrivatePassTemplate: createOrUpdatePrivatePassTemplateAction,
  deletePrivatePassTemplate: deletePrivatePassTemplateAction,
  restorePrivatePassTemplate: restorePrivatePassTemplateAction,
};

type StateHandlersInit = {
  createModalOpen: boolean;
  privatePassTemplateForEdit: PrivatePassTemplateAPI | null;
  templateToDelete: number | null;
  templateToRestore: number | null;
  loading: boolean;
  showDisabled: boolean;
};

const withStateHandlersInit: StateHandlersInit = {
  createModalOpen: false,
  privatePassTemplateForEdit: null,
  templateToDelete: null,
  templateToRestore: null,
  loading: false,
  showDisabled: false,
};

const withStateHandlersSetter = {
  openCreateDialog: () => () => ({ createModalOpen: true }),
  closeCreateDialog: () => () => ({ createModalOpen: false }),
  openEditDialog: (_state: StateHandlersInit, props: any) => (id: number) => {
    const { privatePassTemplateData } = props as ConnectedProps;
    return {
      privatePassTemplateForEdit: privatePassTemplateData[id],
    };
  },
  setShowDisabled: () => (showDisabled: boolean) => ({ showDisabled }),
  closeEditDialog:
    () =>
    (): { privatePassTemplateForEdit: PrivatePassTemplateAPI | null } => ({
      privatePassTemplateForEdit: null,
    }),
  openDeleteDialog: () => (id: number) => ({ templateToDelete: id }),
  closeDeleteDialog: () => (): { templateToDelete: number | null } => ({
    templateToDelete: null,
  }),
  openRestoreDialog: () => (id: number) => ({ templateToRestore: id }),
  closeRestoreDialog: () => (): { templateToRestore: number | null } => ({
    templateToRestore: null,
  }),
};

const mapWithHandlers = {
  deletePrivatePassTemplate:
    ({
      deletePrivatePassTemplate,
      templateToDelete,
      closeDeleteDialog,
      fetchPrivatePassTemplateList,
    }: ConnectedPropsWithStateHandlers) =>
    () =>
      deletePrivatePassTemplate(templateToDelete!, {
        onSuccess: () => {
          closeDeleteDialog();
        },
        onBackgroundSuccess: () => {
          fetchPrivatePassTemplateList();
        },
      }),
  restorePrivatePassTemplate:
    ({
      restorePrivatePassTemplate,
      templateToRestore,
      closeRestoreDialog,
      fetchPrivatePassTemplateList,
    }: ConnectedPropsWithStateHandlers) =>
    () =>
      restorePrivatePassTemplate(templateToRestore ?? -1, {
        onSuccess: closeRestoreDialog,
        onBackgroundSuccess: fetchPrivatePassTemplateList,
      }),
  createOrUpdatePrivatePassTemplate:
    ({
      createOrUpdatePrivatePassTemplate,
      createModalOpen,
      closeCreateDialog,
      closeEditDialog,
      goToTemplateDetail,
    }: ConnectedPropsWithStateHandlers) =>
    (data: any, options: OptionCallback<PrivatePassTemplateAPI>) => {
      createOrUpdatePrivatePassTemplate(data, {
        onError: options && options.onError,
        onSuccess: (template?: PrivatePassTemplateAPI) => {
          if (!template) {
            console.error('No template returned on success');
            return;
          }
          if (createModalOpen) {
            goToTemplateDetail(template.id, {
              openTemplateInstanceForm: true,
            });
          } else {
            goToTemplateDetail(template.id);
          }
          closeCreateDialog();
          closeEditDialog();
          if (options && options.onSuccess) {
            options.onSuccess(template);
          }
        },
      });
    },
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedPropsWithStateHandlers = ConnectedProps & StateHandlerType;

export default compose<Props, {}>(
  withStyles(styles),
  withTranslation('privateService'),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(FranchisePrivatePassTemplateListPage);
