// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import { compose, withProps, withHandlers, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';

import { withTranslation } from 'react-i18next';

import WorkshopDeleteDialog from '#libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityDetail from '#libs/meta-activity/components/MetaActivityDetail.component';

import { getWorkshops } from '#libs/meta-activity/selectors';
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
import { mapFormData, unmap } from '../form.utils';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import MetaActivityEditDrawer from '#libs/meta-activity/components/MetaActivityEdit.drawer';
import { OptionCallBack } from '../../state/types';
import { SCT } from '#libs/category/types';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { Tag, TagGroup } from '#libs/tag/types';
import { SmartList } from '#libs/smart-list/types';

type Props = {
  id: number,
  workshopActivity: MetaActivityType,
  loading: boolean,
  fetchMetaActivityOffers: (id: number) => void,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
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
      this.props.fetchOffersByDay(moment());
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
        }
      : null;
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityDetail
          metaActivity={workshopActivity}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers.filter(
            (o) => o.meta_activity === this.props.id,
          )}
          offersLoading={this.props.offersLoading}
          goToOffer={this.props.goToOffer}
          openCreateOfferForm={this.openCreateOfferForm}
          activities={this.props.id}
          notifications={this.props.notifications}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          createNotification={this.props.createNotification}
          updateNotification={this.props.updateNotification}
          deleteNotification={this.props.deleteNotification}
          onEdit={this.onEdit}
          goToSmartlist={this.props.goToSmartlist}
          getSmartLists={this.props.getSmartLists}
          smartLists={this.props.smartLists}
        />
        <BottomActionButtons
          onEdit={this.onEdit}
          onDelete={
            workshopActivity.customer_enabled
              ? () => this.setState({ deleteOpen: true })
              : null
          }
          onShare={() => this.props.setOpenWidgetDialog(true)}
        />
        <WorkshopDeleteDialog
          workshopId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
          canDeleteWorkshopChecker={canDeleteWorkshopAPI}
          deleteWorkshop={() => {
            this.props.deleteWorkshop(this.props.id, {
              onSuccess: this.props.goToList,
            });
          }}
        />

        <WidgetGeneratorDialog
          open={this.props.openWidgetDialog}
          onClose={() => this.props.setOpenWidgetDialog(false)}
          componentType="workshop"
          config={{
            workshop: {
              metaActivities: [this.props.id],
            },
          }}
        />
        <MetaActivityEditDrawer
          initial={{
            ...initialData,
            images: (workshopActivity || {}).images || [],
          }}
          onSubmit={this.props.onSubmit}
          SCTs={SCTs}
          open={this.props.openEditDrawer}
          onCancel={this.onCancelEdit}
          tags={this.props.allTagsWithTagGroup}
        />
      </div>
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
      SCTs: state.category.SCTs,
      loading: state.metaActivity.loading,
      workshopActivities: getWorkshops(state),
      workshopActivity: getWorkshops(state).find((ma) => ma.id === id),
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
      fetchOffersByDay: (momentDate) => {
        fetchMetaActivityOffers(id, {
          min_date: momentDate.clone().startOf('month').format('YYYY-MM-DD'),
          max_date: momentDate.clone().endOf('month').format('YYYY-MM-DD'),
        });
        fetchOffersByDay({
          year: momentDate.year(),
          month: momentDate.month() + 1,
          day: momentDate.date(),
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
