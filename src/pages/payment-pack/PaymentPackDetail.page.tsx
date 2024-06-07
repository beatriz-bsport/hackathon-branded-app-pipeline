import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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
} from '#src/libs/meta-activity/actions';
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '#src/libs/establishment/actions';
import PaymentPackCard from '#src/libs/payment-packs/components/PaymentPackCard.component';
import PaginatedConsumerPackList from '#src/libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import PaymentPackDeleteDialog from '#src/libs/payment-packs/components/PaymentPackDeleteDialog.component';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ConsumerPaymentPackFilters from '#src/libs/payment-packs/components/ConsumerPaymentPackFilters.component';
import MarketingRuleListPassNotifications from '#src/libs/marketing/components/marketing-rule-list-item/MarketingRulePassNotifications.component';
import MassExtensionCreateDialog, {
  GenericExtensionCreationPayload,
} from '#src/components/MassExtensionCreateDialog';
import themeSelectors from '#src/libs/theme/selectors';

import {
  updateCredit as updateCreditAction,
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
} from '#src/libs/consumer-payment-pack/actions';
import { getConsumerPacksByPackWithMember } from '#src/libs/consumer-payment-pack/selectors';

import {
  fetchEmailTemplateSummariesBulk as fetchEmailTemplateSummariesBulkAction,
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#src/libs/email-editor/actions';

import {
  getAllEmailTemplatesDict,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';

import {
  getResolvedGenericTags,
  getTagCategories,
} from '#src/libs/notification-rule/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList,
} from '#src/libs/notification-rule/actions';
import {
  patch as patchPaymentPack,
  fetchOne as fetchPaymentPackAction,
  scalePaymentPackCredit,
  createOrUpdate as createOrUpdatePaymentPackAction,
  fetchAllPaymentPackCategory,
  isPaymentPackUsedInCombo,
  updatePaymentPackCompatibilities as updatePaymentPackCompatibilitiesAction,
  fetchPaymentPackMassExtensionList as fetchPaymentPackMassExtensionListAction,
  createPaymentPackMassExtension as createPaymentPackMassExtensionAction,
  deletePaymentPackMassExtension as deletePaymentPackMassExtensionAction,
} from '#src/libs/payment-packs/actions';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createMarketingNotification as createMarketingNotificationAction,
  updateMarketingNotification,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#src/libs/marketing/actions';
import {
  withEstablishments,
  withMetaActivities,
  getPaymentPack,
  withLinkedPrivatePass,
  withSCT,
  withTags,
  getPaymentPackCategoryById,
  getAllPaymentPackCategory,
  getPaymentPackMassExtensionList,
} from '#src/libs/payment-packs/selectors';
import withTitle from '#src/hocs/with-title.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import type {
  PaymentPack,
  PaymentPackCompatibilitiesData,
  PaymentPackFilters,
  PaymentPackFiltersOpener,
  PaymentPackFormValues,
  PaymentPackMassExtension,
} from '#src/libs/payment-packs/types';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '#src/libs/member/actions';

import { snackbarSuccess } from '#src/libs/snackbar/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  getBookkeepingAccountById,
  getBookkeepingAccountList,
} from '#src/libs/payment/selectors';

import {
  fetchSmartListBulk as fetchSmartListBulkAction,
  fetchAllSmartLists,
} from '#src/libs/smart-list/actions';
import PaymentPackMassExtensionList from '#src/libs/consumer-payment-pack/components/PaymentPackMassExtensionList.component';

import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import PaymentPackFormDrawer from '#src/libs/payment-packs/components/PaymentPackForm';
import { getAvailableEstablishmentList } from '#src/libs/establishment/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#src/libs/meta-activity/selectors';
import { fetchVideoFilterableParams } from '#src/libs/video/actions';
import { VideoStatusEnum } from '#src/libs/video/types';
import { getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import {
  getPrivatePass,
  withServices,
  withAvailable,
  getCompatibilityPassWithService as getCompatibleServicePass,
} from '#src/libs/private-service/selectors/private-pass';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  updateCompatibleServicePass,
} from '#src/libs/private-service/actions';
import type { PrivateSlot } from '#src/libs/private-service/types';
import PrivatePassCompatibleServiceList from '#src/libs/private-service/components/pass/PrivatePassCompatibleServiceList.component';
import { setGenericFilterValue } from '#src/libs/payment-packs/utils';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#src/libs/theme/actions';

import NoShowPenaltyDialog from '#src/libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';
import DeleteNoShowPenaltyDialog from '#src/libs/payment-packs/components/PaymentPackForm/DeleteNoShowPenaltyDialog.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import CompatibilityFormComponent from '#src/libs/private-service/components/pass/compatibility/CompatibilityForm.component';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';
import { ConsumerPaymentPackREST } from '#src/libs/consumer-payment-pack/types';
import { getSmartListDict } from '#src/libs/smart-list/selectors';
import { getPaymentPackNotificationsByPackId } from '#src/libs/marketing/selectors';
import type { MarketingNotification } from '#src/libs/marketing/types';

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
              // @ts-expect-error
              id__in: cpps.map((b: any) => b.member_id),
            });
          },
        },
      );
    }
  }

  UNSAFE_componentWillMount() {
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
    // @ts-expect-error
    this.props.fetchPaymentPackMassExtensionList({
      payment_pack: this.props.id,
      page_size: PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE,
    });

    this.props.fetchAllPaymentPackCategory();
    this.props.fetchTagList();
    this.props.fetchResolvedGenericTags();
    this.props.fetchVideoFilterableParams({
      company: this.props.companyId,
      status: VideoStatusEnum.processed,
    });
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchAvailableBookkeepingAccountList();
  }

  updatePaymentPackCompatibilities = (data: PaymentPackCompatibilitiesData) => {
    this.props.updatePaymentPackCompatibilities({
      paymentPackId: this.props.id,
      data,
    });
  };

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

  createMassExtension = (data: GenericExtensionCreationPayload) => {
    this.props.setLoadingMassExtension(true);
    this.props.createPaymentPackMassExtension(
      {
        ...data,
        // @ts-expect-error
        payment_pack: this.props.pack.id,
      },
      {
        onSuccess: () => {
          this.props.setLoadingMassExtension(false);
          // @ts-expect-error
          this.props.fetchPaymentPackMassExtensionList({
            payment_pack: this.props.id,
          });
        },
      },
    );

    this.props.setOpenMassExtensionDialog(false);
  };

  onDeleteMassExtension = (massExtension: PaymentPackMassExtension) => {
    const currentPage = this.props.massExtension.page;
    const isLastItemInPage = this.props.massExtension.items?.length === 1;
    this.props.deletePaymentPackMassExtension(massExtension.id, {
      onSuccess: () => {
        this.props.fetchPaymentPackMassExtensionList({
          payment_pack: this.props.id,
          /** Fetch the previous page if removing the last page item */
          ...(isLastItemInPage && currentPage > 1 && { page: currentPage - 1 }),
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

  handleOpenMassExtensionDialog = () =>
    this.props.setOpenMassExtensionDialog(true);

  handleCloseMassExtensionDialog = () =>
    this.props.setOpenMassExtensionDialog(false);

  removePassFromNotification = (notification: MarketingNotification) => {
    this.props.updateMarketingNotification(notification.id, {
      ...notification,
      event_rules: {
        ...notification.event_rules,
        payment_pack_ids: notification.event_rules.payment_pack_ids.filter(
          (id) => id !== this.props.id,
        ),
      },
    });
  };

  render() {
    const {
      pack,
      loading,
      classes,
      notifications,
      SCTList,
      availableEstablishmentList,
      metaActivities,
      allTagsWithTagGroup,
      paymentPackCategories,
    } = this.props;
    if (loading || !this.props.pack) {
      return <LinearProgress />;
    }
    // @ts-expect-error
    const paymentPackCategory = pack.category
      ? // @ts-expect-error
        this.props.paymentPackCategoryById[pack.category]
      : {};

    const validSCTs = metaActivities.map((metaActivity) => metaActivity.SCT);
    const availableSCTs = SCTList.filter(
      (category) => validSCTs.indexOf(category.id) !== -1,
    )
      .concat(this.props.videoCategories)
      .filter(
        (value, index, arr) =>
          arr.findIndex((sct) => sct.id === value.id) === index,
      );

    return (
      <ObjectLevelPermissionProviderComponent requiredPermission="product.privatePass.allowed_actions.compatibility">
        {(hasCompatibilityPermission: boolean) => (
          <Grid container alignItems="stretch" spacing={3}>
            <Grid item className={classes.paymentPackContainer} md={6} xs={12}>
              <NoShowPenaltyDialog
                goToSettings={this.props.goToSettings}
                onClose={this.closeNoShowPenaltyDialog}
                open={this.props.openNoShowPenaltyDialog}
              />
              <DeleteNoShowPenaltyDialog
                onClose={this.closeDeleteNoShowPenaltyDialog}
                open={this.props.openDeleteNoShowPenaltyDialog}
              />
              <PaymentPackCard
                // @ts-expect-error
                isManager
                loadingMassExtension={this.props.loadingMassExtension}
                onDeleteButtonClick={
                  // @ts-expect-error
                  pack.template_instance ? null : () => this.requestDelete(pack)
                }
                // @ts-expect-error
                onEditButtonClick={() => this.requestEdit(pack)}
                onScaleCredit={
                  !!this.props.pack &&
                  // @ts-expect-error
                  !this.props.pack.template_instance &&
                  this.props.scaleCredit
                }
                pack={pack}
                paymentPackCategory={paymentPackCategory?.name}
                scaleCreditLoading={this.props.scaleCreditLoading}
                snackbarSuccess={this.props.snackbarSuccess}
              />
              {/* @ts-expect-error  */}
              {!(pack?.linked_private_pass || pack?.is_universal_pass) && (
                <>
                  <div className={classes.spacerVertical} />
                  <CompatibilityFormComponent
                    availableEstablishmentList={availableEstablishmentList}
                    metaActivityList={metaActivities}
                    paymentPackValues={{
                      // @ts-expect-error
                      metaActivities: pack.metaActivities,
                      // @ts-expect-error
                      SCTs: pack.categories,
                      // @ts-expect-error
                      establishments: pack.establishments,
                    }}
                    SCTList={availableSCTs}
                    updatePassCompatibility={
                      this.updatePaymentPackCompatibilities
                    }
                  />
                </>
              )}
              {/* @ts-expect-error */}
              {pack?.linked_private_pass && (
                <div className={classes.compatiblePSCard}>
                  <PrivatePassCompatibleServiceList
                    // @ts-expect-error
                    isManager
                    canEdit={hasCompatibilityPermission}
                    compatibleServicePass={this.props.compatibleServicePass}
                    createCompatibleServicePass={
                      this.props.createCompatibleServicePass
                    }
                    deleteCompatibleServicePass={
                      this.props.deleteCompatibleServicePass
                    }
                    pass={this.props.linkedPrivatePass}
                    privateServices={this.props.privateServices}
                    updateCompatibleServicePass={
                      this.props.updateCompatibleServicePass
                    }
                  />
                </div>
              )}
              <MarketingRuleListPassNotifications
                emailDetailLoading={this.props.emailDetailLoading}
                emailDetails={this.props.email_templates_details}
                emailSummariesById={this.props.emailSummariesById}
                getEmailDetail={this.props.fetchEmailTemplateDetail}
                notifications={notifications.items}
                notificationsLoading={notifications.loading}
                removeNotification={this.removePassFromNotification}
                resolvedGenericTags={this.props.resolvedGenericTags}
                smartListsById={this.props.smartListsById}
                smartListsLoading={this.props.smartListLoading}
                theme={this.props.theme}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Paper>
                <ConsumerPaymentPackFilters
                  filters={this.props.filters}
                  open={this.props.open}
                  setFiltersValue={this.props.setFilterValue}
                  setOpenValue={this.props.setOpenValue}
                />
                <Divider />
                <PaginatedConsumerPackList
                  consumerPacksUpdatingById={
                    this.props.consumerPacks.updatingById
                  }
                  decrementCredit={this.props.decrementCredit}
                  incrementCredit={this.props.incrementCredit}
                  itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
                  // @ts-expect-error
                  items={this.props.consumerPacks.items}
                  loading={this.props.consumerPacks.loading}
                  nbItems={this.props.consumerPacks.count}
                  onClick={(cpp: any) => {
                    this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
                  }}
                  onPageRequested={(page: number, pageSize: number) =>
                    this.props.fetchConsumerPacksList(page, pageSize)
                  }
                  page={this.props.consumerPacks.page}
                  // @ts-expect-error
                  paymentPack={this.props.pack}
                />
              </Paper>

              {!!this.props.pack &&
                // @ts-expect-error
                !this.props.pack.template_instance &&
                !this.props.loadingMassExtension && (
                  <div className={classes.addExtensionContainer}>
                    <Button
                      color="primary"
                      onClick={this.handleOpenMassExtensionDialog}
                      variant="outlined"
                    >
                      {this.props.t('paymentPack:massExtension.title')}
                    </Button>
                  </div>
                )}

              <div className={classes.massExtensionContainer}>
                {!!(
                  this.props.massExtension.items &&
                  !!this.props.massExtension.items.length
                ) && (
                  <React.Fragment>
                    <Typography className={classes.extensionTitle} variant="h5">
                      {this.props.t('paymentPack:section.massExtension')}
                    </Typography>
                    <PaymentPackMassExtensionList
                      firstLoadDone
                      itemPerPage={PAYMENT_PACK_MASS_EXTENSION_PAGINATION_SIZE}
                      // @ts-expect-error
                      items={this.props.massExtension.items}
                      loading={
                        this.props.massExtension.loading ||
                        this.props.massExtension.isDeleteLoading
                      }
                      nbItems={this.props.massExtension.count}
                      onDelete={this.onDeleteMassExtension}
                      onPageRequested={(page) => {
                        this.props.fetchPaymentPackMassExtensionList({
                          payment_pack: this.props.id,
                          page,
                        });
                      }}
                      page={this.props.massExtension.page}
                    />
                  </React.Fragment>
                )}
              </div>
            </Grid>

            <PaymentPackDeleteDialog
              consumerPackSummary={
                this.state.paymentPackToDeleteId ? (
                  <PaginatedConsumerPackList
                    consumerPacksUpdatingById={
                      this.props.consumerPacks.updatingById
                    }
                    decrementCredit={this.props.decrementCredit}
                    incrementCredit={this.props.incrementCredit}
                    itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
                    // @ts-expect-error
                    items={this.props.consumerPacks.items}
                    loading={this.props.consumerPacks.loading}
                    nbItems={this.props.consumerPacks.count}
                    onClick={(cpp: any) => {
                      this.props.goToConsumerPackDetail(cpp.member_id, cpp.id);
                    }}
                    onPageRequested={(page: number, pageSize: number) =>
                      this.props.fetchConsumerPacksList(page, pageSize)
                    }
                    page={this.props.consumerPacks.page}
                    // @ts-expect-error
                    paymentPack={this.props.pack}
                  />
                ) : null
              }
              isUsedInCombo={
                this.props.archivationWarning[this.state.paymentPackToDeleteId]
                  ?.used_in_combo || false
              }
              onCancel={this.cancelDelete}
              onDelete={() =>
                this.deletePaymentPack(this.state.paymentPackToDeleteId)
              }
              open={!!this.state.paymentPackToDeleteId}
              // @ts-expect-error
              pack={this.props.pack}
            />
            <MassExtensionCreateDialog
              isLoading={this.props.massExtension.isCreateLoading}
              onClose={() => this.props.setOpenMassExtensionDialog(false)}
              onSubmit={this.createMassExtension}
              open={this.props.openMassExtensionDialog}
            />
            <PaymentPackFormDrawer
              allowGuestMaster={
                this.props.theme?.allow_guest &&
                this.props.theme?.allow_guest_activatable
              }
              availableEstablishmentList={availableEstablishmentList}
              categoryList={availableSCTs}
              clearPaymentPackToEdit={() =>
                this.setState({ paymentPackToEdit: null })
              }
              closeForm={this.closePaymentPackFormDrawer}
              compatibleServicePass={this.props.compatibleServicePass}
              displayNewCheckoutFlow={
                this.props.theme.display_new_checkout_flow
              }
              initial={{
                ...this.state.paymentPackToEdit,
                establishments:
                  this.state.paymentPackToEdit?.establishments?.map(
                    // @ts-expect-error
                    (establishment) => establishment.id,
                  ) ?? [],
                metaActivities:
                  this.state.paymentPackToEdit?.metaActivities?.map(
                    // @ts-expect-error
                    (metaActivitie) => metaActivitie?.id,
                  ) ?? [],
                blacklist_tags:
                  this.state.paymentPackToEdit?.blacklist_tags?.map(
                    // @ts-expect-error
                    (tag) => tag.id,
                  ) ?? [],
                whitelist_tags:
                  this.state.paymentPackToEdit?.whitelist_tags?.map(
                    // @ts-expect-error
                    (tag) => tag.id,
                  ) ?? [],
              }}
              metaActivityList={[...metaActivities]}
              // @ts-expect-error
              onSubmit={this.props.createOrUpdatePaymentPack}
              open={this.props.openPaymentPackFormDialog}
              paymentPackCategories={paymentPackCategories}
              // @ts-expect-error
              privateServices={this.props.privateServices}
              provincialTax={this.props.theme?.provincial_tax_value}
              // @ts-expect-error
              tagList={allTagsWithTagGroup ? [...allTagsWithTagGroup] : []}
            />
          </Grid>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

const styles = (theme: Theme) => ({
  extensionTitle: {
    marginBottom: theme.spacing(1),
  },
  emptyContainer: {
    padding: theme.spacing(2),
  },
  spacerVertical: {
    height: theme.spacing(2),
  },
  massExtensionContainer: {
    paddingTop: theme.spacing(3),
  },
  addExtensionContainer: {
    paddingTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
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
      items: getPaymentPackMassExtensionList(state),
      count: state.paymentPack.massExtension.count,
      loading: state.paymentPack.massExtension.loading,
      page: state.paymentPack.massExtension.page,
      isCreateLoading: state.paymentPack.massExtension.create.loading,
      isDeleteLoading: state.paymentPack.massExtension.delete.loading,
    },
    loading: state.paymentPack.loading || state.establishment.loading,
    pack: withTags(
      // @ts-expect-error
      withSCT(
        // @ts-expect-error
        withMetaActivities(
          // @ts-expect-error
          withEstablishments(withLinkedPrivatePass(getPaymentPack)),
        ),
      ),
      // @ts-expect-error
    )(state, props.id),
    scaleCreditLoading: state.paymentPack.scaleCredit.loading,
    notifications: {
      items: getPaymentPackNotificationsByPackId(state, props.id),
      loading: state.marketingNotification.loading,
    },
    consumerPacks: {
      items: getConsumerPacksByPackWithMember(state),
      count: state.consumerPaymentPack.byPaymentPack.count,
      loading: state.consumerPaymentPack.byPaymentPack.loading,
      page: state.consumerPaymentPack.byPaymentPack.page,
      updatingById: state.consumerPaymentPack.updatingById,
    },
    email_templates_details: getEmailTemplatesDetail(state),
    emailSummariesById: getAllEmailTemplatesDict(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    smartListsById: getSmartListDict(state),
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

    SCTList: getEditableSCTs(state),
    tagCategories: getTagCategories(state),
    videoCategories: state.video.filterableParams.items.SCTs,
    companyId: state.theme.theme.company,
    archivationWarning: state.paymentPack.archivationWarning,
    privateServices: getPrivateServices(state),
    compatibleServicePass: getCompatibleServicePass(state),
    resolvedGenericTags: getResolvedGenericTags(state),
    isRollCallMandatory: state.theme.theme.is_roll_call_mandatory,
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountById: getBookkeepingAccountById(state),
  };
};

const mapLinkedPrivatePassStateToProps = (
  state: RootState,
  props: ConnectedProps,
) => {
  return {
    linkedPrivatePass: withAvailable(withServices(getPrivatePass))(
      state,
      // @ts-expect-error
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
    // @ts-expect-error
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
    options?: OptionCallback<
      ConsumerPaymentPackREST | ConsumerPaymentPackREST[]
    >,
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
  createPaymentPackMassExtension: createPaymentPackMassExtensionAction,
  fetchPaymentPackMassExtensionList: fetchPaymentPackMassExtensionListAction,
  deletePaymentPackMassExtension: deletePaymentPackMassExtensionAction,
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
  fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  updatePaymentPackCompatibilities: updatePaymentPackCompatibilitiesAction,
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
      // @ts-expect-error
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
    // @ts-expect-error
    if (props.pack && props.pack?.linked_private_pass?.id) {
      // @ts-expect-error
      props.fetchCompatibleServicePassList(props.pack.linked_private_pass.id, {
        onSuccess: (csps) => {
          // @ts-expect-error
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
  fetchAvailableBookkeepingAccountList:
    // @ts-expect-error


      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({ is_active: true }),
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
  withTranslation(['titles', 'paymentPack']),
  routerParamsToProps({ id: 'id:number' }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
  connect(mapLinkedPrivatePassStateToProps, null),
)(PaymentPackDetail);
