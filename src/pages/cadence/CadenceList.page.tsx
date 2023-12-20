import React from 'react';
import classNames from 'classnames';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import withTitle from '#hocs/with-title.hoc';

import {
  fetchCadenceList as fetchCadenceListAction,
  createCadence as createCadenceAction,
  updateCadence as updateCadenceAction,
  archiveCadence as archiveCadenceAction,
  restoreCadence as restoreCadenceAction,
} from '#libs/sequential_marketing/actions';

import {
  getEnabledCadencesList,
  getArchivedCadencesList,
  getCadenceLoading,
  getStepLoading,
} from '#libs/sequential_marketing/selectors';

import CadenceCreateAndUpdateForm from '#libs/sequential_marketing/components/form/CadenceCreateAndUpdateForm.component';
import CadenceList from '#libs/sequential_marketing/components/CadenceList.component';
import CadenceManagerFab from '#libs/sequential_marketing/components/CadenceManagerFab.components';
import CadenceUtilityDialog, {
  DialogVariant,
} from '#libs/sequential_marketing/components/dialogs/DialogUtility';

import { UPSELL_IDENTIFIER_CADENCE } from '#libs/platform-billing/upsell-identifiers';
import UpsellBlocker from '#libs/platform-billing/components/UpsellBlocker.component';
import CustomStarIcon from '#components/icons/CustomStarIcon.component';

import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import type { Cadence } from '#libs/sequential_marketing/types';

const CADENCE_PAGE_SIZE = 500;

type StateHandlerType = typeof StateHandlersInit &
  WithHandlerType<typeof StateHandlersSetter>;

type ConnectedPropsAndState = ConnectedProps<typeof connector> &
  StateHandlerType;

type Props = ConnectedPropsAndState &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  StateHandlerType &
  WithTranslation;

export class CadenceListPage extends React.Component<Props> {
  componentDidMount(): void {
    this.props.fetchCadenceList();
  }

  handleOpenCreationForm = () => this.props.setOpenCreationForm(true);

  handleCloseCreationForm = () => {
    this.props.setOpenCreationForm(false);
    // Using a timeout here to avoid resetting the form information before its closing
    setTimeout(this.handleResetCadenceToEdit, 200);
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

  handleSetCadenceToEdit = (cadence: Cadence) => {
    this.props.setCadenceToEdit(cadence);
    this.props.setOpenCreationForm(true);
  };

  handleUpsertCadence = (
    data: { id?: number; name: string; is_multiple_visit_allowed?: boolean },
    options?: OptionCallback,
  ) => {
    if (!data?.id) {
      return this.props.createCadence(data, {
        onSuccess: (cadenceId: number) => {
          options?.onSuccess?.();
          this.handleCloseCreationFormAndGoToCadencePage(cadenceId);
        },
        onError: () => {
          options?.onError?.();
        },
      });
    }
    return this.props.updateCadence(
      data.id,
      {
        name: data.name,
        is_multiple_visit_allowed: data.is_multiple_visit_allowed,
      },
      {
        onSuccess: (cadence) => {
          options?.onSuccess?.();
          // Updating the value of cadenceToEdit to avoid displaying previous
          // cadence value in the update form before its closing
          this.props.setCadenceToEdit(cadence);
          this.handleCloseCreationForm();
        },
        onError: () => {
          options?.onError?.();
        },
      },
    );
  };

  handleGoToCadencePage = (cadence: Cadence) =>
    cadence?.id && this.props.goToCadencePage(cadence.id);

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
          <UpsellBlocker
            CustomIconComponent={<CustomStarIcon />}
            upsellIdentifier={UPSELL_IDENTIFIER_CADENCE}
          />
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
              {t('audience.form.createAudienceHelper')}
            </Alert>
            <Button
              color="secondary"
              onClick={this.handleOpenCreationForm}
              variant="outlined"
            >
              <AddIcon className={classes.addIcon} />
              {t('audience.form.addAWorkflow')}
            </Button>
          </div>
          <CadenceCreateAndUpdateForm
            displayParametersSection
            loading={cadenceLoading}
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
          <UpsellBlocker
            CustomIconComponent={<CustomStarIcon />}
            upsellIdentifier={UPSELL_IDENTIFIER_CADENCE}
          />
          <div className={classes.pageColumn}>
            <Alert
              classes={{
                root: classes.alert,
              }}
              className={classes.alertHelper}
              severity="info"
              variant="outlined"
            >
              {t('audience.audienceIndexHelper')}
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
          displayParametersSection
          initial={this.props.cadenceToEdit}
          loading={cadenceLoading}
          onCancel={this.handleCloseCreationForm}
          onSubmit={this.handleUpsertCadence}
          open={this.props.openCreationForm}
        />
        <CadenceUtilityDialog
          cadence={cadenceToArchive}
          onCancel={this.handleResetCadenceToArchive}
          onConfirm={this.props.archiveCadence}
          open={!!cadenceToArchive}
          variant={DialogVariant.ARCHIVE_WORKFLOW}
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
  goToCadencePage: (props: ConnectedPropsAndState) => (id: number) =>
    props.push(`/audience/${id}`),

  fetchCadenceList: (props: ConnectedPropsAndState) => () => {
    props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE });
  },

  createCadence:
    (props: ConnectedPropsAndState) =>
    (
      data: { name: string; is_multiple_visit_allowed?: boolean },
      options?: OptionCallback<number>,
    ) => {
      props.createCadenceAction(data, {
        onSuccess: (cadence) => {
          options?.onSuccess?.(cadence?.id);
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  updateCadence:
    (props: ConnectedPropsAndState) =>
    (
      id: number,
      data: { name: string; is_multiple_visit_allowed?: boolean },
      options?: OptionCallback<Cadence>,
    ) => {
      props.updateCadenceAction(id, data, {
        onSuccess: (cadence) => {
          options?.onSuccess?.(cadence);
        },
        onError: () => {
          options?.onError?.();
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
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
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
    cadenceLoading: getCadenceLoading(state),
    stepLoading: getStepLoading(state),
    cadencesList: getEnabledCadencesList(state),
    cadenceArchivedList: getArchivedCadencesList(state),
  }),
  {
    push: pushRouter,
    fetchCadenceListAction,
    createCadenceAction,
    updateCadenceAction,
    archiveCadenceAction,
    restoreCadenceAction,
  },
);

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      display: 'flex',
      gap: theme.spacing(2),
      height: '100%',
      width: '100%',
      position: 'relative',
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
  withTranslation('marketing'),
  withTitle(({ t }) => t('titles:marketing.audience')),
  connector,
  withStateHandlers(StateHandlersInit, StateHandlersSetter),
  withHandlers(mapWithHandlers),
)(CadenceListPage);
