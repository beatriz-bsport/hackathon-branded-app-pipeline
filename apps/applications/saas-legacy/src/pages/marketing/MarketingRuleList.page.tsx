import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';

import {
  getNotificationGrouped,
  getNotificationForMarketingPage,
} from '#src/libs/marketing/selectors';
import { getTheme } from '#src/libs/theme/selectors';

import {
  fetchMarketingNotification,
  fetchMarketingNotificationList,
  createMarketingNotification,
  toggleActiveMarketingNotification,
  updateMarketingNotification,
  deleteMarketingNotification,
} from '#src/libs/marketing/actions';
import {
  emailTemplateComplete,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
  fetchEmailTemplateSummariesBulk,
} from '#src/libs/email-editor/actions';
import { getActiveContractList } from '#src/libs/subscription/selectors';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceBulk,
  fetchPrivatePassList,
} from '#src/libs/private-service/actions';
import {
  fetchActivitiesCompany,
  fetchMetaActivityBulk,
} from '#src/libs/meta-activity/actions';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk,
} from '#src/libs/payment-packs/actions';
import {
  fetchEstablishmentBulk,
  fetchEstablishments,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#src/libs/establishment/actions';
import { fetchContractList } from '#src/libs/subscription/actions';
import {
  getAllEmailTemplatesDict,
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import { fetchMarketingNotificationCampaignSummary } from '#src/libs/communication/actions';
import { getAll as getAllPaymentPacks } from '#src/libs/payment-packs/selectors';
import {
  fetchTagList,
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
} from '#src/libs/notification-rule/actions';
import {
  getTagCategories,
  getResolvedGenericTags,
} from '#src/libs/notification-rule/selectors';

import MarketingRuleListPass from '#src/libs/marketing/components/MarketingRuleListPass.component';
import MarketingRuleListBooking from '#src/libs/marketing/components/MarketingRuleListBooking.component';
import MarketingRuleListPrivateBooking from '#src/libs/marketing/components/MarketingRuleListPrivateBooking.component';

import { MarketingNotification } from '#src/libs/marketing/types';
import MarketingRuleDetail from '#src/libs/marketing/components/MarketingRuleDetail.component';
import {
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import MarketingRuleFormGeneric from '#src/libs/marketing/components/MarketingRuleFormGeneric.component';
import { getAllSmartList } from '#src/libs/smart-list/selectors';
import { fetchAllSmartLists } from '#src/libs/smart-list/actions';
import {
  getPageEnabledPureMetaActivities,
  getEnabledWorkshops,
} from '#src/libs/meta-activity/selectors';
import {
  getAssociatedEstablishmentGroup,
  getAvailableEstablishmentList,
  withEstablishment,
} from '#src/libs/establishment/selectors';
import { _getAvailablePrivateServices } from '#src/libs/private-service/selectors/private-service';
import {
  DialogActionEnum,
  showActionDialog,
} from '#src/components/genericDialog/CustomDialogs';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import { EstablishmentGroup } from '#src/libs/establishment/types';

import FabWithItems from '#src/components/button/FabWithItems';
import MarketingRuleListContract from '#src/libs/marketing/components/MarketingRuleListContract.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import MarketingRuleListBirthday from '#src/libs/marketing/components/MarketingRuleListBirthday.component';
import { MaterialStyleType } from '../../utils/types';
import { getPrivatePassListBase as getPrivatePasses } from '../../libs/private-service/selectors/private-pass';
import { RootState } from '../../reducers';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { OptionCallback } from '../../state/types';
import { ImmutableObject } from 'seamless-immutable';
import { getNotificationDeletionParameters as getNotificationDeleteDialogParameters } from '#src/libs/marketing/utils';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation & {
    notificationId?: number;

    fetchTagList: () => void;
    fetchResolvedGenericTags: () => void;
    tagCategories: { [tag_name: string]: string[] };
    resolvedGenericTags: ResolvedGenericTags;
  };

type State = {
  selectedNotification?: number | null;
  editNotification?: MarketingNotification | null;
  loading: boolean;
  createFormOpen: string | null;
};

export class MarketingRuleListPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedNotification: props.notificationId,
      editNotification: null,
      loading: false,
      createFormOpen: null,
    };
  }

  componentDidMount() {
    this.fetchData();

    this.props.fetchResolvedGenericTags();

    if (this.props.notificationId) {
      this.props.fetchMarketingNotificationCampaignSummary(
        this.props.notificationId,
      );
      this.props.fetchMarketingNotification(this.props.notificationId, {
        onSuccess: (data) => {
          // @ts-expect-error
          if (data.email_design) {
            // @ts-expect-error
            this.props.fetchEmailTemplateComplete(data.email_design);
          }
        },
      });
    }
  }

  fetchData = async () => {
    const notifications: any = await this.props.fetchMarketingNotificationList({
      kind__in: [
        NOTIFICATION_KIND.BIRTHDAY,
        NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
        NOTIFICATION_KIND.BOOKING_CREATION,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
        NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
        NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
        NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
        NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
      ],
    });

    const metaActivityIds: number[] = [];
    const privateServiceIds: number[] = [];
    const establishmentIds: number[] = [];
    const paymentPackIds: number[] = [];
    const contractIds: number[] = [];
    const emailDesignIds: number[] = [];

    (notifications ?? []).forEach((n: MarketingNotification) => {
      if (n.event_rules.payment_pack_ids !== undefined) {
        paymentPackIds.push(...n.event_rules.payment_pack_ids);
      }
      if (n.event_rules.establishment_id !== undefined) {
        establishmentIds.push(n.event_rules.establishment_id);
      }
      if (n.event_rules.meta_activity_id !== undefined) {
        metaActivityIds.push(n.event_rules.meta_activity_id);
      }
      if (n.event_rules.private_service_id !== undefined) {
        privateServiceIds.push(n.event_rules.private_service_id);
      }
      if (n.event_rules.contract_id !== undefined) {
        contractIds.push(n.event_rules.contract_id);
      }
      emailDesignIds.push(n.email_design);
    });
    await Promise.all([
      this.props.fetchPaymentPackBulk(paymentPackIds),
      this.props.fetchEstablishmentBulk(establishmentIds),
      this.props.fetchPrivateServiceBulk(privateServiceIds),
      this.props.fetchMetaActivityBulk(metaActivityIds),
      this.props.fetchContractList(contractIds),
      this.props.fetchEmailTemplateSummariesBulk(emailDesignIds),
      this.props.fetchActivitiesCompany(this.props.theme.company),
      this.props.fetchEstablishments(),
      this.props.fetchAllPrivateServices(),
      this.props.fetchPaymentPackList(),
      this.props.fetchTagList(),
      this.props.getSmartLists(),
      this.props.fetchPrivatePassList(),
      this.props.fetchAllEstablishmentGroup(),
    ]);

    this.setState({ loading: false });
  };

  getSelectedEmailTemplateSummary = () => {
    if (!this.state.selectedNotification || !this.props.emailSummariesById) {
      return undefined;
    }

    const notifcationDetail = this.props.notificationList.find(
      (n) => n.id === this.state.selectedNotification,
    );

    if (!notifcationDetail) {
      return undefined;
    }

    return this.props.emailSummariesById[notifcationDetail.email_design];
  };

  getSelectedEmailTemplateDetail = () => {
    if (!this.state.selectedNotification || !this.props.emailDetailById) {
      return undefined;
    }

    const notifcationDetail = this.props.notificationList.find(
      (n) => n.id === this.state.selectedNotification,
    );

    if (!notifcationDetail) {
      return undefined;
    }

    return this.props.emailDetailById[notifcationDetail.email_design];
  };

  onClickNotification = (
    notification:
      | ImmutableObject<MarketingNotification>
      | MarketingNotification,
  ) => {
    this.props.fetchMarketingNotificationCampaignSummary(notification.id);
    this.setState({
      selectedNotification: notification.id,
    });
    if (notification.email_design) {
      this.props.fetchEmailTemplateComplete(notification.email_design);
    }
    this.props.push(`/marketing/notifications/${notification.id}`);
  };

  onClickRemove = async () => {
    const { t } = this.props;
    const notification = this.props.notificationList.find(
      (n) => n.id === this.state.selectedNotification,
    );
    const parameters = getNotificationDeleteDialogParameters(t, notification);
    const res = await showActionDialog(
      t('marketing:notifications.deleteDialogTitle'),
      parameters.warningText,
      DialogActionEnum.DELETE,
      parameters.buttonActivationDelay,
    );
    if (res && this.state.selectedNotification) {
      this.props.deleteMarketingNotification(this.state.selectedNotification);
      this.setState({ selectedNotification: null });
      this.props.push(`/marketing/notifications`);
    }
  };

  onEditNotification = async (id: number, n: MarketingNotification) => {
    this.setState({ editNotification: null });
    this.props.updateMarketingNotification(id, n);
  };

  handleCreate = (
    notification: MarketingNotification,
    option?: OptionCallback,
  ) => {
    this.props.createMarketingNotification(notification, {
      // @ts-expect-error
      onSuccess: (data: MarketingNotification) => {
        if (data.email_design) {
          this.props.fetchEmailTemplateComplete(data.email_design);
        }
        this.props.fetchMarketingNotificationCampaignSummary(data.id);
        this.props.push(`/marketing/notifications/${data.id}`);
        option?.onSuccess && option?.onSuccess();
      },
    });
  };

  getCreateButtonSpec = () => [
    ...(this.props.notifications?.birthday?.length === 0
      ? [
          {
            label: this.props.t('marketing:notifications.fabLabels.birthday'),
            onClick: () => this.setState({ createFormOpen: 'birthday' }),
          },
        ]
      : []),
    {
      label: this.props.t('marketing:notifications.fabLabels.meta_activity'),
      onClick: () => this.setState({ createFormOpen: 'meta_activity' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.workshop'),
      onClick: () => this.setState({ createFormOpen: 'workshop' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.establishment'),
      onClick: () => this.setState({ createFormOpen: 'establishment' }),
    },
    this.props.isMultiLocationEnabled &&
      this.props.establishmentGroups?.length && {
        label: this.props.t(
          'marketing:notifications.fabLabels.establishmentGroup',
        ),
        onClick: () => this.setState({ createFormOpen: 'establishment_group' }),
      },
    {
      label: this.props.t('marketing:notifications.fabLabels.private_service'),
      onClick: () => this.setState({ createFormOpen: 'private_service' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.payment_pack'),
      onClick: () => this.setState({ createFormOpen: 'payment_pack' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.contract'),
      onClick: () => this.setState({ createFormOpen: 'contract' }),
    },
    {
      label: this.props.t('marketing:notifications.fabLabels.private_pass'),
      onClick: () => this.setState({ createFormOpen: 'private_pass' }),
    },
  ];

  closeForm = () => this.setState({ createFormOpen: null });

  render() {
    const { classes } = this.props;

    if (this.state.loading) {
      return (
        <div className={classes.loadingContainer}>
          <BackofficeLinearProgress />
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <div className={classes.notificationsContainer}>
          <MarketingRuleListBooking
            bookingNotifications={this.props.notifications.bookings}
            emailSummariesById={this.props.emailSummariesById}
            establishmentById={this.props.establishmentById}
            // @ts-expect-error
            establishmentGroupById={this.props.establishmentGroupById}
            metaActivityBydId={this.props.metaActivityById}
            onClickNotification={this.onClickNotification}
            onUpdateNotification={this.props.updateMarketingNotification}
            // @ts-expect-error
            smartLists={this.props.smartLists}
          />
          <MarketingRuleListPrivateBooking
            emailSummariesById={this.props.emailSummariesById}
            establishmentById={this.props.establishmentById}
            // @ts-expect-error
            establishmentGroupById={this.props.establishmentGroupById}
            onClickNotification={this.onClickNotification}
            onUpdateNotification={this.props.updateMarketingNotification}
            // @ts-expect-error
            privateBookingNotifications={
              this.props.notifications.privateBookings
            }
            privateServiceById={this.props.privateServicebyId}
            // @ts-expect-error
            smartLists={this.props.smartLists}
          />
          <MarketingRuleListPass
            emailSummariesById={this.props.emailSummariesById}
            onClickNotification={this.onClickNotification}
            onToggleActiveNotification={
              this.props.toggleActiveMarketingNotification
            }
            passNotifications={this.props.notifications.paymentPacks}
            sectionTitleKey="notifications.groupTitle.paymentPack"
          />
          <MarketingRuleListPass
            emailSummariesById={this.props.emailSummariesById}
            onClickNotification={this.onClickNotification}
            onToggleActiveNotification={
              this.props.toggleActiveMarketingNotification
            }
            passNotifications={this.props.notifications.privatePasses}
            sectionTitleKey="notifications.groupTitle.privatePass"
          />
          <MarketingRuleListContract
            contractById={this.props.contractById}
            contractNotifications={this.props.notifications.byContract}
            emailSummariesById={this.props.emailSummariesById}
            onClickNotification={this.onClickNotification}
            onUpdateNotification={this.props.updateMarketingNotification}
            // @ts-expect-error
            smartLists={this.props.smartLists}
          />

          <MarketingRuleListBirthday
            emailSummariesById={this.props.emailSummariesById}
            notifications={this.props.notifications.birthday}
            onClickNotification={this.onClickNotification}
            onUpdateNotification={this.props.updateMarketingNotification}
            // @ts-expect-error
            smartLists={this.props.smartLists}
          />
          <div className={classes.bottomPaddingFix} />
        </div>

        <div className={classes.emailContainer}>
          <MarketingRuleDetail
            contractById={this.props.contractById}
            emailDetails={this.getSelectedEmailTemplateDetail()}
            emailSummary={this.getSelectedEmailTemplateSummary()}
            establishmentById={this.props.establishmentById}
            // @ts-expect-error
            establishmentGroupById={this.props.establishmentGroupById}
            loading={
              this.props.emailTemplateLoading ||
              this.props.notificationStatLoading
            }
            metaActivityBydId={this.props.metaActivityById}
            notificationsStatById={this.props.notificationsStatById}
            onClickEdit={() => {
              const editNotification = this.props.notificationList.find(
                (n) => n.id === this.state.selectedNotification,
              );
              this.setState({
                editNotification,
              });
            }}
            onClickRemove={this.onClickRemove}
            onUpdateNotification={this.props.updateMarketingNotification}
            paymentPackById={this.props.paymentPackById}
            privatePassById={this.props.privatePassById}
            privateServiceById={this.props.privateServicebyId}
            resolvedGenericTags={this.props.resolvedGenericTags}
            selectedNotification={this.props.notificationList.find(
              (n) => n.id === this.state.selectedNotification,
            )}
            smartLists={this.props.smartLists}
            theme={this.props.theme}
          />
        </div>

        <MarketingRuleFormGeneric
          closeForm={this.closeForm}
          contracts={this.props.contracts}
          // @ts-expect-error
          createFormOpenType={this.state.createFormOpen}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetailById}
          emailListLoading={this.props.emailListLoading}
          emailSummaryList={this.props.emailSummaryList}
          establishmentGroups={this.props.establishmentGroups}
          establishments={this.props.establishments}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          metaActivities={this.props.metaActivities.map((ma) =>
            ma.asMutable({ deep: true }),
          )}
          onCancel={() => this.setState({ editNotification: null })}
          onClose={this.closeForm}
          onCreateMarketingNotification={this.handleCreate}
          onUpdateMarketingNotification={this.onEditNotification}
          paymentPacks={this.props.paymentPacks}
          privatePasses={this.props.privatePasses}
          privateServices={this.props.privateServices}
          resolvedGenericTags={this.props.resolvedGenericTags}
          selectedNotification={this.state.editNotification}
          smartListLoading={this.props.smartListLoading}
          // @ts-expect-error
          smartLists={this.props.smartLists}
          tags={this.props.tagCategories}
          // @ts-expect-error
          workshopList={this.props.workshopList}
        />
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="member.allowed_actions.manageNotification"
        >
          <FabWithItems
            items={this.getCreateButtonSpec()}
            label={this.props.t(
              'marketing:notifications.createNotificationFabLabel',
            )}
          />
        </ObjectLevelPermissionWrapper>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
  },
  notificationsContainer: {
    display: 'flex',
    flex: 1,
    height: '92vh',
    flexDirection: 'column',
    overflowY: 'scroll',
    paddingRight: theme.spacing(4),
  },
  bottomPaddingFix: {
    width: '100%',
    minHeight: theme.spacing(8),
  },
  emailContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    width: '100%',
  },
});

const mapStateToProps = (state: RootState) => ({
  notifications: {
    ...getNotificationGrouped(state),
  },
  isMultiLocationEnabled: state.theme.theme.enable_multi_localization,
  notificationList: getNotificationForMarketingPage(state),
  paymentPackById: state.paymentPack.byId,
  privatePassById: state.privateService.privatePass.byId,
  establishmentById: state.establishment.byId,
  establishmentGroupById: state.establishment.establishmentGroup.byId,
  privateServicebyId: state.privateService.privateService.byId,
  metaActivityById: state.metaActivity.byId,
  contractById: state.subscription.contract.byId,
  emailTemplateLoading: state.emailTemplate.loading,
  emailSummariesById: getAllEmailTemplatesDict(state),
  emailDetailById: getEmailTemplatesDetail(state),
  notificationsStatById: state.communication.marketingNotification.byId,
  notificationStatLoading: state.communication.marketingNotification.loading,
  emailDetailLoading: state.emailTemplate.detail.loading,
  emailListLoading: state.emailTemplate.loading,
  emailSummaryList: getAllEmailTemplatesSummaries(
    state,
  ) as EmailTemplateSummary[],
  smartLists: getAllSmartList(state),
  smartListLoading: state.smartList.loading,
  metaActivities: getPageEnabledPureMetaActivities(state),
  workshopList: getEnabledWorkshops(state),
  establishments: getAvailableEstablishmentList(state),
  establishmentGroups: withEstablishment(getAssociatedEstablishmentGroup)(
    state,
  ) as Array<EstablishmentGroup>,
  privateServices: _getAvailablePrivateServices(state),
  paymentPacks: getAllPaymentPacks(state),
  // @ts-expect-error
  contracts: getActiveContractList(state),
  theme: getTheme(state),
  tagCategories: getTagCategories(state),
  privatePasses: getPrivatePasses(state),
  resolvedGenericTags: getResolvedGenericTags(state),
});

const mapDispatchToProps = {
  fetchMarketingNotification,
  fetchMarketingNotificationList,
  fetchEmailTemplateSummariesBulk,
  fetchEstablishmentBulk,
  fetchPaymentPackBulk,
  fetchPrivateServiceBulk,
  fetchMetaActivityBulk,
  fetchEmailTemplatesSummaries,
  fetchEmailTemplateDetail: emailTemplateDetail,
  fetchEmailTemplateComplete: emailTemplateComplete,
  goToSmartlist: () => push('/smart-list'),
  getSmartLists: fetchAllSmartLists,
  updateMarketingNotification,
  toggleActiveMarketingNotification,
  createMarketingNotification,
  deleteMarketingNotification,
  fetchActivitiesCompany,
  fetchEstablishments,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  fetchPrivatePassList,
  fetchPaymentPackList: () =>
    fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
  fetchContractList,
  fetchMarketingNotificationCampaignSummary,
  fetchTagList,
  fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  push,
  fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
};

export default compose(
  // @ts-expect-error
  withStyles(styles),
  routerParamsToProps({ notificationId: 'notificationId:number' }),
  withTranslation(['paymentPack', 'marketing']),
  withTitle(({ t }: { t: TFunction }) => t('titles:marketing.notifications')),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketingRuleListPage);
