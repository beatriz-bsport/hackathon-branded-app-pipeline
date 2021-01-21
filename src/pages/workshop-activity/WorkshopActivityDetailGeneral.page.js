// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import { compose, withProps, withHandlers, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import type { Offer, MetaActivity as MetaActivityType } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityDetail from '../../libs/meta-activity/components/MetaActivityDetail.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import { getWorkshops } from '../../libs/meta-activity/selectors';
import {
  getEventsByMetaActivity,
  withEstablishment,
  withCoach,
  getOffersByDay,
} from '../../libs/offer/selectors';
import {
  fetchOffersByDay as fetchOffersByDayAction,
  fetchMetaActivityOffers as fetchMetaActivityOffersAction,
} from '../../libs/offer/actions';
import { deleteWorkshop } from '../../libs/meta-activity/actions';
import { checkCanDeleteMetaActivity as canDeleteWorkshopAPI } from '../../libs/meta-activity/api/common';

import {
  fetchFirstTimeNotifications as fetchNotificationsAction,
  createFirstTimeNotification as createNotificationAction,
  updateFirstTimeNotification as updateNotification,
  deleteFirstTimeNotification as deleteNotification,
} from '../../libs/booking/actions';
import { getFirstTimeNotifications } from '../../libs/booking/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';
import WidgetGeneratorDialog from '../settings/WidgetGenerator/WidgetGeneratorDialog';

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
  onEdit: (id: number) => void,
  createActivityOffers: (id: number) => void,
  goToOffer: (offer: Offer) => void,
  classes: Object,
  setOpenWidgetDialog: () => void,
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
};

type State = {
  editable: boolean,
  data: *,
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
    if (!this.props.workshopActivity) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityDetail
          metaActivity={this.props.workshopActivity}
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
        />
        <BottomActionButtons
          onEdit={() => this.props.onEdit(this.props.id)}
          onDelete={
            this.props.workshopActivity.customer_enabled
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
  withStyles(styles),
  connect(
    (state, { id }) => ({
      id,
      loading: state.metaActivity.loading,
      workshopActivities: getWorkshops(state),
      workshopActivity: getWorkshops(state).find((ma) => ma.id === id),
      events: getEventsByMetaActivity(state),
      offers: withEstablishment(withCoach(getOffersByDay))(state),
      offersLoading: state.offer.byDay.loading,
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      emailDetailLoading: state.emailTemplate.detail.isLoading,
      notifications: {
        items: getFirstTimeNotifications(state),
        loading: state.booking.notification.loading,
        updating: state.booking.notification.update.id,
      },
    }),
    {
      fetchOffersByDay: fetchOffersByDayAction,
      fetchMetaActivityOffers: fetchMetaActivityOffersAction,
      deleteWorkshop,
      goToOffer: (o) => routerPush(`/offer/${o.id}`),
      goToList: () => routerPush('/workshop-activity'),
      onEdit: (id) => routerPush(`/workshop-activity/${id}/edit`),
      createActivityOffers: (id) => routerPush(`/add-offers/${id}`),
      fetchNotifications: fetchNotificationsAction,
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
      createNotification: createNotificationAction,
      updateNotification,
      deleteNotification,
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
      fetchNotifications,
      fetchEmailTemplateSummariesBulk,
    }) => (params) => {
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
    createNotification: ({
      fetchNotificationsAndTemplates,
      createNotification,
      id,
    }) => (data) => {
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
