// @flow
import React, { PureComponent } from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import { compose, withProps, withHandlers, withState } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityDetail from '#libs/meta-activity/components/MetaActivityDetail.component';
import MetaActivityDeleteDialog from '#libs/meta-activity/components/MetaActivityDeleteDialog.component';
import { deleteMetaActivity, upsert } from '#libs/meta-activity/actions';
import { getAllSmartList } from '#libs/smart-list/selectors';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import {
  fetchTagList as fetchTagListAction,
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
} from '../../libs/notification-rule/actions';
import {
  getTagCategories,
  getResolvedGenericTags,
} from '../../libs/notification-rule/selectors';
import {
  getMetaActivity,
  withCustomRestrictionsTags,
} from '#libs/meta-activity/selectors';
import {
  getEventsByMetaActivity,
  withEstablishment,
  withCoach,
  getOffersByDay,
} from '#libs/offer/selectors';

import {
  fetchOffersByDay as fetchOffersByDayActions,
  fetchMetaActivityOffers as fetchMetaActivityOffersAction,
} from '#libs/offer/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '#libs/meta-activity/api/common';

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
import { getEditableSCTs } from '#libs/category/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';

import WidgetGeneratorDialog from '#libs/widget/components/WidgetGeneratorDialog.component';
import MetaActivityEditDrawer from '#libs/meta-activity/components/MetaActivityEdit.drawer';
import { mapFormData, unmap } from '../form.utils';
import { OptionCallBack } from '../../state/types';
import { SCT } from '#libs/category/types';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { Tag, TagGroup } from '#libs/tag/types';
import { SmartList } from '#libs/smart-list/types';

const BOOKING_CREATION_NOTIFICATION = 2;

type Props = {
  id: number,
  metaActivity: MetaActivityType,
  metaActivityImages: Array<Object>,

  loading: boolean,
  offersLoading: boolean,

  events: Array<Event>,
  offers: Array<Offer>,
  fetchOffersByDay: (year: number, month: number, day: number) => void,
  fetchMetaActivityOffers: (id: number) => void,

  createActivityOffers: (id: number) => void,
  goToOffer: (Offer) => void,
  goToList: () => void,
  deleteMetaActivity: (id: number, options: OptionCallBack) => void,
  setOpenWidgetDialog: (open: boolean) => void,
  openWidgetDialog: Boolean,
  classes: Object,

  email_templates_list: Array<any>,
  email_templates_details: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  fetchEmailTemplateDetail: (id: number) => void,
  fetchEmailTemplatesSummaries: () => void,
  notifications: { items: Array<any>, loading: boolean },

  fetchNotificationsAndTemplates: () => void,
  createNotification: (date: any) => void,
  updateMarketingNotification: (id: number, data: any) => void,
  deleteMarketingNotification: (id: number) => void,
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
  deleteOpen: boolean,
};

export class MetaActivityDetailGeneral extends PureComponent<Props, State> {
  state = { deleteOpen: false };

  componentDidMount() {
    if (this.props.id) {
      this.props.fetchMetaActivityOffers(this.props.id);
      this.props.fetchNotificationsAndTemplates();
      this.props.fetchOffersByDay(moment());
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
    const { metaActivity, SCTs } = this.props;

    if (!metaActivity) {
      return <LinearProgress />;
    }
    const initialData = metaActivity
      ? {
          ...unmap(metaActivity, MetaActivityMap),
          SCT: metaActivity.SCT,
          custom_restriction_rule:
            metaActivity?.custom_restriction_rule?.map((crr) => ({
              ...crr,
              tags: crr.tags?.map((tag) => tag.id),
            })) ?? [],
        }
      : null;
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityDetail
          coverImages={this.props.metaActivityImages}
          createNotification={this.props.createNotification}
          deleteNotification={this.props.deleteMarketingNotification}
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
          metaActivity={metaActivity}
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
          updateNotification={this.props.updateMarketingNotification}
        />
        <BottomActionButtons
          onDelete={() => this.setState({ deleteOpen: true })}
          onEdit={this.onEdit}
          onShare={() => this.props.setOpenWidgetDialog(true)}
        />
        <MetaActivityDeleteDialog
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={() => {
            this.props.deleteMetaActivity(this.props.id, {
              onSuccess: this.props.goToList,
            });
          }}
          metaActivityId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
        />

        <WidgetGeneratorDialog
          componentType="calendar"
          config={{
            calendar: {
              metaActivities: [this.props.id],
            },
          }}
          onClose={() => this.props.setOpenWidgetDialog(false)}
          open={this.props.openWidgetDialog}
        />
        <MetaActivityEditDrawer
          initial={{
            ...initialData,
            images: (metaActivity || {}).images || [],
          }}
          onCancel={this.onCancelEdit}
          onSubmit={this.props.onSubmit}
          open={this.props.openEditDrawer}
          SCTs={SCTs}
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
  withStyles(styles),
  withState('openWidgetDialog', 'setOpenWidgetDialog', false),
  withState('openEditDrawer', 'setOpenEditDrawer', false),
  connect(
    (state, { id }) => ({
      loading: state.metaActivity.loading,
      SCTs: getEditableSCTs(state),
      metaActivity: withCustomRestrictionsTags(getMetaActivity)(state, id),
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
      fetchOffersByDay: fetchOffersByDayActions,
      fetchMetaActivityOffers: fetchMetaActivityOffersAction,
      push: routerPush,
      deleteMetaActivity,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/activity'),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,

      fetchMarketingNotificationList: fetchMarketingNotificationListAction,
      createMarketingNotification: createMarketingNotificationAction,
      updateMarketingNotification,
      deleteMarketingNotification: deleteMarketingNotificationAction,
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
          formData.append('is_workshop', false);
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
      ({
        fetchMarketingNotificationList,
        fetchEmailTemplateSummariesBulk,
        id,
      }) =>
      () => {
        fetchMarketingNotificationList(
          {
            kind: BOOKING_CREATION_NOTIFICATION,
            event_rules__meta_activity_id: id,
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
  withHandlers({
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
  withTitle(({ metaActivity }) => (metaActivity ? metaActivity.name : '')),
)(MetaActivityDetailGeneral);
