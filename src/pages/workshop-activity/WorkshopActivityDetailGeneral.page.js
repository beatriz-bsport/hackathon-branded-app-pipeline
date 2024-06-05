// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import { compose, withProps, withHandlers, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateTime } from 'luxon';

import { withTranslation } from 'react-i18next';

import WorkshopDeleteDialog from '#libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityDetail from '#libs/meta-activity/components/MetaActivityDetail.component';

import {
  getWorkshops,
  withCustomRestrictionsTags,
} from '#libs/meta-activity/selectors';
import { getAllSmartList } from '#libs/smart-list/selectors';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import {
  getEventsByMetaActivity,
  withEstablishment,
  withCoach,
  getOffersByDay,
} from '#libs/offer/selectors';
import {
  fetchOffersByDay as fetchOffersByDayAction,
  fetchMetaActivityOffers as fetchMetaActivityOffersAction,
} from '#libs/offer/actions';
import { deleteWorkshop, upsert } from '#libs/meta-activity/actions';
import { checkCanDeleteMetaActivity as canDeleteWorkshopAPI } from '#libs/meta-activity/api/common';

import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#libs/marketing/actions';
import { getBookingNotifications } from '#libs/marketing/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';
import WidgetGeneratorDialog from '#libs/widget/components/WidgetGeneratorDialog.component';
import MetaActivityEditDrawer from '#libs/meta-activity/components/MetaActivityEdit.drawer';
import { SCT } from '#libs/category/types';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { Tag, TagGroup } from '#libs/tag/types';
import { SmartList } from '#libs/smart-list/types';
import { mapFormData, unmap } from '../form.utils';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { OptionCallBack } from '../../state/types';
import ObjectLevelPermissionProvider from '../../libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getEditableSCTs } from '../../libs/category/selectors';
import {
  fetchTagList as fetchTagListAction,
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
} from '../../libs/notification-rule/actions';
import {
  getTagCategories,
  getResolvedGenericTags,
} from '../../libs/notification-rule/selectors';

type Props = {
  id: number,
  workshopActivity: MetaActivityType,
  loading: boolean,
  fetchMetaActivityOffers: (id: number) => void,
  fetchOffersByDay: (datetime: DateTime) => void,
  offersLoading: boolean,
  events: Array<Event>,
  offers: Array<Offer>,

  goToList: () => void,
  deleteWorkshop: (
    id: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  createActivityOffers: (id: number) => void,
  goToOffer: (offer: Offer) => void,
  classes: Object,
  setOpenWidgetDialog: (open: boolean) => void,
  openWidgetDialog: Boolean,

  email_templates_list: Array<any>,
  email_templates_details: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  notifications: Object,
  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,

  fetchNotificationsAndTemplates: (params: any) => void,
  createNotification: (date: any) => void,
  updateNotification: (data: any) => void,
  deleteNotification: (notificationId: number) => void,
  openEditDrawer: boolean,
  setOpenEditDrawer: (open: boolean) => void,
  onSubmit: (values: MetaActivityType, options: OptionCallBack) => void,
  SCTs: Array<SCT>,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
  goToSmartlist: () => void,
  getSmartLists: () => void,
  smartLists: SmartList[],
  fetchTagList: () => void,
  fetchResolvedGenericTags: () => void,
  tagCategories: { [tag_name: string]: string[] },
  resolvedGenericTags: ResolvedGenericTags,
};
const MetaActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  first_booking_minutes_until: 'first_booking_minutes_until',
  is_workshop: 'is_workshop',
  SCT: 'SCT',
  color: 'color',
  is_broadcast: 'is_broadcast',
  auto_discard_active: 'auto_discard_active',
  auto_discard_hours_before_start: 'auto_discard_hours_before_start',
  auto_discard_min_bookings_nb: 'auto_discard_min_bookings_nb',
  category: 'category',
  alt_cover_main: 'alt_cover_main',
  custom_restriction_rule: 'custom_restriction_rule',
};
type State = {
  editable: boolean,
  data: any,
  sportCategories: Array<number>,
  dateSelected: Object,
  deleteOpen: boolean,
};

export class WorkshopActivity extends Component<Props, State> {
  state = { deleteOpen: false };

  componentDidMount() {
    if (this.props.id) {
      this.props.fetchMetaActivityOffers(this.props.id);
      this.props.fetchNotificationsAndTemplates({
        meta_activity: this.props.id,
      });
      this.props.fetchOffersByDay(DateTime.now());
      this.props.fetchResolvedGenericTags();
      this.props.fetchTagList();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchMetaActivityOffers(this.props.id);
    }
  }

  openCreateOfferForm = () => {
    this.props.createActivityOffers(this.props.id);
  };

  onEdit = () => {
    this.props.setOpenEditDrawer(true);
  };

  onCancelEdit = () => {
    this.props.setOpenEditDrawer(false);
  };

  render() {
    const { workshopActivity, SCTs } = this.props;
    if (!workshopActivity) {
      return <LinearProgress />;
    }
    const initialData = workshopActivity
      ? {
          ...unmap(workshopActivity, MetaActivityMap),
          SCT: workshopActivity.SCT,
          custom_restriction_rule:
            workshopActivity?.custom_restriction_rule?.map((crr) => ({
              ...crr,
              tags: crr.tags?.map((tag) => tag.id),
            })) ?? [],
        }
      : null;
    return (
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'management.workshop.allowed_actions.edit',
          'management.workshop.allowed_actions.delete',
          'session.workshop.allowed_actions.create',
        ]}
      >
        {([
          hasEditPermission,
          hasDeletePermission,
          hasAddSessionPermission,
        ]) => (
          <div className={this.props.classes.container}>
            {this.props.loading ? <LinearProgress /> : null}
            <MetaActivityDetail
              activities={this.props.id}
              canAddOffer={hasAddSessionPermission}
              createNotification={this.props.createNotification}
              deleteNotification={this.props.deleteNotification}
              emailDetailLoading={this.props.emailDetailLoading}
              emailDetails={this.props.email_templates_details}
              emailListLoading={this.props.emailListLoading}
              emails={this.props.email_templates_list}
              events={this.props.events}
              fetchOffersByDay={this.props.fetchOffersByDay}
              getEmailDetail={this.props.fetchEmailTemplateDetail}
              getEmails={this.props.fetchEmailTemplatesSummaries}
              getSmartLists={this.props.getSmartLists}
              goToOffer={this.props.goToOffer}
              goToSmartlist={this.props.goToSmartlist}
              metaActivity={workshopActivity}
              notifications={this.props.notifications}
              offers={this.props.offers.filter(
                (o) => o.meta_activity === this.props.id,
              )}
              offersLoading={this.props.offersLoading}
              onEdit={this.onEdit}
              openCreateOfferForm={this.openCreateOfferForm}
              resolvedGenericTags={this.props.resolvedGenericTags}
              smartLists={this.props.smartLists}
              tags={this.props.tagCategories}
              updateNotification={this.props.updateNotification}
            />
            <BottomActionButtons
              onDelete={
                hasDeletePermission && workshopActivity.customer_enabled
                  ? () => this.setState({ deleteOpen: true })
                  : null
              }
              onEdit={hasEditPermission && this.onEdit}
              onShare={() => this.props.setOpenWidgetDialog(true)}
            />

            <WorkshopDeleteDialog
              canDeleteWorkshopChecker={canDeleteWorkshopAPI}
              deleteWorkshop={() => {
                this.props.deleteWorkshop(this.props.id, {
                  onSuccess: this.props.goToList,
                });
              }}
              onClose={() => this.setState({ deleteOpen: false })}
              workshopId={this.state.deleteOpen ? this.props.id : null}
            />

            <WidgetGeneratorDialog
              componentType="workshop"
              config={{
                workshop: {
                  metaActivities: [this.props.id],
                },
              }}
              onClose={() => this.props.setOpenWidgetDialog(false)}
              open={this.props.openWidgetDialog}
            />
            <MetaActivityEditDrawer
              initial={{
                ...initialData,
                images: (workshopActivity || {}).images || [],
              }}
              onCancel={this.onCancelEdit}
              onSubmit={this.props.onSubmit}
              open={this.props.openEditDrawer}
              SCTs={SCTs}
              tags={this.props.allTagsWithTagGroup}
            />
          </div>
        )}
      </ObjectLevelPermissionProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(12),
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  withState('openWidgetDialog', 'setOpenWidgetDialog', false),
  withState('openEditDrawer', 'setOpenEditDrawer', false),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      id,
      SCTs: getEditableSCTs(state),
      loading: state.metaActivity.loading,
      workshopActivities: getWorkshops(state),
      workshopActivity: withCustomRestrictionsTags(getWorkshops)(state).find(
        (ma) => ma.id === id,
      ),
      events: getEventsByMetaActivity(state),
      offers: withEstablishment(withCoach(getOffersByDay))(state),
      offersLoading: state.offer.byDay.loading,
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.loading,
      emailDetailLoading: state.emailTemplate.detail.loading,
      notifications: {
        items: getBookingNotifications(state),
        loading: state.marketingNotification.loading,
      },
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      smartLists: getAllSmartList(state),
      smartListLoading: state.smartList.loading,
      tagCategories: getTagCategories(state),
      resolvedGenericTags: getResolvedGenericTags(state),
    }),
    {
      fetchOffersByDay: fetchOffersByDayAction,
      fetchMetaActivityOffers: fetchMetaActivityOffersAction,
      deleteWorkshop,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/workshop-activity'),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
      createNotification: createMarketingNotificationAction,
      updateNotification: updateMarketingNotification,
      deleteNotification: deleteMarketingNotificationAction,
      fetchNotifications: fetchMarketingNotificationListAction,
      upsertMetaActivity: upsert,
      goToSmartlist: () => routerPush('/smart-list/'),
      getSmartLists: fetchAllSmartLists,
      fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
      fetchTagList: fetchTagListAction,
    },
  ),
  withProps(
    ({
      fetchOffersByDay,
      fetchMetaActivityOffers,
      id,
      upsertMetaActivity,
      setOpenEditDrawer,
    }) => ({
      fetchOffersByDay: (datetime: DateTime) => {
        fetchMetaActivityOffers(id, {
          min_date: datetime.startOf('month').toISODate(),
          max_date: datetime.endOf('month').toISODate(),
        });
        fetchOffersByDay({
          year: datetime.year,
          month: datetime.month,
          day: datetime.day,
        });
      },
      onSubmit: (values, options) => {
        try {
          const formData = mapFormData(values, MetaActivityMap);
          formData.append('id', id);
          formData.append('is_workshop', true);
          upsertMetaActivity(formData, {
            ...options,
            onSuccess: () => {
              if (options.onSuccess) options.onSuccess();
              setOpenEditDrawer(false);
            },
            onError: (err) => {
              console.error(err);
              if (options?.onError) options.onError(err);
            },
          });
        } catch (err) {
          console.error(err);
          if (options?.onError) options.onError(err);
        }
      },
    }),
  ),
  withHandlers({
    fetchNotificationsAndTemplates:
      ({ fetchNotifications, fetchEmailTemplateSummariesBulk }) =>
      (params) => {
        fetchNotifications(params, {
          onSuccess: (notificationList) => {
            fetchEmailTemplateSummariesBulk(
              notificationList.map((notification) => notification.email_design),
            );
          },
        });
      },
  }),
  withHandlers({
    createNotification:
      ({ fetchNotificationsAndTemplates, createNotification, id }) =>
      (data) => {
        createNotification(data, {
          onSuccess: () => {
            fetchNotificationsAndTemplates({ meta_activity: id });
          },
        });
      },
  }),
  withTitle(({ id, workshopActivities }) => {
    if (id) {
      const workshopActivity = (workshopActivities || []).filter(
        (m) => m.id === id,
      );
      if ((workshopActivity || []).length === 1) {
        return workshopActivity[0].name;
      }
    }
    return '';
  }),
)(WorkshopActivity);
