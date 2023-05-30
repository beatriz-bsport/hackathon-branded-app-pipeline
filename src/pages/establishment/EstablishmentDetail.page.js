import React from 'react';
import { compose, withProps, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import type { Establishment, Offer } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import { getAllSmartList } from '#libs/smart-list/selectors';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import {
  fetchOffersByDay as fetchOffersByDayAction,
  fetchEstablishmentEvents as fetchEstablishmentEventsAction,
} from '../../libs/offer/actions';
import EstablishmentDetail from '../../libs/establishment/components/EstablishmentDetail.component';
import EstablishmentDeleteDialog from '../../libs/establishment/components/EstablishmentDeleteDialog.component';
import {
  fetchEstablishmentBulk,
  deleteEstablishment,
} from '../../libs/establishment/actions';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '../../libs/marketing/actions';
import { getBookingNotifications } from '../../libs/marketing/selectors';
import {
  withEstablishment,
  withCoach,
  getOffersByDay,
  getEventsByEstablishment,
} from '../../libs/offer/selectors';

import { getEstablishment } from '../../libs/establishment/selectors';

import { checkCanDeleteEstablishment as canDeleteEstablishmentAPI } from '../../libs/establishment/api';

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
import {
  createRoomBlueprint as createRoomBlueprintAction,
  deleteRoomBlueprint as deleteRoomBlueprintAction,
  fetchAssetForBlueprint,
  fetchRoomBlueprints,
  fetchSpotForBlueprint,
} from '../../libs/spot-scheduling/actions';
import {
  getAssetForEstablishment,
  getRoomBlueprintsForEstablishment,
  getSpotTypesOfCompany,
} from '../../libs/spot-scheduling/selector';
import { RoomBlueprint } from '../../libs/spot-scheduling/types';
import { showDeleteDialog } from '../../components/genericDialog/CustomDialogs';
import CanvasPreviewDialog from '../../libs/spot-scheduling/component/SpotPreview/CanvasPreviewDialog.Component';
import { SmartList } from '#libs/smart-list/types';
import {
  fetchTagList as fetchTagListAction,
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
} from '../../libs/notification-rule/actions';
import {
  getTagCategories,
  getResolvedGenericTags,
} from '../../libs/notification-rule/selectors';
import { buildSpiviCorrespondence } from '../../libs/spot-scheduling/utils';

const BOOKING_CREATION_NOTIFICATION = 2;

type Props = {
  id: number,
  timetableLoading: boolean,
  offers: Array<Offer>,
  fetchOffersByDay: (data: {
    year: number,
    month: number,
    day: number,
  }) => void,
  goToOffer: (offerId: number) => void,
  establishment: Establishment,
  startUpdateEstablishment: (data: any) => void,
  loading: boolean,
  goToList: () => void,
  deleteEstablishment: (id: number) => void,
  fetchEstablishmentBulk: (es: [number]) => void,
  setOpenWidgetDialog: () => void,
  openWidgetDialog: Boolean,
  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  events: Array<Event>,
  classes: Object,

  email_templates_list: Array<any>,
  email_templates_details: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  notifications: { items: Array<any>, loading: boolean },

  fetchNotificationsAndTemplates: () => void,
  createNotification: (date: any) => void,
  updateMarketingNotification: (id: number, data: any) => void,
  deleteMarketingNotification: (id: number) => void,
  fetchRoomBlueprints: () => void,
  fetchAssetForBlueprint: () => void,
  createRoomBlueprint: () => void,
  roomBlueprints: RoomBlueprint[],
  gotoSpotSchedulingEditor: (r: RoomBlueprint) => void,
  deleteRoomBlueprint: (r: RoomBlueprint) => void,
  assetsByBlueprintByIdentifier: any,
  setPreviewBlueprint: (r: RoomBlueprint) => void,
  previewBlueprint: RoomBlueprint | null,
  fetchEstablishmentEvents: (
    id: number,
    {
      min_date: string,
      max_date: string,
    },
  ) => void,
  goToSmartlist: () => void,
  getSmartLists: () => void,
  smartLists: SmartList[],
  smartListLoading: Boolean,
  fetchSpotForBlueprint: () => void,
  spotTypes: SpotType[],

  fetchTagList: () => void,
  fetchResolvedGenericTags: () => void,
  tagCategories: { [tag_name: string]: string[] },
  resolvedGenericTags: ResolvedGenericTags,
};

type State = {
  deleteOpen: boolean,
  spotCorrespondence: Array<Array<string>>,
  tablePages: { [identifier: string]: number },
  tableCountPages: { [identifier: string]: number },
};

export class EstablishmentDetails extends React.Component<Props, State> {
  state = {
    deleteOpen: false,
    spotCorrespondence: {},
    tablePages: {},
    tableCountPages: {},
  };

  componentDidMount() {
    this.props.fetchEstablishmentBulk([this.props.id]);
    this.props.fetchNotificationsAndTemplates();
    this.props.fetchTagList();
    this.props.fetchResolvedGenericTags();
    this.props.fetchRoomBlueprints({ establishment: this.props.id });
    this.props.fetchAssetForBlueprint({ establishment: this.props.id });
    this.props.fetchEstablishmentEvents(this.props.id, {
      min_date: moment().startOf('month').format('YYYY-MM-DD'),
      max_date: moment().endOf('month').format('YYYY-MM-DD'),
    });
  }

  setSpiviCorrespondence = () => {
    this.setState(
      buildSpiviCorrespondence(
        this.props.spotTypes,
        this.props.previewBlueprint,
      ),
    );
  };

  fetchSpotForBlueprintAndBuildSpiviCorrespondence = (data) => {
    this.props.fetchSpotForBlueprint(data, {
      onSuccess: () => {
        this.setSpiviCorrespondence();
      },
    });
  };

  handlePageChange = (ev, value, spotTypeId) => {
    this.setState((prevState) => ({
      tablePages: {
        ...prevState.tablePages,
        [spotTypeId]: value,
      },
    }));
  };

  render() {
    if (this.props.loading || !this.props.establishment) {
      return <LinearProgress />;
    }

    return (
      <div className={this.props.classes.container}>
        <EstablishmentDetail
          timetableLoading={this.props.timetableLoading}
          offers={this.props.offers.filter(
            (o) => o.establishment && o.establishment.id === this.props.id,
          )}
          fetchOffersByDay={this.props.fetchOffersByDay}
          goToOffer={this.props.goToOffer}
          establishment={this.props.establishment}
          events={this.props.events}
          notifications={this.props.notifications}
          objectId={this.props.establishment.id}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          createNotification={this.props.createNotification}
          updateNotification={this.props.updateMarketingNotification}
          deleteNotification={this.props.deleteMarketingNotification}
          onCreateRoomBlueprint={this.props.createRoomBlueprint}
          onDeleteRoomBlueprint={this.props.deleteRoomBlueprint}
          onEditRoomBlueprint={this.props.gotoSpotSchedulingEditor}
          onPreviewRoomBlueprint={this.props.setPreviewBlueprint}
          roomBlueprints={this.props.roomBlueprints}
          goToSmartlist={this.props.goToSmartlist}
          getSmartLists={this.props.getSmartLists}
          smartLists={this.props.smartLists}
          smartListLoading={this.props.smartListLoading}
          tags={this.props.tagCategories}
          resolvedGenericTags={this.props.resolvedGenericTags}
        />
        <BottomActionButtons
          onEdit={() => this.props.startUpdateEstablishment(this.props.id)}
          onDelete={() => this.setState({ deleteOpen: true })}
          onShare={() => this.props.setOpenWidgetDialog(true)}
        />
        <EstablishmentDeleteDialog
          establishmentId={this.state.deleteOpen ? this.props.id : null}
          onClose={() => this.setState({ deleteOpen: false })}
          canDeleteEstablishmentChecker={canDeleteEstablishmentAPI}
          deleteEstablishment={() => {
            this.props.deleteEstablishment(this.props.id, {
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
              establishments: [this.props.id],
            },
          }}
        />

        <CanvasPreviewDialog
          open={this.props.previewBlueprint}
          roomBlueprint={this.props.previewBlueprint}
          fetchSpotForBlueprint={
            this.fetchSpotForBlueprintAndBuildSpiviCorrespondence
          }
          spotTypes={this.props.spotTypes?.concat({
            id: -1,
          })}
          assets={
            this.props.assetsByBlueprintByIdentifier[
              { id: '', ...this.props.previewBlueprint }.id
            ]
          }
          onClose={() => this.props.setPreviewBlueprint(null)}
          spotCorrespondence={this.state.spotCorrespondence}
          tablePages={this.state.tablePages}
          tableCountPages={this.state.tableCountPages}
          handlePageChange={this.handlePageChange}
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
  withStyles(styles),
  withTranslation(),
  withState('openWidgetDialog', 'setOpenWidgetDialog', false),
  withState('previewBlueprint', 'setPreviewBlueprint', null),
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['establishment']),
  connect(
    (state, { id }) => ({
      establishment: getEstablishment(state, id),
      loading: state.establishment.detail.loading,
      offers: withEstablishment(withCoach(getOffersByDay))(state),
      events: getEventsByEstablishment(state),
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.loading,
      emailDetailLoading: state.emailTemplate.detail.loading,
      notifications: {
        items: getBookingNotifications(state),
        loading: state.marketingNotification.loading,
      },
      theme: state.theme.theme,
      roomBlueprints: getRoomBlueprintsForEstablishment(state, id),
      assetsByBlueprintByIdentifier: getAssetForEstablishment(state, id),
      smartLists: getAllSmartList(state),
      smartListLoading: state.smartList.loading,
      spotTypes: getSpotTypesOfCompany(state),
      resolvedGenericTags: getResolvedGenericTags(state),
      tagCategories: getTagCategories(state),
    }),
    {
      fetchEstablishmentBulk,
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      fetchOffersByDay: fetchOffersByDayAction,
      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
      goToList: () => push('/establishment/room'),
      deleteEstablishment,
      fetchEstablishmentEvents: fetchEstablishmentEventsAction,
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,

      fetchMarketingNotificationList: fetchMarketingNotificationListAction,
      createMarketingNotification: createMarketingNotificationAction,
      updateMarketingNotification,
      deleteMarketingNotification: deleteMarketingNotificationAction,
      createRoomBlueprint: createRoomBlueprintAction,
      deleteRoomBlueprint: deleteRoomBlueprintAction,
      fetchRoomBlueprints,
      fetchAssetForBlueprint,
      fetchSpotForBlueprint,
      pushRouter: push,
      goToSmartlist: () => push('/smart-list/'),
      getSmartLists: fetchAllSmartLists,
      fetchTagList: fetchTagListAction,
      fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    },
  ),
  withProps(({ fetchOffersByDay, fetchEstablishmentEvents, id }) => ({
    fetchOffersByDay: (momentDate) => {
      fetchEstablishmentEvents(id, {
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
            event_rules__establishment_id: id,
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
    createRoomBlueprint:
      ({ pushRouter, createRoomBlueprint, theme, id, t }) =>
      () => {
        createRoomBlueprint(
          {
            name: t('spotScheduling.untitled'),
            company: theme.company,
            establishment: id,
          },
          {
            onSuccess: (data) => {
              pushRouter(`/spot-scheduling/${data.id}`);
            },
          },
        );
      },
    gotoSpotSchedulingEditor:
      ({ pushRouter }) =>
      (room: RoomBlueprint) => {
        pushRouter(`/spot-scheduling/${room.id}`);
      },
    deleteRoomBlueprint:
      ({ t, deleteRoomBlueprint }) =>
      async (room: RoomBlueprint) => {
        const confirm = await showDeleteDialog(
          t('spotScheduling.delete.title'),
          t('spotScheduling.delete.content'),
        );
        if (confirm) deleteRoomBlueprint(room.id);
      },
  }),
  withTitle(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(EstablishmentDetails);
