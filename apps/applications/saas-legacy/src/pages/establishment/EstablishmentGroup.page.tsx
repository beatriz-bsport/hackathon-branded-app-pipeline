import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { push } from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme } from '@material-ui/core';
import { getAllSmartList } from '#src/libs/smart-list/selectors';
import { fetchAllSmartLists } from '#src/libs/smart-list/actions';
import GenericFormDialog from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import MarketingRuleListEstablishmentGroup from '#src/libs/marketing/components/MarketingRuleListEstablishmentGroup.component';
import {
  getAllEmailTemplatesDict,
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#src/libs/email-editor/actions';
import { getmarketingNotificationbyEstablishmentGroup } from '#src/libs/marketing/selectors';
import { MarketingNotification } from '#src/libs/marketing/types';
import { EmailTemplateSummary } from '#src/libs/email-editor/types';
import MarketingRuleFormGeneric from '#src/libs/marketing/components/MarketingRuleFormGeneric.component';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import {
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
  upsertEstablishmentGroup as upsertEstablishmentGroupAction,
} from '../../libs/establishment/actions';
import {
  getAssociatedEstablishmentGroup,
  withEstablishment,
  getAvailableEstablishmentList,
  retrieveEstablishmentGroup,
} from '../../libs/establishment/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import EstablishmentGroupFormDialog from '../../libs/establishment/components/EstablishmentGroupFormDialog.component';
import type { EstablishmentGroup as EstablishmentGroupType } from '../../libs/establishment/types';
import EstablishmentGroupTable from '../../libs/establishment/components/EstablishmentGroupTable.component';
import themeSelectors from '../../libs/theme/selectors';
import {
  fetchMarketingNotificationByEstablishmentGroupAction,
  createMarketingNotification,
  updateMarketingNotification as updateMarketingNotificationAction,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '../../libs/marketing/actions';

type StateHandlerInit = {
  openDialogForm: boolean;
  initialGroup: EstablishmentGroupType | null;
  submitting: boolean;
  establishmentGroupNotificationsToEditId: number | null;
  notificationToEdit: MarketingNotification;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const BOOKING_CREATION_NOTIFICATION = 2;

export class EstablishmentGroup extends React.Component<Props> {
  // @ts-expect-error
  state = { establishmentGroupForNotificationCreation: null };

  componentDidMount() {
    this.props.fetchAllEstablishmentGroup();
    this.props.fetchEstablishments();
    this.props.fetchMarketingNotificationByEstablishmentGroup({
      kind: BOOKING_CREATION_NOTIFICATION,
    });
  }

  setEstablishmentGroupNotificationsToEdit = (groupId: number) => {
    this.props.setEstablishmentGroupNotificationsToEdit(groupId);
    const emailToFetch = this.props.marketingNotificationByEstablishmentGroup[
      groupId
    ]?.reduce((acc, marketingNotification) => {
      if (marketingNotification.email_design) {
        acc.push(marketingNotification.email_design);
      }
      return acc;
    }, [] as Array<number>);
    if (emailToFetch?.length) {
      this.props.fetchEmailTemplateSummariesBulk(emailToFetch);
    }
  };

  closeDrawer = () => {
    this.props.setEstablishmentGroupNotificationsToEdit(null);
  };

  updateNotification = (id: number, data: MarketingNotification) => {
    this.props.updateMarketingNotification(id, data);
    this.closeNotificationEditForm();
  };

  deleteNotification = (id: number) => {
    this.props.deleteMarketingNotification(id);
  };

  editNotification = (notification: MarketingNotification) => {
    this.props.setNotificationToEdit(notification);
  };

  closeNotificationEditForm = () => {
    this.props.setNotificationToEdit(null);
  };

  handleCreateNotification = (notification: MarketingNotification) => {
    this.props.createMarketingNotification(notification, {
      onSuccess: () => {
        this.setState({ establishmentGroupForNotificationCreation: null });
        this.props.fetchMarketingNotificationByEstablishmentGroup({
          kind: BOOKING_CREATION_NOTIFICATION,
        });
      },
    });
  };

  render() {
    if (!this.props.companyTheme.enable_multi_localization) {
      return <Redirect to="/establishment/room" />;
    }
    const { t } = this.props;
    if (this.props.loading || !this.props.establishments) {
      return <BackofficeLinearProgress additionalMargin={1} />;
    }
    return (
      <>
        {this.props.submitting && <BackofficeLinearProgress />}
        <>
          {!this.props.establishmentGroupList ||
          (this.props.establishmentGroupList &&
            this.props.establishmentGroupList.length === 0) ? (
            <IsEmptyList
              button={t('group.addLocalisation')}
              onCreate={() => this.props.setOpenDialogForm(true)}
              text={t('group.noGroupHelper')}
            />
          ) : (
            <Paper>
              <EstablishmentGroupTable
                establishmentGroupList={this.props.establishmentGroupList}
                marketingNotificationByEstablishmentGroup={
                  this.props.marketingNotificationByEstablishmentGroup
                }
                onEditEstablishmentGroup={(group: EstablishmentGroupType) => {
                  // @ts-expect-error
                  this.props.setInitialGroup(group);
                  this.props.setOpenDialogForm(true);
                }}
                setEstablishmentGroupNotificationsToEdit={
                  this.setEstablishmentGroupNotificationsToEdit
                }
              />
            </Paper>
          )}
        </>
        <BottomActionButtons
          onCreate={() => {
            this.props.setInitialGroup(null);
            this.props.setOpenDialogForm(true);
          }}
          onCreateLabel={t('group.addLocalisation')}
        />
        {this.props.openDialogForm && (
          <EstablishmentGroupFormDialog
            establishments={this.props.establishments}
            initial={this.props.initialGroup}
            isSubmitting={this.props.submitting}
            onClose={() => {
              this.props.setOpenDialogForm(false);
              this.props.setInitialGroup(null);
            }}
            // @ts-expect-error
            onSubmit={this.props.upsertEstablishmentGroup}
            open={this.props.openDialogForm}
          />
        )}
        <GenericFormDialog
          onClose={this.closeDrawer}
          open={!!this.props.establishmentGroupNotificationsToEditId}
          subtitle={this.props.establishmentGroupNotificationsToEdit?.name}
          title={t('marketing:notifications.listTitle')}
        >
          <div className={this.props.classes.notificationContainer}>
            <Paper variant="outlined">
              {this.props.marketingNotificationByEstablishmentGroup[
                this.props.establishmentGroupNotificationsToEditId
              ]?.map((marketing_notification) => (
                <MarketingRuleListEstablishmentGroup
                  deleteNotification={this.deleteNotification}
                  editNotification={this.editNotification}
                  email={
                    this.props.emailSummariesById[
                      marketing_notification.email_design
                    ]
                  }
                  marketingNotification={marketing_notification}
                  updateNotification={this.updateNotification}
                />
              ))}
            </Paper>
            <Button
              className={this.props.classes.buttonAdd}
              color="primary"
              onClick={() =>
                this.setState({
                  establishmentGroupForNotificationCreation:
                    this.props.establishmentGroupNotificationsToEditId,
                })
              }
            >
              <AddIcon className={this.props.classes.leftIcon} />
              {t('marketing:notifications.create')}
            </Button>
          </div>
        </GenericFormDialog>
        {this.state.establishmentGroupForNotificationCreation && (
          <MarketingRuleFormGeneric
            closeForm={() =>
              this.setState({ establishmentGroupForNotificationCreation: null })
            }
            createFormOpenType="establishment_group"
            emailDetailLoading={this.props.emailDetailLoading}
            emailDetails={this.props.emailDetailById}
            emailListLoading={this.props.emailListLoading}
            emailSummaryList={this.props.emailSummaryList}
            establishmentGroups={this.props.establishmentGroupList}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            getSmartLists={this.props.getSmartLists}
            goToSmartlist={this.props.goToSmartlist}
            objectId="establishment_group"
            onCancel={() =>
              this.setState({ establishmentGroupForNotificationCreation: null })
            }
            onCreateMarketingNotification={this.handleCreateNotification}
            // @ts-expect-error
            onUpdateMarketingNotification={this.onEditNotification}
            // @ts-expect-error
            smartLists={this.props.smartLists}
            sourceObjectId={
              this.state.establishmentGroupForNotificationCreation
            }
          />
        )}
        <MarketingRuleFormGeneric
          closeForm={this.closeNotificationEditForm}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetailById}
          emailListLoading={this.props.emailListLoading}
          emailSummaryList={this.props.emailSummaryList}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          onCancel={this.closeNotificationEditForm}
          onUpdateMarketingNotification={this.updateNotification}
          selectedNotification={this.props.notificationToEdit}
          // @ts-expect-error
          smartLists={this.props.smartLists}
        />
      </>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    notificationContainer: {
      padding: theme.spacing(2),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    buttonAdd: {
      marginTop: theme.spacing(1),
    },
  });
const mapStateToProps = (state: RootState, props: StateHandlerType) => ({
  loading:
    state.establishment.loading ||
    state.establishment.establishmentGroup.loading,
  establishmentGroupList: withEstablishment(getAssociatedEstablishmentGroup)(
    state,
  ),
  emailDetailById: getEmailTemplatesDetail(state),

  establishmentGroupNotificationsToEdit: retrieveEstablishmentGroup(
    state,
    props.establishmentGroupNotificationsToEditId,
  ),
  establishments: getAvailableEstablishmentList(state),
  companyTheme: themeSelectors.getTheme(state),
  marketingNotificationByEstablishmentGroup:
    getmarketingNotificationbyEstablishmentGroup(state),
  emailSummariesById: getAllEmailTemplatesDict(state),
  emailSummaryList: getAllEmailTemplatesSummaries(
    state,
  ) as EmailTemplateSummary[],
  emailListLoading: state.emailTemplate.loading,
  emailDetailLoading: state.emailTemplate.detail.loading,
  smartLists: getAllSmartList(state),
});
const mapDispatchToProps = {
  fetchEmailTemplateDetail: emailTemplateDetail,
  fetchEmailTemplatesSummaries,
  fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
  fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  fetchEstablishments: fetchEstablishmentsAction,
  upsertEstablishmentGroupAction,
  fetchMarketingNotificationByEstablishmentGroup:
    fetchMarketingNotificationByEstablishmentGroupAction,
  updateMarketingNotification: updateMarketingNotificationAction,
  deleteMarketingNotification: deleteMarketingNotificationAction,
  createMarketingNotification,
  goToSmartlist: () => push('/smart-list/'),
  getSmartLists: fetchAllSmartLists,
};
const mapWithHandlers = {
  upsertEstablishmentGroup:
    (props: OwnAndConnectedProps) =>
    (establishmentGroup: EstablishmentGroupType) => {
      props.setSubmitting(true);
      props.upsertEstablishmentGroupAction(establishmentGroup, {
        onSuccess: () => {
          props.setSubmitting(false);
          props.setInitialGroup(null);
          props.setOpenDialogForm(false);
        },
        onError: () => props.setSubmitting(false),
      });
    },
};
const withStateHandlersInit: StateHandlerInit = {
  openDialogForm: false,
  initialGroup: null,
  submitting: false,
  establishmentGroupNotificationsToEditId: null,
  notificationToEdit: null,
};
const withStateHandlersSetter = {
  setOpenDialogForm: () => (openDialogForm: boolean) => {
    return { openDialogForm };
  },
  setInitialGroup: () => (initialGroup: EstablishmentGroup | null) => {
    return { initialGroup };
  },
  setSubmitting: () => (submitting: boolean) => {
    return { submitting };
  },
  setNotificationToEdit: () => (notificationToEdit: MarketingNotification) => {
    return { notificationToEdit };
  },
  setEstablishmentGroupNotificationsToEdit:
    () => (establishmentGroupNotificationsToEditId: number) => {
      return { establishmentGroupNotificationsToEditId };
    },
};
export default compose<any, OwnProps>(
  withTranslation(['establishment', 'marketing']),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentGroupPage'),
  ),
  // @ts-expect-error
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(EstablishmentGroup);
