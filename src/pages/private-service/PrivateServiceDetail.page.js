// @flow

import { withNamespaces } from 'react-i18next';
import React from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose, withState, withHandlers, withStateHandlers } from 'recompose';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import PrivateServiceGroupFormDialog from '../../libs/private-service/components/service-group/PrivateServiceGroupFormDialog.component';

import PrivateServiceFormDialog from '../../libs/private-service/components/service/PrivateServiceFormDialog.component';
import PrivateServiceDetailPage from '../../libs/private-service/components/service/PrivateServiceDetailPage.component';

import {
  getPrivateServiceById,
  getPrivateServices,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';
import { getResourceSlotsExistState } from '../../libs/private-service/selectors/availability-slot';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import { getAllEstablishmentsWithAssociatedId } from '../../libs/establishment/selectors';
import {
  getAllCoaches,
  getActiveCoaches,
} from '../../libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '../../libs/establishment/actions';
import {
  fetchAllPrivateServices,
  fetchPrivateService as fetchPrivateServiceAction,
  createOrUpdatePrivateService,
  fetchPrivateSlotList,
  switchServiceHasOwnAvailabilitySlots,
  createOrUpdatePrivateSlot,
  deletePrivateSlot as deletePrivateSlotAction,
  deletePrivateService,
  checkExistsAvailabilitySlots,
  createOrUpdateServiceGroup as createOrUpdateServiceGroupAction,
  fetchPrivateServiceGroupList as fetchPrivateServiceGroupListAction,
} from '../../libs/private-service/actions';
import type { PrivateService } from '../../libs/private-service/types';

type Props = {
  privateService: PrivateService,
  createOrUpdatePrivateService: (
    data: *,
    options: { onSuccess: () => void },
  ) => void,
  fetchPrivateSlotList: (privateServiceId: number) => void,
  createOrUpdatePrivateSlot: (any) => void,
  deletePrivateSlot: (privateServiceId: number, privateSlotId: number) => void,
  deletePrivateService: (id: number) => void,
  id: number,
  fetchAssociatedCoachesList: () => void,
  setOpenEditForm: (data: any) => void,

  fetchPrivateService: (id: number) => void,
  goToPrivateServiceCalendar: (number) => void,

  switchServiceHasOwnAvailabilitySlots: (id: number) => void,

  openEditForm: any,
  availableCoaches: Array<AssociatedCoach>,
  goToCoachCalendar: (id: number) => void,

  availableEstablishments: Array<Establishment>,
  fetchAssociatedEstablishments: () => void,
  goToEstablishmentCalendar: (id: number) => void,

  checkExistsAvailabilitySlots: (resourceDatatype, resourceId) => void,
  fetchEstablishments: (any) => void,

  getResourceSlotsExistState: (
    resourceDatatype: string,
    resourceId: number,
  ) => void,

  loading: boolean,
  fetchPrivateServiceGroupList: () => void,
  serviceGroupList: Array<PrivateGroup>,
  onOpenServiceGroupCreateForm: () => void,
  serviceGroupCreateOpen: boolean,
  createOrUpdateServiceGroup: (
    data: { id?: number, name: string },
    options: OptionCallback,
  ) => void,
  closeServiceGroupForm: () => void,
};

export class PrivateServiceList extends React.Component<Props> {
  componentDidMount() {
    this.fetchData();
    this.props.fetchPrivateServiceGroupList();
  }

  fetchData = () => {
    this.props.fetchPrivateService(this.props.id, {
      onSuccess: (service) => {
        this.props.checkExistsAvailabilitySlots(
          'private_service',
          this.props.id,
        );
        this.props.fetchAssociatedCoachesList({
          associated_coach__in: service.coaches,
        });
        service.coaches.map((i) =>
          this.props.checkExistsAvailabilitySlots('associated_coach', i),
        );
        this.props.fetchEstablishments({
          associated_establishment__in: service.establishments,
        });
        service.establishments.map((i) =>
          this.props.checkExistsAvailabilitySlots(
            'associated_establishment',
            i,
          ),
        );
      },
    });
    this.props.fetchPrivateSlotList(this.props.id);
  };

  closeForm = () => {
    this.props.setOpenEditForm(null);
  };

  createOrUpdatePrivateService = (data: *) => {
    this.props.createOrUpdatePrivateService(data, {
      onSuccess: () => {
        this.fetchData();
        this.props.setOpenEditForm(null);
      },
    });
  };

  render() {
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.privateService ? (
          <PrivateServiceDetailPage
            onDelete={this.props.deletePrivateService}
            privateService={this.props.privateService}
            createOrUpdatePrivateSlot={this.props.createOrUpdatePrivateSlot}
            deletePrivateSlot={this.props.deletePrivateSlot}
            getResourceSlotsExistState={this.props.getResourceSlotsExistState}
            goToCoachCalendar={this.props.goToCoachCalendar}
            goToEstablishmentCalendar={this.props.goToEstablishmentCalendar}
            goToPrivateServiceCalendar={this.props.goToPrivateServiceCalendar}
            switchServiceHasOwnAvailabilitySlots={() =>
              this.props.switchServiceHasOwnAvailabilitySlots(
                this.props.privateService.id,
              )
            }
          />
        ) : null}
        {this.props.openEditForm ? (
          <PrivateServiceFormDialog
            initial={this.props.privateService}
            open={this.props.openEditForm}
            onCancel={this.closeForm}
            onSubmit={this.createOrUpdatePrivateService}
            coaches={this.props.availableCoaches}
            establishments={this.props.availableEstablishments}
            serviceGroupList={this.props.serviceGroupList}
            onAddServiceGroup={this.props.onOpenServiceGroupCreateForm}
          />
        ) : null}
        {this.props.serviceGroupCreateOpen && (
          <PrivateServiceGroupFormDialog
            open
            onSubmit={this.props.createOrUpdateServiceGroup}
            onCancel={this.props.closeServiceGroupForm}
          />
        )}
        <BottomActionButtons
          onEdit={() => {
            this.props.fetchAssociatedCoachesList();
            this.props.fetchEstablishments();
            this.props.fetchAssociatedEstablishments();
            this.props.setOpenEditForm(true);
          }}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withNamespaces(['privateService']),
  withTitle(({ t }) => t('pageTitles.serviceList')),
  connect(
    (state, { id }) => ({
      privateService: getPrivateServiceById(state, id),
      privateServices: getPrivateServices(state),
      loading:
        state.privateService.privateService.loading ||
        state.privateService.privateSlot.loading,
      allCoaches: getAllCoaches(state),
      allEstablishments: getAllEstablishmentsWithAssociatedId(state),
      availableCoaches: getActiveCoaches(state),
      serviceGroupList: getPrivateServiceGroupList(state),
      availableEstablishments: getAllEstablishmentsWithAssociatedId(state),
      getResourceSlotsExistState: (resourceDatatype, resourceIdentifier) =>
        getResourceSlotsExistState(
          state.privateService,
          resourceDatatype,
          resourceIdentifier,
        ),
    }),
    {
      fetchAllPrivateServices,
      createOrUpdateServiceGroup: createOrUpdateServiceGroupAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchAssociatedCoachesList,
      createOrUpdatePrivateService,
      fetchPrivateSlotList,
      switchServiceHasOwnAvailabilitySlots,

      fetchEstablishments,
      fetchAssociatedEstablishments,
      fetchPrivateServiceGroupList: fetchPrivateServiceGroupListAction,

      createOrUpdatePrivateSlot,
      deletePrivateSlot: deletePrivateSlotAction,
      deletePrivateService,
      checkExistsAvailabilitySlots,

      goToPrivateServiceCalendar: (id) =>
        push(`/private-service/service/${id}/calendar`),
      goToCoachCalendar: (id) => push(`/coach/${id}/private-calendar`),
      goToEstablishmentCalendar: (id) =>
        push(`/establishment/details/${id}/calendar`),
    },
  ),
  withHandlers({
    deletePrivateSlot: ({ deletePrivateSlot, fetchPrivateService, id }) => (
      slotId,
    ) => {
      deletePrivateSlot(id, slotId, {
        onSuccess: () => fetchPrivateService(id),
      });
    },
  }),
  withState('openEditForm', 'setOpenEditForm', null),
  withStateHandlers(
    { serviceGroupToEdit: null, serviceGroupCreateOpen: false },
    {
      closeServiceGroupForm: () => () => ({
        serviceGroupCreateOpen: false,
      }),
      onOpenServiceGroupCreateForm: () => () => ({
        serviceGroupCreateOpen: true,
      }),
    },
  ),
  withHandlers({
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
