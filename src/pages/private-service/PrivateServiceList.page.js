// @flow

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose, withState, withStateHandlers, withHandlers } from 'recompose';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import PrivateServiceFormDialog from '../../libs/private-service/components/service/PrivateServiceFormDialog.component';
import PrivateServiceListWithGroup from '../../libs/private-service/components/service/PrivateServiceListWithGroup.component';
import PrivateServiceGroupFormDialog from '../../libs/private-service/components/service-group/PrivateServiceGroupFormDialog.component';

import {
  getAvailablePrivateServicesWithoutGroup,
  getPrivateServiceListByGroup,
  getPrivateServiceById,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';

import { getAllEstablishmentsWithAssociatedId } from '../../libs/establishment/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '../../libs/establishment/actions';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceGroupList,
  fetchPrivateService,
  createOrUpdatePrivateService,
  deleteServiceGroup,
  createOrUpdateServiceGroup,
  deletePrivateService,
} from '../../libs/private-service/actions';

import type { PrivateService } from '../../libs/private-service/types';

type Props = {
  privateServices: Array<PrivateService>,
  fetchAllPrivateServices: () => void,
  createOrUpdatePrivateService: (
    data: *,
    options: { onSuccess: () => void },
  ) => void,
  goToPrivateService: (id: number) => void,
  deletePrivateService: (id: number) => void,
  fetchAssociatedCoachesList: () => void,
  fetchEstablishments: () => void,
  setOpenEditForm: (data: any) => void,
  selectedPrivateService: ?PrivateService,
  availableEstablishments: Array<Establishment>,
  openEditForm: any,
  availableCoaches: Array<AssociatedCoach>,
  fetchEstablishments: () => void,
  fetchAssociatedEstablishments: () => void,

  openCreateForm: boolean,
  loading: boolean,
  setOpenCreateForm: (boolean) => void,
  t: TFunction,
  classes: Object,
};

export class PrivateServiceList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllPrivateServices();
    this.props.fetchPrivateServiceGroupList();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments();
  }

  closeForm = () => {
    this.props.setOpenEditForm(null);
    this.props.setOpenCreateForm(false);
  };

  createOrUpdatePrivateService = (data: *) => {
    this.props.createOrUpdatePrivateService(data, {
      onSuccess: (service) => {
        this.props.setOpenEditForm(null);
        this.props.setOpenCreateForm(false);
        this.props.fetchAllPrivateServices();
        this.props.goToPrivateService(service.id);
      },
    });
  };

  render() {
    const { classes, t, selectedPrivateService } = this.props;

    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateServiceListWithGroup
          privateServiceAvailableByGroup={
            this.props.privateServiceAvailableByGroup
          }
          openServiceGroupToEdit={this.props.openServiceGroupToEdit}
          deleteServiceGroup={this.props.deleteServiceGroup}
          goToPrivateService={this.props.goToPrivateService}
          setOpenEditForm={this.props.setOpenEditForm}
          deletePrivateService={this.props.deletePrivateService}
          selectedPrivateService={this.props.selectedPrivateService}
          privateServiceAvailableWithoutGroup={
            this.props.privateServiceAvailableWithoutGroup
          }
        />
        {(this.props.serviceGroupToEdit ||
          this.props.serviceGroupCreateOpen) && (
          <PrivateServiceGroupFormDialog
            open
            initial={this.props.serviceGroupToEdit}
            onSubmit={this.props.createOrUpdateServiceGroup}
            onCancel={this.props.closeServiceGroupForm}
          />
        )}
        {this.props.openEditForm || this.props.openCreateForm ? (
          <PrivateServiceFormDialog
            initial={this.props.openEditForm}
            open={this.props.openEditForm || this.props.openCreateForm}
            onCancel={this.closeForm}
            onSubmit={this.createOrUpdatePrivateService}
            coaches={this.props.availableCoaches}
            establishments={this.props.availableEstablishments}
            serviceGroupList={this.props.serviceGroupList}
            onAddServiceGroup={this.props.onOpenServiceGroupCreateForm}
          />
        ) : null}
        <Fab
          className={classes.addButton}
          variant="extended"
          color="primary"
          onClick={() => this.props.setOpenCreateForm(true)}
        >
          <AddIcon className={classes.leftIcon} />
          {t('service.form.createButton')}
        </Fab>
      </div>
    );
  }
}

const styles = (theme) => ({
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

export default compose(
  withStyles(styles),
  routerParamsToProps({ privateServiceId: 'privateServiceId:number' }),
  withNamespaces(['privateService']),
  withTitle(({ t }) => t('pageTitles.serviceList')),
  connect(
    (state, { privateServiceId }) => ({
      privateServiceAvailableWithoutGroup: getAvailablePrivateServicesWithoutGroup(
        state,
      ),
      serviceGroupList: getPrivateServiceGroupList(state),
      loading:
        state.privateService.privateService.loading ||
        state.establishment.loading ||
        state.coach.loading,
      availableCoaches: getActiveCoaches(state),
      availableEstablishments: getAllEstablishmentsWithAssociatedId(state),
      privateServiceAvailableByGroup: getPrivateServiceListByGroup(state),
      selectedPrivateService: getPrivateServiceById(state, privateServiceId),
    }),
    {
      fetchAllPrivateServices,
      fetchPrivateServiceGroupList,
      fetchPrivateService,
      fetchAssociatedCoachesList,
      createOrUpdateServiceGroup,
      fetchEstablishments,
      fetchAssociatedEstablishments,
      createOrUpdatePrivateService,
      deleteServiceGroup,
      goToPrivateService: (id) =>
        push(`/private-service/service/${id}/general`),
      deletePrivateService,
    },
  ),
  withState('openCreateForm', 'setOpenCreateForm', false),
  withState('openEditForm', 'setOpenEditForm', null),
  withStateHandlers(
    { serviceGroupToEdit: null, serviceGroupCreateOpen: false },
    {
      closeServiceGroupForm: () => () => ({
        serviceGroupToEdit: null,
        serviceGroupCreateOpen: false,
      }),
      openServiceGroupToEdit: () => (serviceGroupToEdit) => ({
        serviceGroupToEdit,
      }),
      onOpenServiceGroupCreateForm: () => () => ({
        serviceGroupToEdit: null,
        serviceGroupCreateOpen: true,
      }),
    },
  ),
  withHandlers({
    deleteServiceGroup: ({ deleteServiceGroup, fetchAllPrivateServices }) => (
      id,
      options,
    ) => {
      deleteServiceGroup(id, {
        onSuccess: (...args) => {
          if (options && options.onSuccess) options.onSuccess(...args);
          fetchAllPrivateServices();
        },
      });
    },
    createOrUpdateServiceGroup: ({
      createOrUpdateServiceGroup,
      closeServiceGroupForm,
      fetchPrivateServiceGroupList,
    }) => (data, options) => {
      createOrUpdateServiceGroup(data, {
        onSuccess: (g) => {
          closeServiceGroupForm();
          if (options && options.onSuccess) options.onSuccess(g);
          fetchPrivateServiceGroupList();
        },
      });
    },
  }),
)(PrivateServiceList);
