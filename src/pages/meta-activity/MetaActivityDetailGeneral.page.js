// @flow
import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import { compose, withProps, withHandlers, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import { deleteMetaActivity } from '../../libs/meta-activity/actions';
import { getMetaActivity } from '../../libs/meta-activity/selectors';
import {
  getEventsByMetaActivity,
  withEstablishment,
  withCoach,
  getOffersByDay,
} from '../../libs/offer/selectors';

import {
  fetchOffersByDay as fetchOffersByDayActions,
  fetchMetaActivityOffers as fetchMetaActivityOffersAction,
} from '../../libs/offer/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '../../libs/marketing/actions';
import { getBookingNotifications } from '../../libs/marketing/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';
import WidgetGeneratorDialog from '../../libs/widget/components/WidgetGeneratorDialog.component';

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
  onEdit: (id: number) => void,
  deleteMetaActivity: (id: number) => void,
  setOpenWidgetDialog: () => void,
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

  render() {
    if (!this.props.metaActivity) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityDetail
          coverImages={this.props.metaActivityImages}
          metaActivity={this.props.metaActivity}
          fetchOffersByDay={this.props.fetchOffersByDay}
          events={this.props.events}
          offers={this.props.offers.filter(
            (o) => o.meta_activity === this.props.id,
          )}
          goToOffer={this.props.goToOffer}
          offersLoading={this.props.offersLoading}
          openCreateOfferForm={this.openCreateOfferForm}
          notifications={this.props.notifications}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          createNotification={this.props.createNotification}
          updateNotification={this.props.updateMarketingNotification}
          deleteNotification={this.props.deleteMarketingNotification}
        />
        <BottomActionButtons
          onEdit={() => this.props.onEdit(this.props.id)}
          onDelete={() => this.setState({ deleteOpen: true })}
          onShare={() => this.props.setOpenWidgetDialog(true)}
        />
        <MetaActivityDeleteDialog
          metaActivityId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={() => {
            this.props.deleteMetaActivity(this.props.id, {
              onSuccess: this.props.goToList,
            });
          }}
        />

        <WidgetGeneratorDialog
          open={this.props.openWidgetDialog}
          onClose={() => this.props.setOpenWidgetDialog(false)}
          componentType="calendar"
          config={{
            calendar: {
              metaActivities: [this.props.id],
            },
          }}
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
  connect(
    (state, { id }) => ({
      loading: state.metaActivity.loading,
      metaActivity: getMetaActivity(state, id),
      events: getEventsByMetaActivity(state),
      offers: withEstablishment(withCoach(getOffersByDay))(state),
      offersLoading: state.offer.byDay.loading,
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      emailDetailLoading: state.emailTemplate.detail.isLoading,
      notifications: {
        items: getBookingNotifications(state),
        loading: state.marketingNotification.loading,
      },
    }),
    {
      fetchOffersByDay: fetchOffersByDayActions,
      fetchMetaActivityOffers: fetchMetaActivityOffersAction,
      push: routerPush,
      deleteMetaActivity,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/activity'),
      onEdit: (id) => routerPush(`/activity/${id}/edit`),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,

      fetchMarketingNotificationList: fetchMarketingNotificationListAction,
      createMarketingNotification: createMarketingNotificationAction,
      updateMarketingNotification,
      deleteMarketingNotification: deleteMarketingNotificationAction,
    },
  ),
  withProps(({ fetchOffersByDay, fetchMetaActivityOffers, id }) => ({
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
  })),
  withHandlers({
    fetchNotificationsAndTemplates: ({
      fetchMarketingNotificationList,
      fetchEmailTemplateSummariesBulk,
      id,
    }) => () => {
      fetchMarketingNotificationList(
        {
          kind: BOOKING_CREATION_NOTIFICATION,
          event_rules__meta_activity_id: id,
        },
        {
          onSuccess: (notificationList) => {
            fetchEmailTemplateSummariesBulk(
              notificationList.map((notification) => notification.email_design),
            );
          },
        },
      );
    },
  }),
  withHandlers({
    createNotification: ({
      fetchNotificationsAndTemplates,
      createMarketingNotification,
    }) => (data) => {
      createMarketingNotification(data, {
        onSuccess: () => {
          fetchNotificationsAndTemplates();
        },
      });
    },
  }),
  withTitle(({ metaActivity }) => (metaActivity ? metaActivity.name : '')),
)(MetaActivityDetailGeneral);
