import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import PrivateServiceListItem from '#src/libs/private-service/components/service/PrivateServiceListItem.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import PrivateServiceFormDrawer from '#src/libs/private-service/components/service/PrivateServiceFormDrawer.component';
import PrivateServiceListWithGroup from '#src/libs/private-service/components/service/PrivateServiceListWithGroup.component';
import PrivateServiceGroupFormDialog from '#src/libs/private-service/components/service-group/PrivateServiceGroupFormDialog.component';
import PrivateServiceDeleteDialog from '#src/libs/private-service/components/service/PrivateServiceDeleteDialog.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import {
  getAvailablePrivateServices,
  getAvailablePrivateServicesWithoutGroup,
  getPrivateServiceGroupList,
  getPrivateServiceListByGroup,
} from '#src/libs/private-service/selectors/private-service';

import {
  getAllEstablishmentsWithAssociatedId,
  getAvailableEstablishmentsWithAssociatedId,
} from '#src/libs/establishment/selectors';
import {
  getActiveCoaches,
  getAllCoaches,
} from '#src/libs/associated-coach/selectors';
import { hasPartnershipByIdentifier } from '#src/libs/classpass/selectors';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';
import {
  fetchAssociatedEstablishments,
  fetchEstablishments,
} from '#src/libs/establishment/actions';
import { fetchPartnershipList as fetchPartnershipListAction } from '#src/libs/classpass/actions';
import {
  createOrUpdatePrivateService,
  createOrUpdateServiceGroup as createOrUpdateServiceGroupAction,
  deletePrivateService,
  deleteServiceGroup as deleteServiceGroupAction,
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchPrivateService,
  fetchPrivateServiceGroupList as fetchPrivateServiceGroupListAction,
} from '#src/libs/private-service/actions';
import { fetchMarketingNotificationList } from '#src/libs/marketing/actions';
import { withPrivateBookingNotification } from '#src/libs/marketing/selectors';
import { getTheme } from '#src/libs/theme/selectors';

import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';

import type { AssociatedEstablishment } from '#src/libs/establishment/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type {
  PrivateService,
  PrivateServiceGroup,
  PrivateServiceGroupWithService,
} from '#src/libs/private-service/types';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import { CLASSPASS_INTEGRATION_IDENTIFIER } from '#src/libs/classpass/constants';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

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
  WithHandlerType<typeof mapWithHandlers> &
  WithObjectSearch;

type State = {};

type PrivateServiceOption = {
  isEditable: boolean;
  label: string;
  onClick: () => void;
  onDelete: () => void;
  privateService: PrivateService;
  value: number;
};

const searchBarAdditionalParams = {
  available: true,
};

const Option: React.FC<OptionPropsWithData<PrivateServiceOption>> = (props) => (
  <PrivateServiceListItem {...props.data} />
);
const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

export class PrivateServiceList extends React.Component<Props, State> {
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
    this.props.fetchPartnershipList();
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
      onError: option.onError,
    });
  };

  closeDeleteServiceModal = () => this.props.setOpenDeleteServiceModal(null);

  deletePrivateService = (id: number) =>
    this.props.deletePrivateService(id, {
      onSuccess: () => {
        this.props.setOpenDeleteServiceModal(null);
        this.props.refreshOptions('private_service', searchBarAdditionalParams);
      },
      onError: () => {
        this.props.setOpenDeleteServiceModal(null);
        this.props.refreshOptions('private_service', searchBarAdditionalParams);
      },
    });

  privateServiceOptionsFormatter =
    (hasEditPermission: boolean, hasDeletePermission: boolean) =>
    (privateServices: PrivateService[]): PrivateServiceOption[] =>
      privateServices.map((privateService) => {
        return {
          label: privateService.name,
          onDelete: hasDeletePermission
            ? () => this.props.setOpenDeleteServiceModal(privateService.id)
            : null,
          onEdit: hasEditPermission
            ? () => this.props.setOpenEditForm(privateService)
            : null,
          privateService,
          isEditable: hasEditPermission,
          onClick: () => this.props.goToPrivateService(privateService.id),
          value: privateService.id,
        };
      });

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
          <ObjectLevelPermissionProvider
            requiredPermission={[
              'management.privateService.allowed_actions.edit',
              'management.privateService.allowed_actions.delete',
            ]}
          >
            {([hasEditPermission, hasDeletePermission]: boolean[]) => (
              <div className={classes.search}>
                <ObjectSearchComponent
                  additionalParams={searchBarAdditionalParams}
                  components={{
                    Option,
                  }}
                  optionsFormatter={this.privateServiceOptionsFormatter(
                    hasEditPermission,
                    hasDeletePermission,
                  )}
                  placeholder={t('search')}
                  searchedObjectType="private_service"
                  variant="underlined"
                />
              </div>
            )}
          </ObjectLevelPermissionProvider>
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
            companyId={this.props.companyId}
            initial={this.props.openEditForm}
            isIntegratedWithClassPass={this.props.isIntegratedWithClassPass}
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
            deletePrivateService={this.deletePrivateService}
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
  openEditForm:
    | PrivateService
    | PrivateService<Coach, AssociatedEstablishment>
    | null;
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

  setOpenEditForm:
    () =>
    (
      openEditForm:
        | PrivateService
        | PrivateService<Coach, AssociatedEstablishment>
        | null,
    ) => {
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
    isIntegratedWithClassPass: hasPartnershipByIdentifier(
      state,
      CLASSPASS_INTEGRATION_IDENTIFIER,
    ),
    companyId: getTheme(state)?.company,
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
    fetchPartnershipList: fetchPartnershipListAction,
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
  withObjectSearch,
  routerParamsToProps({ privateServiceId: 'privateServiceId:number' }),
  withTranslation(['privateService', 'titles']),
  withTitle(({ t }) => t('titles:privateService.serviceList')),
  connector,
  withStateHandlers(StateHandlersInit, StateHandlersSetter),
  withHandlers(mapWithHandlers),
)(PrivateServiceList);
