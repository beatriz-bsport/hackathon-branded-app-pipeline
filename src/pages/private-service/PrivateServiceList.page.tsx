import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import PrivateServiceListItem from '#libs/private-service/components/service/PrivateServiceListItem.component';
// @ts-expect-error
import FuzeSearch from '../../components/FuzeSearch.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import PrivateServiceFormDrawer from '#libs/private-service/components/service/PrivateServiceFormDrawer.component';
import PrivateServiceListWithGroup from '#libs/private-service/components/service/PrivateServiceListWithGroup.component';
import PrivateServiceGroupFormDialog from '#libs/private-service/components/service-group/PrivateServiceGroupFormDialog.component';
import PrivateServiceDeleteDialog from '#libs/private-service/components/service/PrivateServiceDeleteDialog.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import {
  getAvailablePrivateServicesWithoutGroup,
  getPrivateServiceListByGroup,
  getPrivateServiceGroupList,
  getAvailablePrivateServices,
} from '#libs/private-service/selectors/private-service';

import {
  getAvailableEstablishmentsWithAssociatedId,
  getAllEstablishmentsWithAssociatedId,
} from '#libs/establishment/selectors';
import {
  getActiveCoaches,
  getAllCoaches,
} from '#libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '#libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '#libs/establishment/actions';
import {
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchPrivateServiceGroupList as fetchPrivateServiceGroupListAction,
  fetchPrivateService,
  createOrUpdatePrivateService,
  deleteServiceGroup as deleteServiceGroupAction,
  createOrUpdateServiceGroup as createOrUpdateServiceGroupAction,
  deletePrivateService,
} from '#libs/private-service/actions';
import { fetchMarketingNotificationList } from '#libs/marketing/actions';
import { withPrivateBookingNotification } from '#libs/marketing/selectors';

import { getAllTagsWithTagGroup } from '#libs/tag/selectors';

import type {
  PrivateService,
  PrivateServiceGroup,
  PrivateServiceGroupWithService,
} from '#libs/private-service/types';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';

type ConnectProps = ConnectedProps<typeof connector>;

type StateHandlerType = typeof StateHandlersInit &
  WithHandlerType<typeof StateHandlersSetter>;

type ParamsToProps = {
  privateServiceId: number;
};

type ConnectedPropsAndHandlerState = ConnectProps & StateHandlerType;

type Props = {
  privateServiceAvailableWithoutGroup: Array<PrivateService>;
  availablePrivateServices: Array<PrivateService>;
} & ConnectedPropsAndHandlerState &
  WithStyles<typeof styles> &
  WithTranslation &
  ParamsToProps &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  searchText: string;
  searchResult: Array<PrivateService>;
};

const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

export class PrivateServiceList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [] as Array<PrivateService>,
  };

  componentDidMount() {
    this.props.fetchAllPrivateServices();
    this.props.fetchPrivateServiceGroupList({ mine: true });
    this.props.fetchAssociatedCoachesList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind: PRIVATE_BOOKING_CREATION_NOTIFICATION,
    });
  }

  closeForm = () => {
    this.props.setOpenEditForm(null);
    this.props.setOpenCreateForm(false);
  };

  doOpenCreateForm = () => {
    this.props.setOpenCreateForm(true);
  };

  createOrUpdatePrivateService = (data: any, option: OptionCallback) => {
    this.props.createOrUpdatePrivateService(data, {
      onSuccess: (service) => {
        if (option.onSuccess) {
          option.onSuccess();
        }
        this.props.setOpenEditForm(null);
        this.props.setOpenCreateForm(false);
        this.props.fetchAllPrivateServices();
        this.props.goToPrivateService(service.id);
      },
    });
  };

  closeDeleteServiceModal = () => this.props.setOpenDeleteServiceModal(null);

  changeSearch =
    (fuse: any) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      this.setState({
        searchText: ev.target.value,
        searchResult: fuse.search(ev.target.value),
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  trueifinclude = () => {};

  render() {
    const { classes, t } = this.props;

    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.privateServiceAvailableWithoutGroup.length === 0 &&
        this.props.privateServiceAvailableByGroup.length === 0 &&
        !this.props.loading ? (
          <IsEmptyList
            hideBottomActions
            button={this.props.t('service.form.createButton')}
            onCreate={this.doOpenCreateForm}
            text={this.props.t('noPrivateService')}
          />
        ) : (
          <div className={classes.search}>
            <div className={classes.header}>
              <FuzeSearch
                changeSearch={this.changeSearch}
                clearSearch={this.clearSearch}
                items={this.props.availablePrivateServices}
                placeholder={t('search')}
                searchFields={['name']}
                searchResult={this.state.searchResult}
                searchText={this.state.searchText}
              />
            </div>

            <Paper>
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <ObjectLevelPermissionProvider
                  requiredPermission={[
                    'management.privateService.allowed_actions.edit',
                    'management.privateService.allowed_actions.delete',
                  ]}
                >
                  {/* @ts-expect-error */}
                  {([hasEditPermission, hasDeletePermission]) =>
                    this.state.searchResult.map((ps) => (
                      <PrivateServiceListItem
                        key={ps.id}
                        onClick={this.props.goToPrivateService}
                        onDelete={
                          hasDeletePermission
                            ? () => this.props.setOpenDeleteServiceModal(ps.id)
                            : null
                        }
                        onEdit={
                          hasEditPermission
                            ? () => this.props.setOpenEditForm(ps)
                            : null
                        }
                        privateService={ps}
                      />
                    ))
                  }
                </ObjectLevelPermissionProvider>
              </Collapse>
            </Paper>
          </div>
        )}

        <PrivateServiceListWithGroup
          deletePrivateService={this.props.setOpenDeleteServiceModal}
          deleteServiceGroup={this.props.deleteServiceGroup}
          goToPrivateService={this.props.goToPrivateService}
          openServiceGroupToEdit={this.props.openServiceGroupToEdit}
          privateServiceAvailableByGroup={
            this.props.privateServiceAvailableByGroup
          }
          privateServiceAvailableWithoutGroup={
            this.props.privateServiceAvailableWithoutGroup
          }
          setOpenEditForm={this.props.setOpenEditForm}
        />
        {(this.props.serviceGroupToEdit ||
          this.props.serviceGroupCreateOpen) && (
          <PrivateServiceGroupFormDialog
            open
            initial={this.props.serviceGroupToEdit}
            onCancel={this.props.closeServiceGroupForm}
            onSubmit={this.props.createOrUpdateServiceGroup}
          />
        )}
        {this.props.openEditForm || this.props.openCreationForm ? (
          <PrivateServiceFormDrawer
            allCoaches={this.props.allCoaches}
            // @ts-expect-error
            allEstablishments={this.props.allEstablishments}
            // @ts-expect-error
            availableEstablishments={this.props.availableEstablishments}
            coaches={this.props.availableCoaches}
            initial={this.props.openEditForm}
            onAddServiceGroup={this.props.onOpenServiceGroupCreateForm}
            onCancel={this.closeForm}
            onSubmit={this.createOrUpdatePrivateService}
            open={!!this.props.openEditForm || this.props.openCreationForm}
            serviceGroupList={this.props.serviceGroupList}
            tagList={
              this.props.allTagsWithTagGroup
                ? [...this.props.allTagsWithTagGroup]
                : []
            }
          />
        ) : null}

        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="management.privateService.allowed_actions.create"
        >
          <Fab
            className={classes.addButton}
            color="primary"
            onClick={this.doOpenCreateForm}
            variant="extended"
          >
            <AddIcon className={classes.leftIcon} />
            {t('service.form.createButton')}
          </Fab>
        </ObjectLevelPermissionWrapper>
        {this.props.openDeleteServiceModal && (
          <PrivateServiceDeleteDialog
            deletePrivateService={this.props.deletePrivateService}
            onClose={this.closeDeleteServiceModal}
            privateServiceToDeleteId={this.props.openDeleteServiceModal}
          />
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    search: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    titleRow: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    leftPanel: {
      paddingBottom: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        paddingRight: theme.spacing(2),
      },
    },
    serviceListPaperGroup: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    groupIsEmpty: {
      margin: theme.spacing(2),
    },
    rowIsEmpty: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: theme.spacing(1),
    },
  });

type StateHandlerInit = {
  openCreationForm: boolean;
  openEditForm: PrivateService | null;
  openDeleteServiceModal: number | null;
  serviceGroupToEdit: PrivateServiceGroupWithService | null;
  serviceGroupCreateOpen: boolean;
};

const StateHandlersInit: StateHandlerInit = {
  openCreationForm: false,
  openEditForm: null,
  openDeleteServiceModal: null,
  serviceGroupToEdit: null,
  serviceGroupCreateOpen: false,
};

const StateHandlersSetter = {
  setOpenCreateForm: () => (openCreationForm: boolean) => {
    return { openCreationForm };
  },

  setOpenEditForm: () => (openEditForm: PrivateService | null) => {
    return { openEditForm };
  },

  setOpenDeleteServiceModal: () => (openDeleteServiceModal: number | null) => {
    return { openDeleteServiceModal };
  },
  closeServiceGroupForm: () => () => ({
    serviceGroupToEdit: null as PrivateServiceGroupWithService,
    serviceGroupCreateOpen: false,
  }),
  openServiceGroupToEdit:
    () => (serviceGroupToEdit: PrivateServiceGroupWithService) => ({
      serviceGroupToEdit,
    }),
  onOpenServiceGroupCreateForm: () => () => ({
    serviceGroupToEdit: null as PrivateServiceGroupWithService,
    serviceGroupCreateOpen: true,
  }),
};

const connector = connect(
  (state: RootState) => ({
    privateServiceAvailableWithoutGroup: withPrivateBookingNotification(
      getAvailablePrivateServicesWithoutGroup,
    )(state),
    availablePrivateServices: getAvailablePrivateServices(state),
    serviceGroupList: getPrivateServiceGroupList(state),
    loading:
      state.privateService.privateService.loading ||
      state.establishment.loading ||
      state.coach.loading,
    availableCoaches: getActiveCoaches(state),
    availableEstablishments: getAvailableEstablishmentsWithAssociatedId(state),
    allEstablishments: getAllEstablishmentsWithAssociatedId(state),
    privateServiceAvailableByGroup: getPrivateServiceListByGroup(state),
    allCoaches: getAllCoaches(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  }),
  {
    fetchAllPrivateServices: () =>
      fetchAllPrivateServicesAction({ mine: true }),
    fetchPrivateServiceGroupList: fetchPrivateServiceGroupListAction,
    fetchPrivateService,
    fetchAssociatedCoachesList,
    createOrUpdateServiceGroup: createOrUpdateServiceGroupAction,
    fetchEstablishments,
    fetchAssociatedEstablishments,
    createOrUpdatePrivateService,
    deleteServiceGroup: deleteServiceGroupAction,
    goToPrivatePass: () => push('/private-pass'),
    goToPrivateService: (id: number) =>
      push(`/private-service/service/${id}/general`),
    deletePrivateService,
    fetchMarketingNotificationList,
  },
);

const mapWithHandlers = {
  deleteServiceGroup:
    ({
      deleteServiceGroup,
      fetchAllPrivateServices,
    }: ConnectedPropsAndHandlerState) =>
    (id: number, options?: OptionCallback) => {
      deleteServiceGroup(id, {
        onSuccess: (...args) => {
          if (options && options.onSuccess) options.onSuccess(...args);
          fetchAllPrivateServices();
        },
      });
    },

  createOrUpdateServiceGroup:
    ({
      createOrUpdateServiceGroup,
      closeServiceGroupForm,
      fetchPrivateServiceGroupList,
    }: ConnectedPropsAndHandlerState) =>
    (data: Partial<PrivateServiceGroup>, options: OptionCallback) => {
      createOrUpdateServiceGroup(data, {
        onSuccess: (g) => {
          closeServiceGroupForm();
          if (options && options.onSuccess) options.onSuccess(g);
          fetchPrivateServiceGroupList({ mine: true });
        },
      });
    },
};

export default compose(
  withStyles(styles),
  routerParamsToProps({ privateServiceId: 'privateServiceId:number' }),
  withTranslation(['privateService', 'titles']),
  withTitle(({ t }) => t('titles:privateService.serviceList')),
  connector,
  withStateHandlers(StateHandlersInit, StateHandlersSetter),
  withHandlers(mapWithHandlers),
)(PrivateServiceList);
