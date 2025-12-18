// @flow

import { withTranslation } from 'react-i18next';
import React from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers, withStateHandlers } from 'recompose';

import { getAllSmartList } from '#src/libs/smart-list/selectors';
import { fetchAllSmartLists } from '#src/libs/smart-list/actions';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { SmartList } from '#src/libs/smart-list/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import PrivateServiceGroupFormDialog from '../../libs/private-service/components/service-group/PrivateServiceGroupFormDialog.component';

import PrivateServiceFormDrawer from '../../libs/private-service/components/service/PrivateServiceFormDrawer.component';
import PrivateServiceDetailPage from '../../libs/private-service/components/service/PrivateServiceDetailPage.component';
import ObjectLevelPermissionWrapper from '../../libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

import {
  getPrivateServiceById,
  getPrivateServices,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';
import { getTheme } from '#src/libs/theme/selectors';

import { getResourceSlotsExistState } from '../../libs/private-service/selectors/availability-slot';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import {
  getAvailableEstablishmentsWithAssociatedId,
  getAllEstablishmentsWithAssociatedId,
} from '../../libs/establishment/selectors';
import {
  getAllCoaches,
  getActiveCoaches,
} from '../../libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '../../libs/establishment/actions';
import { fetchPartnershipList as fetchPartnershipListAction } from '#src/libs/classpass/actions';
import { hasPartnershipByIdentifier } from '#src/libs/classpass/selectors';
import {
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchPrivateService as fetchPrivateServiceAction,
  createOrUpdatePrivateService,
  switchServiceHasOwnAvailabilitySlots,
  createOrUpdatePrivateSlot,
  deletePrivateSlot as deletePrivateSlotAction,
  deletePrivateService,
  checkExistsAvailabilitySlots,
  createOrUpdateServiceGroup as createOrUpdateServiceGroupAction,
  fetchPrivateServiceGroupList as fetchPrivateServiceGroupListAction,
} from '../../libs/private-service/actions';
import type { PrivateService } from '../../libs/private-service/types';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '../../libs/marketing/actions';
import { getPrivateBookingNotifications } from '../../libs/marketing/selectors';
import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import { CLASSPASS_INTEGRATION_IDENTIFIER } from '#src/libs/classpass/constants';

const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

type Props = {
  privateService: PrivateService,
  createOrUpdatePrivateService: (
    data: any,
    options: { onSuccess: () => void },
  ) => void,
  fetchAllPrivateSlots: () => void,
  createOrUpdatePrivateSlot: (any) => void,
  deletePrivateSlot: (privateServiceId: number, privateSlotId: number) => void,
  deletePrivateService: (id: number) => void,
  id: number,
  fetchAssociatedCoachesList: () => void,
  setIsEditFormOpen: (isEditFormOpen: boolean) => void,
  setShouldRenderForm: (shouldRenderForm: boolean) => void,

  fetchPrivateService: (id: number) => void,
  goToPrivateServiceCalendar: (number) => void,

  switchServiceHasOwnAvailabilitySlots: (id: number) => void,

  isEditFormOpen: boolean,
  shouldRenderForm: boolean,
  availableCoaches: Array<AssociatedCoach>,
  isIntegratedWithClassPass: boolean,
  goToCoachCalendar: (id: number) => void,

  availableEstablishments: Array<Establishment>,
  allEstablishments: Array<Establishment>,
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
  fetchPartnershipList: () => void,
  fetchNotificationsAndTemplates: () => void,
  notifications: { items: Array<any>, loading: boolean },
  createNotification: (data: any) => void,
  updateMarketingNotification: (id: number, data: any) => void,
  deleteMarketingNotification: (id: number) => void,

  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  email_templates_list: Array<any>,
  email_templates_details: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  allCoaches: Array<AssociatedCoach>,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
  goToSmartlist: () => void,
  getSmartLists: () => void,
  smartLists: SmartList[],
  companyId: number,
};

export class PrivateServiceList extends React.Component<Props> {
  componentDidMount() {
    this.fetchData();
    this.props.fetchPrivateServiceGroupList({ mine: true });
    this.props.fetchNotificationsAndTemplates();
    this.props.fetchPartnershipList();
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
    this.props.fetchAllPrivateSlots({ private_service: this.props.id });
  };

  closeForm = () => {
    this.props.setIsEditFormOpen(false);
  };

  handleTransitionEnd = () => {
    if (!this.props.isEditFormOpen) {
      this.props.setShouldRenderForm(false);
    }
  };

  handleFormEdit = () => {
    this.props.fetchAssociatedCoachesList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments();
    this.props.setIsEditFormOpen(true);
    this.props.setShouldRenderForm(true);
  };

  createOrUpdatePrivateService = (data: *, options: OptionCallback) => {
    this.props.createOrUpdatePrivateService(data, {
      onSuccess: () => {
        this.fetchData();
        this.props.setIsEditFormOpen(false);
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onSuccess) options.onError();
      },
    });
  };

  render() {
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.privateService ? (
          <PrivateServiceDetailPage
            createNotification={this.props.createNotification}
            createOrUpdatePrivateSlot={this.props.createOrUpdatePrivateSlot}
            deleteNotification={this.props.deleteMarketingNotification}
            deletePrivateSlot={this.props.deletePrivateSlot}
            emailDetailLoading={this.props.emailDetailLoading}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emails={this.props.email_templates_list}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            getResourceSlotsExistState={this.props.getResourceSlotsExistState}
            getSmartLists={this.props.getSmartLists}
            goToCoachCalendar={this.props.goToCoachCalendar}
            goToEstablishmentCalendar={this.props.goToEstablishmentCalendar}
            goToPrivateServiceCalendar={this.props.goToPrivateServiceCalendar}
            goToSmartlist={this.props.goToSmartlist}
            notifications={this.props.notifications}
            onDelete={this.props.deletePrivateService}
            privateService={this.props.privateService}
            smartLists={this.props.smartLists}
            switchServiceHasOwnAvailabilitySlots={() =>
              this.props.switchServiceHasOwnAvailabilitySlots(
                this.props.privateService.id,
              )
            }
            tagList={this.props.allTagsWithTagGroup ?? []}
            updateNotification={this.props.updateMarketingNotification}
          />
        ) : null}
        {this.props.privateService && this.props.shouldRenderForm ? (
          <PrivateServiceFormDrawer
            allCoaches={this.props.allCoaches}
            allEstablishments={this.props.allEstablishments}
            availableEstablishments={this.props.availableEstablishments}
            coaches={this.props.availableCoaches}
            companyId={this.props.companyId}
            initial={this.props.privateService}
            isIntegratedWithClassPass={this.props.isIntegratedWithClassPass}
            onAddServiceGroup={this.props.onOpenServiceGroupCreateForm}
            onCancel={this.closeForm}
            onSubmit={this.createOrUpdatePrivateService}
            onTransitionEnd={this.handleTransitionEnd}
            open={this.props.isEditFormOpen}
            serviceGroupList={this.props.serviceGroupList}
            tagList={this.props.allTagsWithTagGroup ?? []}
          />
        ) : null}
        {this.props.serviceGroupCreateOpen && (
          <PrivateServiceGroupFormDialog
            open
            onCancel={this.props.closeServiceGroupForm}
            onSubmit={this.props.createOrUpdateServiceGroup}
          />
        )}

        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="management.privateService.allowed_actions.edit"
        >
          <BottomActionButtons onEdit={this.handleFormEdit} />
        </ObjectLevelPermissionWrapper>
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('pageTitles.serviceList')),
  connect(
    (state, { id }) => ({
      privateService: getPrivateServiceById(state, id),
      privateServices: getPrivateServices(state),
      loading:
        state.privateService.privateService.loading ||
        state.privateService.privateSlot.loading,
      allCoaches: getAllCoaches(state),
      availableCoaches: getActiveCoaches(state),
      serviceGroupList: getPrivateServiceGroupList(state),
      availableEstablishments:
        getAvailableEstablishmentsWithAssociatedId(state),
      allEstablishments: getAllEstablishmentsWithAssociatedId(state),
      getResourceSlotsExistState: (resourceDatatype, resourceIdentifier) =>
        getResourceSlotsExistState(
          state.privateService,
          resourceDatatype,
          resourceIdentifier,
        ),
      notifications: {
        items: getPrivateBookingNotifications(state),
        loading: state.marketingNotification.loading,
      },
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      emailDetailLoading: state.emailTemplate.detail.isLoading,
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      smartLists: getAllSmartList(state),
      isIntegratedWithClassPass: hasPartnershipByIdentifier(
        state,
        CLASSPASS_INTEGRATION_IDENTIFIER,
      ),
      companyId: getTheme(state)?.company,
    }),
    {
      fetchPartnershipList: fetchPartnershipListAction,
      fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
      createOrUpdateServiceGroup: createOrUpdateServiceGroupAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchAssociatedCoachesList,
      createOrUpdatePrivateService,
      fetchAllPrivateSlots,
      switchServiceHasOwnAvailabilitySlots,

      fetchEstablishments,
      fetchAssociatedEstablishments,
      fetchPrivateServiceGroupList: fetchPrivateServiceGroupListAction,

      createOrUpdatePrivateSlot,
      deletePrivateSlot: deletePrivateSlotAction,
      deletePrivateService,
      checkExistsAvailabilitySlots,

      fetchMarketingNotificationList: fetchMarketingNotificationListAction,
      createMarketingNotification: createMarketingNotificationAction,
      updateMarketingNotification,
      deleteMarketingNotification: deleteMarketingNotificationAction,
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
      goToSmartlist: () => push('/smart-list/'),
      getSmartLists: fetchAllSmartLists,

      goToPrivateServiceCalendar: (id) =>
        push(`/private-service/service/${id}/calendar`),
      goToCoachCalendar: (id) => push(`/coach/${id}/private-calendar`),
      goToEstablishmentCalendar: (id) =>
        push(`/establishment/details/${id}/calendar`),
    },
  ),
  withHandlers({
    deletePrivateSlot:
      ({ deletePrivateSlot, fetchPrivateService, id }) =>
      (slotId) => {
        deletePrivateSlot(id, slotId, {
          onSuccess: () => fetchPrivateService(id),
        });
      },
    fetchNotificationsAndTemplates:
      ({
        fetchMarketingNotificationList,
        fetchEmailTemplateSummariesBulk,
        id,
      }) =>
      () => {
        fetchMarketingNotificationList(
          {
            kind: PRIVATE_BOOKING_CREATION_NOTIFICATION,
            event_rules__private_service_id: id,
          },
          {
            onSuccess: (notificationList) => {
              fetchEmailTemplateSummariesBulk(
                notificationList.map(
                  (notification) => notification.email_design,
                ),
              );
            },
          },
        );
      },
  }),
  withState('isEditFormOpen', 'setIsEditFormOpen', false),
  withState('shouldRenderForm', 'setShouldRenderForm', false),
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
    createOrUpdateServiceGroup:
      ({
        createOrUpdateServiceGroup,
        closeServiceGroupForm,
        fetchPrivateServiceGroupList,
      }) =>
      (data, options) => {
        createOrUpdateServiceGroup(data, {
          onSuccess: (g) => {
            closeServiceGroupForm();
            if (options && options.onSuccess) options.onSuccess(g);
            fetchPrivateServiceGroupList({ mine: true });
          },
        });
      },
    createNotification:
      ({ fetchNotificationsAndTemplates, createMarketingNotification }) =>
      (data) => {
        createMarketingNotification(data, {
          onSuccess: () => {
            fetchNotificationsAndTemplates();
          },
        });
      },
  }),
)(PrivateServiceList);
