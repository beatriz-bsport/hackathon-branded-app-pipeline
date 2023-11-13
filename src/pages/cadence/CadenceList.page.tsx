import React, { Component } from 'react';
import classNames from 'classnames';
import { push as pushRouter } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import withTitle from '#hocs/with-title.hoc';
import { RootState } from '../../reducers';
import CadenceCreateAndUpdateForm from '#libs/sequential_marketing/components/form/CadenceCreateAndUpdateForm.component';

import {
  fetchCadenceList as fetchCadenceListAction,
  createCadence as createCadenceAction,
  updateCadence as updateCadenceAction,
  archiveCadence as archiveCadenceAction,
  restoreCadence as restoreCadenceAction,
} from '#libs/sequential_marketing/actions';

import { WithHandlerType } from '../../utils/types';

import {
  getEnabledCadencesList,
  getArchivedCadencesList,
} from '#libs/sequential_marketing/selectors';

import { OptionCallback } from '../../state/types';
import type { Cadence } from '#libs/sequential_marketing/types';
import CadenceList from '#libs/sequential_marketing/components/CadenceList.component';
import CadenceManagerFab from '#libs/sequential_marketingDEPRECATED/components/CadenceManagerFab.components';
import CadenceUtilityDialog, {
  type DialogVariant,
} from '#libs/sequential_marketing/components/dialogs/DialogUtility';

const CADENCE_PAGE_SIZE = 100;
type OwnProps = {
  title: string;
};

type StateHandlerType = typeof StateHandlersInit &
  WithHandlerType<typeof StateHandlersSetter>;

type ConnectedPropsAndState = ConnectedProps<typeof connector> &
  StateHandlerType;

type Props = OwnProps &
  ConnectedPropsAndState &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  StateHandlerType &
  WithTranslation;

export class CadenceDetailPage extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchCadenceList();
  }

  handleOpenCreationForm = () => this.props.setOpenCreationForm(true);

  handleCloseCreationForm = () => {
    this.props.setOpenCreationForm(false);
    this.handleResetCadenceToEdit();
  };

  handleCloseCreationFormAndGoToCadencePage = (id: number) => {
    this.props.setOpenCreationForm(false);
    this.handleResetCadenceToEdit();
    if (id) {
      this.props.goToCadencePage(id);
    }
  };

  handleResetCadenceToEdit = () => this.props.setCadenceToEdit(null);

  handleSetCadenceToArchive = (cadence: Cadence) =>
    this.props.setCadenceToArchive(cadence);

  handleResetCadenceToArchive = () => this.props.setCadenceToArchive(null);

  handleSetCadenceToEdit = (cadence: Cadence) =>
    this.props.setCadenceToEdit(cadence);

  handleUpsertCadence = (
    data: { id?: number; name: string },
    options?: OptionCallback,
  ) => {
    if (!data?.id) {
      return this.props.createCadence(data, {
        onSuccess: (cadenceId: number) => {
          options && options.onSuccess && options.onSuccess();
          this.handleCloseCreationFormAndGoToCadencePage(cadenceId);
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    }
    return this.props.updateCadence(data.id, data, {
      onSuccess: () => {
        options && options.onSuccess && options.onSuccess();
        this.handleCloseCreationForm();
      },
      onError: () => {
        options && options.onError && options.onError();
      },
    });
  };

  handleGoToCadencePage = (cadence: Cadence) => {
    cadence?.id && this.props.goToCadencePage(cadence.id);
  };

  render() {
    const {
      classes,
      t,
      cadenceToArchive,
      cadenceArchivedList,
      cadenceLoading,
      cadencesList,
    } = this.props;
    const archiveCadenceDialogVariant: DialogVariant = 'archive-workflow';

    if (
      !cadenceLoading &&
      (!cadencesList || cadencesList?.length === 0) &&
      (!cadenceArchivedList || cadenceArchivedList?.length === 0)
    ) {
      return (
        <div className={classes.centerHorizontal}>
          <div className={classes.centerVertical}>
            <Alert
              classes={{
                root: classes.alert,
                outlinedInfo: classes.outlinedInfo,
                icon: classes.alertIcon,
              }}
              className={classes.alert}
              icon={<ErrorOutlineIcon className={classes.rotate} />}
              severity="info"
              variant="outlined"
            >
              {t('cadence.form.createCadenceHelper')}
            </Alert>
            <Button
              color="secondary"
              onClick={this.handleOpenCreationForm}
              variant="outlined"
            >
              <AddIcon className={classes.addIcon} />
              {t('cadence.form.addACadence')}
            </Button>
          </div>
          <CadenceCreateAndUpdateForm
            loading={this.props.cadenceLoading}
            onCancel={this.handleCloseCreationForm}
            onSubmit={this.handleUpsertCadence}
            open={this.props.openCreationForm}
          />
        </div>
      );
    }
    return (
      <>
        <div className={classes.pageContainer}>
          <div className={classes.pageColumn}>
            <Alert
              classes={{
                root: classes.alert,
              }}
              className={classes.alertHelper}
              severity="info"
              variant="outlined"
            >
              {t('cadence.cadenceIndexHelper')}
            </Alert>
            <CadenceList
              cadenceLoading={cadenceLoading}
              cadences={cadencesList}
              onClickItem={this.handleGoToCadencePage}
              onDelete={this.handleSetCadenceToArchive}
              onEdit={this.handleSetCadenceToEdit}
              onShow={this.props.goToCadencePage}
              selectedId={this.props.selectedCadence?.id}
              updateCadencePriorityIndex={this.props.updateCadencePriorityIndex}
            />
            <div className={classes.paddingTop}>
              {cadenceArchivedList && cadenceArchivedList.length !== 0 && (
                <CadenceList
                  archivedVersion
                  cadenceLoading={cadenceLoading}
                  cadences={cadenceArchivedList}
                  onRestore={this.props.restoreCadence}
                />
              )}
            </div>
          </div>
          <div
            className={classNames(
              classes.pageColumn,
              classes.hideOnSmallScreen,
            )}
          />
        </div>
        <CadenceCreateAndUpdateForm
          initial={this.props.cadenceToEdit}
          loading={this.props.cadenceLoading}
          onCancel={this.handleCloseCreationForm}
          onSubmit={this.handleUpsertCadence}
          open={this.props.openCreationForm || !!this.props.cadenceToEdit}
        />
        <CadenceUtilityDialog
          cadence={cadenceToArchive}
          onCancel={this.handleResetCadenceToArchive}
          onConfirm={this.props.archiveCadence}
          open={!!cadenceToArchive}
          variant={archiveCadenceDialogVariant}
        />
        <CadenceManagerFab onAdd={this.handleOpenCreationForm} />
      </>
    );
  }
}
type StateHandlerInit = {
  openCreationForm: boolean;
  cadenceToEdit: Cadence | null;
  selectedCadence: Cadence | null;
  cadenceToArchive: Cadence | null;
};
const StateHandlersInit: StateHandlerInit = {
  openCreationForm: false,
  cadenceToEdit: null,
  selectedCadence: null,
  cadenceToArchive: null,
};

const StateHandlersSetter = {
  setOpenCreationForm: () => (openCreationForm: boolean) => {
    return { openCreationForm };
  },

  setCadenceToEdit: () => (cadenceToEdit: Cadence | null) => {
    return { cadenceToEdit };
  },

  setSelectedCadence: () => (selectedCadence: Cadence | null) => {
    return { selectedCadence };
  },

  setCadenceToArchive: () => (cadenceToArchive: Cadence | null) => {
    return { cadenceToArchive };
  },
};

const mapWithHandlers = {
  fetchCadenceList: (props: ConnectedPropsAndState) => () => {
    props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE });
  },
  createCadence:
    (props: ConnectedPropsAndState) =>
    (data: { name: string }, options?: OptionCallback<number>) => {
      props.createCadenceAction(data, {
        onSuccess: (cadence) => {
          options && options.onSuccess && options.onSuccess(cadence?.id);
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },

  updateCadence:
    (props: ConnectedPropsAndState) =>
    (id: number, data: { name: string }, options?: OptionCallback) => {
      props.updateCadenceAction(id, data, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },
  updateCadencePriorityIndex:
    (props: ConnectedPropsAndState) =>
    (
      id: number,
      data: { priority_index: number },
      options?: OptionCallback,
    ) => {
      props.updateCadenceAction(id, data, {
        onSuccess: () => {
          props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE });
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },
  archiveCadence: (props: ConnectedPropsAndState) => () => {
    if (props.cadenceToArchive) {
      props.archiveCadenceAction(props.cadenceToArchive?.id, {
        onSuccess: () =>
          props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE }),
        onError: () =>
          props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE }),
      });
      props.setCadenceToArchive(null);
      if (props.cadenceToArchive?.id === props.selectedCadence?.id) {
        props.setSelectedCadence(null);
      }
    }
  },

  restoreCadence: (props: ConnectedPropsAndState) => (id: number) =>
    props.restoreCadenceAction(id),
};
const connector = connect(
  (state: RootState) => ({
    cadenceLoading: state.cadenceWIP.cadence.loading,
    stepLoading: state.cadence.step.loading,
    cadencesList: getEnabledCadencesList(state),
    cadenceArchivedList: getArchivedCadencesList(state),
  }),
  {
    fetchCadenceListAction,
    createCadenceAction,
    updateCadenceAction,
    archiveCadenceAction,
    restoreCadenceAction,
    goToCadencePage: (id: number) => pushRouter(`/cadence/${id}`),
  },
);
const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      display: 'flex',
      gap: theme.spacing(2),
    },
    pageColumn: {
      paddingTop: theme.spacing(2),
      flex: 1,
    },
    hideOnSmallScreen: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    alert: {
      alignItems: 'center',
    },
    outlinedInfo: {
      color: 'black',
      borderColor: 'transparent',
    },
    alertIcon: {
      color: 'black',
    },
    centerHorizontal: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: theme.spacing(4),
    },
    centerVertical: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing(4),
      width: '50%',
    },
    rotate: {
      transform: 'rotate(180deg)',
      color: 'black',
    },
    addIcon: {
      marginRight: theme.spacing(1),
    },
    paddingTop: {
      paddingTop: theme.spacing(3),
    },
    alertHelper: {
      marginBottom: theme.spacing(2),
    },
  });
export default compose(
  withStyles(styles),
  withTranslation(['marketing']),
  withTitle(({ t }) => t('titles:marketing.cadence')),
  connector,
  withStateHandlers(StateHandlersInit, StateHandlersSetter),
  withHandlers(mapWithHandlers),
)(CadenceDetailPage);
