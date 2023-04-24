// @ts-nocheck
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
  getDisabledCadencesList,
  withSteps,
} from '#libs/sequential_marketing/selectors';
import { OptionCallback } from '../../state/types';
import type { Cadence } from '#libs/sequential_marketing/types';
import CadenceList from '#libs/sequential_marketing/components/CadenceList.component';
import CadenceManagerFab from '#libs/sequential_marketing/components/CadenceManagerFab.components';
import CadenceArchiveDialog from '#libs/sequential_marketing/components/CadenceArchivedDialog.component';

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
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
          this.handleCloseCreationForm();
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

  render() {
    const {
      classes,
      t,
      cadenceToArchive,
      cadenceArchivedList,
      cadenceLoading,
      cadencesList,
    } = this.props;

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
              severity="info"
              variant="outlined"
              className={classes.alert}
              icon={<ErrorOutlineIcon className={classes.rotate} />}
            >
              {t('cadence.form.createCadenceHelper')}
            </Alert>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => this.handleOpenCreationForm()}
            >
              <AddIcon className={classes.addIcon} />
              {t('cadence.form.addACadence')}
            </Button>
          </div>
          <CadenceCreateAndUpdateForm
            open={this.props.openCreationForm}
            onCancel={() => this.handleCloseCreationForm()}
            onSubmit={this.handleUpsertCadence}
            loading={this.props.cadenceLoading}
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
              severity="info"
              variant="outlined"
              className={classes.alertHelper}
            >
              {t('cadence.cadenceIndexHelper')}
            </Alert>
            <CadenceList
              cadences={cadencesList}
              cadenceLoading={cadenceLoading}
              onClickItem={(cadence) => this.props.goToCadencePage(cadence?.id)}
              onShow={this.props.goToCadencePage}
              onEdit={this.handleSetCadenceToEdit}
              onDelete={this.handleSetCadenceToArchive}
              selectedId={this.props.selectedCadence?.id}
              updateCadencePriorityIndex={this.props.updateCadencePriorityIndex}
            />
            <div className={classes.paddingTop}>
              {cadenceArchivedList && cadenceArchivedList.length !== 0 && (
                <CadenceList
                  cadences={cadenceArchivedList}
                  cadenceLoading={cadenceLoading}
                  onRestore={this.props.restoreCadence}
                  archivedVersion
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
          open={this.props.openCreationForm || !!this.props.cadenceToEdit}
          initial={this.props.cadenceToEdit}
          onCancel={() => this.handleCloseCreationForm()}
          onSubmit={this.handleUpsertCadence}
          loading={this.props.cadenceLoading}
        />
        <CadenceArchiveDialog
          open={!!cadenceToArchive}
          cadence={cadenceToArchive}
          onCancel={this.handleResetCadenceToArchive}
          onConfirm={this.props.archiveCadence}
        />
        <CadenceManagerFab onAdd={() => this.handleOpenCreationForm()} />
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
    (data: { name: string }, options?: OptionCallback) => {
      props.createCadenceAction(data, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
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
    cadenceLoading: state.cadence.cadence.loading,
    stepLoading: state.cadence.step.loading,
    cadencesList: withSteps(getEnabledCadencesList)(state),
    cadenceArchivedList: withSteps(getDisabledCadencesList)(state),
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
