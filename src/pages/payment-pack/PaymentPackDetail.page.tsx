// @ts-nocheck
import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { TFunction } from 'i18next';
import { push as pushRouter } from 'connected-react-router';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import uniqBy from 'lodash/uniqBy';
import {
  fetchActivitiesCompany,
  fetchMetaActivities as fetchMetaActivitiesAction,
  fetchMetaActivityBulk,
} from '#libs/meta-activity/actions';
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '#libs/establishment/actions';
import MarketingRuleListItemPaymentPack from '#libs/marketing/components/marketing-rule-list-item/MarketingRuleListItemPaymentPack.component';
import PaymentPackCard from '#libs/payment-packs/components/PaymentPackCard.component';
import PaginatedConsumerPackList from '#libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import PaymentPackDeleteDialog from '#libs/payment-packs/components/PaymentPackDeleteDialog.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import ConsumerPaymentPackFilters from '#libs/payment-packs/components/ConsumerPaymentPackFilters.component';
import PaymentPackMassExtensionDialog from '#libs/payment-packs/components/PaymentPackMassExtensionDialog.component';
import themeSelectors from '#libs/theme/selectors';

import {
  updateCredit as updateCreditAction,
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
  fetchMassExtensionList,
  createMassExtension,
  deleteMassExtension,
} from '#libs/consumer-payment-pack/actions';
import {
  getConsumerPacksByPackWithMember,
  getConsumerPaymentPackMassExtension,
} from '#libs/consumer-payment-pack/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';

import {
  getResolvedGenericTags,
  getTagCategories,
} from '#libs/notification-rule/selectors';
import { getEditableSCTs } from '#libs/category/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList,
} from '#libs/notification-rule/actions';
import {
  patch as patchPaymentPack,
  fetchOne as fetchPaymentPackAction,
  scalePaymentPackCredit,
  createOrUpdate as createOrUpdatePaymentPackAction,
  fetchAllPaymentPackCategory,
  isPaymentPackUsedInCombo,
} from '#libs/payment-packs/actions';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#libs/marketing/actions';
import { getPaymentPackNotifications } from '#libs/marketing/selectors';
import {
  withEstablishments,
  withMetaActivities,
  getPaymentPack,
  withLinkedPrivatePass,
  withSCT,
  withTags,
  getPaymentPackCategoryById,
  getAllPaymentPackCategory,
} from '#libs/payment-packs/selectors';
import withTitle from '#hocs/with-title.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import {
  PaymentPack,
  PaymentPackFilters,
  PaymentPackFiltersOpener,
  PaymentPackFormValues,
} from '#libs/payment-packs/types';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#libs/member/actions';
import { OptionCallback } from '../../state/types';

import { snackbarSuccess } from '#libs/snackbar/actions';
import { getAllSmartList } from '#libs/smart-list/selectors';

import {
  fetchSmartListBulk as fetchSmartListBulkAction,
  fetchAllSmartLists,
} from '#libs/smart-list/actions';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import PaymentPackMassExtensionList from '#libs/consumer-payment-pack/components/PaymentPackMassExtensionList.component';
import { PaymentPackMassExtension } from '#libs/consumer-payment-pack/types';

import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import PaymentPackFormDrawer from '#libs/payment-packs/components/PaymentPackForm';
import { getAvailableEstablishmentList } from '#libs/establishment/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#libs/meta-activity/selectors';
import { fetchVideoFilterableParams } from '#libs/video/actions';
import { VideoStatusEnum } from '#libs/video/types';
import { getPrivateServices } from '#libs/private-service/selectors/private-service';
import {
  getPrivatePass,
  withServices,
  withAvailable,
  getCompatibilityPassWithService as getCompatibleServicePass,
} from '#libs/private-service/selectors/private-pass';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  updateCompatibleServicePass,
} from '#libs/private-service/actions';
import type { PrivateSlot } from '#libs/private-service/types';
import PrivatePassCompatibleServiceList from '#libs/private-service/components/pass/PrivatePassCompatibleServiceList.component';
import { setGenericFilterValue } from '#libs/payment-packs/utils';
import BottomActionButtons from '#components/button/BottomActionsButton.component';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#libs/theme/actions';

import NoShowPenaltyDialog from '#libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';
import DeleteNoShowPenaltyDialog from '#libs/payment-packs/components/PaymentPackForm/DeleteNoShowPenaltyDialog.component';

type OwnProps = {
  id: number;
};

type ConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type ConnectedPropsWithLinkedPrivatePass = ConnectedProps &
  ReturnType<typeof mapLinkedPrivatePassStateToProps>;
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type WithStateProps = ConnectedPropsWithLinkedPrivatePass & StateHandlerType;

type Props = WithStateProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  paymentPackToDeleteId?: number | null;
  paymentPackToEdit?: PaymentPack;
};

const PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE = 5;
const CONSUMER_PACK_PAGINATION_SIZE = 7;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4;

export class PaymentPackDetail extends Component<Props, State> {
  state: State = {
    paymentPackToDeleteId: null,
    paymentPackToEdit: null,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchConsumerPacks(
        this.props.id,
        1,
        CONSUMER_PACK_PAGINATION_SIZE,
        this.props.filters,
        {
          onSuccess: (cpps) => {
            this.props.fetchFilteredMembers({
              id__in: cpps.map((b: any) => b.member_id),
            });
          },
        },
      );
    }
  }

  componentWillMount() {
    this.props.resetConsumerPacks();
  }

  componentDidMount() {
    this.props.fetchPaymentPack(this.props.id, {
      onSuccess: () => this.props.fetchCompatibleServicePasses(),
    });
    this.props.fetchPrivatePassList();
    this.props.fetchAllPrivateServices();
    this.props.fetchEstablishments();
    this.props.fetchActivitiesCompany(this.props.companyId);
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchNotificationsAndTemplatesAndSmartLists();
    this.props.fetchMassExtensionList({
      paymentPack: this.props.id,
      page: 1,
      page_size: PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE,
    });

    this.props.fetchAllPaymentPackCategory();
    this.props.fetchTagList();
    this.props.fetchResolvedGenericTags();
    this.props.fetchVideoFilterableParams({
      company: this.props.companyId,
      status: VideoStatusEnum.processed,
    });
  }

  requestEdit = (pp: PaymentPack) => {
    this.setState({ paymentPackToEdit: pp }, () => {
      this.props.setOpenPaymentPackFormDialog(true);
    });
  };

  requestDelete = (paymentPack: PaymentPack) => {
    this.setState({
      paymentPackToDeleteId: paymentPack.id,
    });
    this.props.fetchConsumerPacks(
      paymentPack.id,
      1,
      CONSUMER_PACK_PAGINATION_SIZE,
      this.props.filters,
    );
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDeleteId: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.isPaymentPackUsedInCombo(id);
    this.props.updatePaymentPack(id, { disabled: true });
    this.setState({ paymentPackToDeleteId: null });
  };

  createMassExtension = (data: {
    minDate: string;
    maxDate: string;
    nbDays: number;
    note: string;
  }) => {
    const { minDate, maxDate, nbDays, note } = data;

    this.props.setLoadingMassExtension(true);
    this.props.createMassExtension(
      {
        payment_pack: this.props.pack.id,
        min_ending_date: minDate,
        max_ending_date: maxDate,
        nb_days: nbDays,
        note,
      },
      {
        onSuccess: () => {
          this.props.setLoadingMassExtension(false);
          this.props.fetchMassExtensionList({
            paymentPack: this.props.id,
            page: 1,
            page_size: PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE,
          });
        },
      },
    );

    this.props.setOpenMassExtensionDialog(false);
  };

  onDeleteMassExtension = (massExtension: PaymentPackMassExtension) => {
    this.props.deleteMassExtension(massExtension.id, {
      onSuccess: () => {
        this.props.fetchMassExtensionList({
          paymentPack: this.props.id,
          page: 1,
          page_size: PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE,
        });
      },
    });
  };

  createNotification = (data: any) => {
    this.props.createMarketingNotification(data, {
      onSuccess: () => this.props.fetchNotificationsAndTemplatesAndSmartLists(),
    });
  };

  closePaymentPackFormDrawer = () =>
    this.props.setOpenPaymentPackFormDialog(false);

  closeNoShowPenaltyDialog = () => {
    this.props.setOpenNoShowPenaltyDialog(false);
    this.props.setOpenPaymentPackFormDialog(false);
    this.props.fetchPaymentPack(this.props.id);
  };

  closeDeleteNoShowPenaltyDialog = () => {
    this.props.setOpenDeleteNoShowPenaltyDialog(false);
    this.props.setOpenPaymentPackFormDialog(false);
    this.props.fetchPaymentPack(this.props.id);
  };

  render() {
    const {
      pack,
      loading,
      classes,
      notifications,
      categoryList,
      availableEstablishmentList,
      metaActivities,
      allTagsWithTagGroup,
      paymentPackCategories,
    } = this.props;
    if (loading || !this.props.pack) {
      return <LinearProgress />;
    }
    const paymentPackCategory = pack.category
      ? this.props.paymentPackCategoryById[pack.category]
      : {};
    return (
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.paymentPackContainer}>
          <NoShowPenaltyDialog
            open={this.props.openNoShowPenaltyDialog}
            onClose={this.closeNoShowPenaltyDialog}
            goToSettings={this.props.goToSettings}
          />
          <DeleteNoShowPenaltyDialog
            open={this.props.openDeleteNoShowPenaltyDialog}
            onClose={this.closeDeleteNoShowPenaltyDialog}
          />
          <PaymentPackCard
            pack={pack}
            onEditButtonClick={() => this.requestEdit(pack)}
            onDeleteButtonClick={
              pack.template_instance ? null : () => this.requestDelete(pack)
            }
            snackbarSuccess={this.props.snackbarSuccess}
            onScaleCredit={
              !!this.props.pack &&
              !this.props.pack.template_instance &&
              this.props.scaleCredit
            }
            scaleCreditLoading={this.props.scaleCreditLoading}
            loadingMassExtension={this.props.loadingMassExtension}
            isManager
            paymentPackCategory={paymentPackCategory?.name}
          />
          {pack?.linked_private_pass && (
            <div className={classes.compatiblePSCard}>
              <PrivatePassCompatibleServiceList
                privateServices={this.props.privateServices}
                deleteCompatibleServicePass={
                  this.props.deleteCompatibleServicePass
                }
                createCompatibleServicePass={
                  this.props.createCompatibleServicePass
                }
                updateCompatibleServicePass={
                  this.props.updateCompatibleServicePass
                }
                compatibleServicePass={this.props.compatibleServicePass}
                pass={this.props.linkedPrivatePass}
                isManager
              />
            </div>
          )}
          <MarketingRuleListItemPaymentPack
            pack={pack}
            notifications={notifications}
            getEmails={this.props.fetchEmailTemplatesSummaries}
            emails={this.props.email_templates_list}
            getEmailDetail={this.props.fetchEmailTemplateDetail}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            createNotification={this.createNotification}
            updateNotification={this.props.updateMarketingNotification}
            deleteNotification={this.props.deleteMarketingNotification}
            smartLists={this.props.smartLists}
            smartListLoading={this.props.smartListLoading}
            getSmartLists={this.props.getSmartLists}
            is_expired
            goToSmartlist={this.props.goToSmartlist}
            tags={this.props.tagCategories}
            resolvedGenericTags={this.props.resolvedGenericTags}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <ConsumerPaymentPackFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={this.props.filters}
              t={this.props.t}
            />
            <Divider />
            <PaginatedConsumerPackList
              paymentPack={this.props.pack}
              incrementCredit={this.props.incrementCredit}
              decrementCredit={this.props.decrementCredit}
              items={this.props.consumerPacks.items}
              onClick={(cpp: any) => {
                this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
              }}
              nbItems={this.props.consumerPacks.count}
              loading={this.props.consumerPacks.loading}
              page={this.props.consumerPacks.page}
              consumerPacksUpdatingById={this.props.consumerPacks.updatingById}
              itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerPacksList(page, pageSize)
              }
            />
          </Paper>

          <div className={classes.massExtensionContainer}>
            {!!(
              this.props.massExtension.items &&
              this.props.massExtension.items.length
            ) && (
              <React.Fragment>
                <Typography variant="h5">
                  {this.props.t('paymentPack:section.massExtension')}
                </Typography>
                <Divider className={this.props.classes.divider} />
                <PaymentPackMassExtensionList
                  items={this.props.massExtension.items}
                  nbItems={this.props.massExtension.count}
                  firstLoadDone={this.props.massExtension.firstLoadDone}
                  loading={this.props.massExtension.loading}
                  page={this.props.massExtension.page}
                  itemPerPage={PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE}
                  onPageRequested={(page, page_size) => {
                    this.props.fetchMassExtensionList({
                      paymentPack: this.props.id,
                      page,
                      page_size,
                    });
                  }}
                  onDelete={this.onDeleteMassExtension}
                />
              </React.Fragment>
            )}
          </div>
        </Grid>

        <PaymentPackDeleteDialog
          open={!!this.state.paymentPackToDeleteId}
          pack={this.props.pack}
          onDelete={() =>
            this.deletePaymentPack(this.state.paymentPackToDeleteId)
          }
          isUsedInCombo={
            this.props.archivationWarning[this.state.paymentPackToDeleteId]
              ?.used_in_combo || false
          }
          consumerPackSummary={
            this.state.paymentPackToDeleteId ? (
              <PaginatedConsumerPackList
                paymentPack={this.props.pack}
                incrementCredit={this.props.incrementCredit}
                decrementCredit={this.props.decrementCredit}
                items={this.props.consumerPacks.items}
                consumerPacksUpdatingById={
                  this.props.consumerPacks.updatingById
                }
                nbItems={this.props.consumerPacks.count}
                onClick={(cpp: any) => {
                  this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
                }}
                loading={this.props.consumerPacks.loading}
                page={this.props.consumerPacks.page}
                itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchConsumerPacksList(page, pageSize)
                }
              />
            ) : null
          }
          onCancel={this.cancelDelete}
        />
        <PaymentPackMassExtensionDialog
          open={this.props.openMassExtensionDialog}
          onClose={() => this.props.setOpenMassExtensionDialog(false)}
          onSubmit={this.createMassExtension}
        />
        <PaymentPackFormDrawer
          provincialTax={this.props.theme?.provincial_tax_value}
          open={this.props.openPaymentPackFormDialog}
          categoryList={[...categoryList]
            .filter(
              (category) =>
                metaActivities.map((a) => a.SCT).indexOf(category.id) !== -1,
            )
            .concat(this.props.videoCategories)
            .filter(
              (value, index, arr) =>
                arr.findIndex((sct) => sct.id === value.id) === index,
            )}
          availableEstablishmentList={availableEstablishmentList}
          metaActivityList={[...metaActivities]}
          tagList={allTagsWithTagGroup ? [...allTagsWithTagGroup] : []}
          paymentPackCategories={paymentPackCategories}
          closeForm={this.closePaymentPackFormDrawer}
          onSubmit={this.props.createOrUpdatePaymentPack}
          clearPaymentPackToEdit={() =>
            this.setState({ paymentPackToEdit: null })
          }
          initial={{
            ...this.state.paymentPackToEdit,
            establishments:
              this.state.paymentPackToEdit?.establishments?.map(
                (establishment) => establishment.id,
              ) ?? [],
            metaActivities:
              this.state.paymentPackToEdit?.metaActivities?.map(
                (metaActivitie) => metaActivitie?.id,
              ) ?? [],
            blacklist_tags:
              this.state.paymentPackToEdit?.blacklist_tags?.map(
                (tag) => tag.id,
              ) ?? [],
            whitelist_tags:
              this.state.paymentPackToEdit?.whitelist_tags?.map(
                (tag) => tag.id,
              ) ?? [],
          }}
          privateServices={this.props.privateServices}
          compatibleServicePass={this.props.compatibleServicePass}
          allowGuestMaster={
            this.props.theme?.allow_guest &&
            this.props.theme?.allow_guest_activatable
          }
        />
        {!!this.props.pack &&
          !this.props.pack.template_instance &&
          !this.props.loadingMassExtension && (
            <BottomActionButtons
              onCreate={() => this.props.setOpenMassExtensionDialog(true)}
              onCreateLabel={this.props.t('paymentPack:massExtension.title')}
            />
          )}
      </Grid>
    );
  }
}

const styles = (theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
  massExtensionContainer: {
    paddingTop: theme.spacing(4),
  },
  paymentPackContainer: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(4),
    },
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  buttonContainerCenter: {
    paddingTop: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  compatiblePSCard: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState, props: OwnProps) => {
  return {
    massExtension: {
      items: getConsumerPaymentPackMassExtension(state),
      count: state.consumerPaymentPack.massExtension.count,
      loading: state.consumerPaymentPack.massExtension.loading,
      firstLoadDone: state.consumerPaymentPack.massExtension.firstLoadDone,
      page: state.consumerPaymentPack.massExtension.page,
    },
    loading: state.paymentPack.loading || state.establishment.loading,
    pack: withTags(
      withSCT(
        withMetaActivities(
          withEstablishments(withLinkedPrivatePass(getPaymentPack)),
        ),
      ),
    )(state, props.id),
    scaleCreditLoading: state.paymentPack.scaleCredit.loading,
    notifications: {
      items: getPaymentPackNotifications(state),
      loading: state.marketingNotification.loading,
    },
    consumerPacks: {
      items: getConsumerPacksByPackWithMember(state),
      count: state.consumerPaymentPack.byPaymentPack.count,
      loading: state.consumerPaymentPack.byPaymentPack.loading,
      page: state.consumerPaymentPack.byPaymentPack.page,
      updatingById: state.consumerPaymentPack.updatingById,
    },
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    smartLists: getAllSmartList(state),
    smartListLoading: state.smartList.loading,
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    paymentPackCategoryById: getPaymentPackCategoryById(state),
    availableEstablishmentList: getAvailableEstablishmentList(state),
    paymentPackCategories: getAllPaymentPackCategory(state),
    metaActivities: uniqBy(
      [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
        ...getActivitiesByIdList(state, []),
      ],
      'id',
    ),
    theme: themeSelectors.getTheme(state),

    categoryList: getEditableSCTs(state),
    tagCategories: getTagCategories(state),
    videoCategories: state.video.filterableParams.items.SCTs,
    companyId: state.theme.theme.company,
    archivationWarning: state.paymentPack.archivationWarning,
    privateServices: getPrivateServices(state),
    compatibleServicePass: getCompatibleServicePass(state),
    resolvedGenericTags: getResolvedGenericTags(state),
    isRollCallMandatory: state.theme.theme.is_roll_call_mandatory,
  };
};

const mapLinkedPrivatePassStateToProps = (
  state: RootState,
  props: ConnectedProps,
) => {
  return {
    linkedPrivatePass: withAvailable(withServices(getPrivatePass))(
      state,
      props.pack?.linked_private_pass?.id,
    ),
  };
};
const mapDispatchToProps = {
  snackbarSuccess,
  fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
  goToEmailCreate: () => pushRouter('/email-template/create'),
  fetchMetaActivityBulk,
  fetchEstablishmentBulk,
  fetchPaymentPack: fetchPaymentPackAction,
  incrementCredit: (consumerPackId: number) =>
    updateCreditAction(consumerPackId, 1),
  decrementCredit: (consumerPackId: number) =>
    updateCreditAction(consumerPackId, -1),
  updatePaymentPack: (paymentPackId: number, data: any) =>
    patchPaymentPack(paymentPackId, data, true),
  resetConsumerPacks: resetByPaymentPackAction,
  goToSmartlist: () => pushRouter('/smart-list'),
  goToConsumerPackDetail: (memberId: number, passId: number) =>
    pushRouter(`/member/${memberId}/pass/${passId}`),
  fetchConsumerPacks: (
    paymentPackId: number,
    page: number,
    pageSize: number,
    filters?: PaymentPackFilters,
    options?: OptionCallback,
  ) =>
    fetchByPaymentPackAction(paymentPackId, page, pageSize, options, filters),
  fetchFilteredMembers: fetchFilteredMembersAction,
  fetchEmailTemplateSummariesBulk: fetchEmailTemplateSummariesBulkAction,
  fetchSmartListBulk: fetchSmartListBulkAction,
  fetchEmailTemplatesSummaries,
  getSmartLists: fetchAllSmartLists,
  scaleCredit: scalePaymentPackCredit,
  fetchAllPaymentPackCategory,
  fetchMarketingNotificationList: fetchMarketingNotificationListAction,
  createMarketingNotification: createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification: deleteMarketingNotificationAction,
  createMassExtension,
  fetchMassExtensionList,
  deleteMassExtension,
  fetchEstablishments,
  fetchActivitiesCompany,
  fetchMetaActivities: fetchMetaActivitiesAction,
  createOrUpdatePaymentPackAction,
  fetchTagList,
  fetchVideoFilterableParams,
  isPaymentPackUsedInCombo,
  fetchPrivatePassList,
  fetchAllPrivateServices,
  fetchPrivateSlotsByService: fetchAllPrivateSlots,
  fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  updateCompatibleServicePass,
  fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
  refreshCompanyThemeAction,
  pushRouter,
};

const mapWithHandlers = {
  setOpenValue:
    (props: WithStateProps) => (name: keyof PaymentPackFiltersOpener) => {
      props.setOpen({
        ...props.open,
        [name]: !props.open[name],
      });
    },
  setFilterValue:
    (props: WithStateProps) =>
    (filterDict: PaymentPackFilters<boolean | null>) =>
      setGenericFilterValue(props.filters, filterDict, props.setFilters),
  fetchConsumerPacksList:
    (props: WithStateProps) => (page: number, pageSize: number) => {
      props.fetchConsumerPacks(props.pack.id, page, pageSize, props.filters, {
        onSuccess: (cpps: any) => {
          props.fetchFilteredMembers({
            id__in: cpps.map((b: any) => b.member_id),
          });
        },
      });
    },
  scaleCredit: (props: WithStateProps) => (id_: number, data: any) => {
    props.scaleCredit(id_, data, {
      onBackgroundSuccess: () => {
        if (window.location.pathname === `/payment-pack/${props.id}`) {
          props.fetchPaymentPack(props.id);
          props.fetchConsumerPacks(props.id, 1, CONSUMER_PACK_PAGINATION_SIZE);
        }
      },
    });
  },
  createOrUpdatePaymentPack:
    (props: WithStateProps) =>
    (data: PaymentPackFormValues, options: OptionCallback) => {
      props.createOrUpdatePaymentPackAction(data, {
        ...options,
        onSuccess: () => {
          options.onSuccess();
          props.refreshCompanyThemeAction(props.companyId, {
            onSuccess: (theme) => {
              if (!props.isRollCallMandatory && theme.is_roll_call_mandatory) {
                props.setOpenNoShowPenaltyDialog(true);
              } else if (
                props.isRollCallMandatory &&
                !theme.is_roll_call_mandatory
              ) {
                props.setOpenDeleteNoShowPenaltyDialog(true);
              } else {
                props.setOpenPaymentPackFormDialog(false);
                props.fetchPaymentPack(props.id);
              }
            },
          });
        },
      });
    },
  fetchNotificationsAndTemplatesAndSmartLists:
    (props: WithStateProps) => () => {
      props.fetchMarketingNotificationList(
        {
          kind__in: [
            CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
            CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
          ],
          event_rules__payment_pack_id: props.id,
        },
        {
          onSuccess: (notificationList: any) => {
            props.fetchEmailTemplateSummariesBulk(
              notificationList.map(
                (notification: any) => notification.email_design,
              ),
            );
            props.fetchSmartListBulk([
              ...notificationList.map(
                (notification: any) =>
                  notification.event_rules.smartlist_include,
              ),
              ...notificationList.map(
                (notification: any) =>
                  notification.event_rules.smartlist_exclude,
              ),
            ]);
          },
        },
      );
    },
  fetchCompatibleServicePasses: (props: WithStateProps) => () => {
    if (props.pack && props.pack?.linked_private_pass?.id) {
      props.fetchCompatibleServicePassList(props.pack.linked_private_pass.id, {
        onSuccess: (csps) => {
          const private_service__in = csps?.map(
            (c: PrivateSlot) => c.private_service,
          );
          if (private_service__in?.length !== 0) {
            props.fetchPrivateSlotsByService({
              private_service__in,
            });
          }
        },
      });
    }
  },
  goToSettings: (props: WithStateProps) => () => {
    props.pushRouter('/settings/personalization');
  },
};

type StateHandlerInit = {
  filters: PaymentPackFilters;
  open: PaymentPackFiltersOpener;
  openMassExtensionDialog: boolean;
  loadingMassExtension: boolean;
  openPaymentPackFormDialog: boolean;
  openNoShowPenaltyDialog: boolean;
  openDeleteNoShowPenaltyDialog: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  filters: {},
  open: {},
  openMassExtensionDialog: false,
  loadingMassExtension: false,
  openPaymentPackFormDialog: false,
  openNoShowPenaltyDialog: false,
  openDeleteNoShowPenaltyDialog: false,
};

const withStateHandlersSetter = {
  setFilters: () => (filters: PaymentPackFilters) => {
    return { filters };
  },
  setOpen: () => (open: PaymentPackFiltersOpener) => {
    return { open };
  },
  setOpenMassExtensionDialog: () => (openMassExtensionDialog: boolean) => {
    return { openMassExtensionDialog };
  },
  setLoadingMassExtension: () => (loadingMassExtension: boolean) => {
    return { loadingMassExtension };
  },
  setOpenNoShowPenaltyDialog: () => (openNoShowPenaltyDialog: boolean) => {
    return { openNoShowPenaltyDialog };
  },
  setOpenDeleteNoShowPenaltyDialog:
    () => (openDeleteNoShowPenaltyDialog: boolean) => {
      return { openDeleteNoShowPenaltyDialog };
    },
  setOpenPaymentPackFormDialog: () => (openPaymentPackFormDialog: boolean) => {
    return { openPaymentPackFormDialog };
  },
};

export default compose(
  withStyles(styles),
  withTranslation(),
  routerParamsToProps({ id: 'id:number' }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
  connect(mapLinkedPrivatePassStateToProps, null),
)(PaymentPackDetail);
