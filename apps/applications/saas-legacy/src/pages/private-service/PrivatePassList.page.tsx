import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import memoize from 'memoize-one';
import { push as pushRouter } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import { Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import uniqBy from 'lodash/uniqBy';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import withTitle from '#src/hocs/with-title.hoc';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import themeSelectors from '#src/libs/theme/selectors';

import {
  getPrivatePassCustomerEnabled,
  getAvailablePrivatePasses,
  getUnavailablePrivatePasses,
  getCompatibilityPassWithService as getCompatibleServicePass,
  getCompatibleServicePassLoading,
  withLinkedPaymentPack,
} from '#src/libs/private-service/selectors/private-pass';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAction,
  deletePrivatePass,
  restorePrivatePass,
  editOrderPrivatePass,
  fetchAllPrivatePassCategory,
  upsertPrivatePassCategory as upsertPrivatePassCategoryAction,
  updatePrivatePassCategoryOrder,
  deletePrivatePassCategory,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  fetchAllPrivateSlots,
  isPrivatePassUsedInCombo,
} from '#src/libs/private-service/actions';
import PrivatePassListItem from '#src/libs/private-service/components/pass/PrivatePassListItem.component';
import PrivatePassForm, {
  PrivatePassFormValues as FormikValues,
} from '#src/libs/private-service/components/pass/private-pass-form/PrivatePassForm.component';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
  ServiceCompatibilityPass,
  PrivateSlot,
} from '#src/libs/private-service/types';

import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import { PrivatePassCategoryList } from '#src/libs/private-service/components/category/PrivatePassCategoryList.component';
import PrivatePassCategoryCreationDialog from '#src/libs/private-service/components/category/PrivatePassCategoryCreationDialog.component';
import {
  getPrivatePassByCategoryWithPasses,
  getPrivatePassCategories,
} from '#src/libs/private-service/selectors/private-pass-category';
import PaymentPackFilterAndSortHeader, {
  ManagerOnly,
  SortOption,
} from '#src/libs/payment-packs/components/PaymentPackFilterAndSortHeader.component';
import {
  setPrivatePassCategoryFilter,
  setPrivatePassManagerOnlyFilter,
  setPrivatePassSort,
} from '#src/libs/user-preference/actions';
import { getFormInitial } from '#src/libs/private-service/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { fetchOne as fetchPaymentPackAction } from '#src/libs/payment-packs/actions';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { getAllEstablishments } from '#src/libs/establishment/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#src/libs/meta-activity/selectors';
import PrivatePassDeleteDialog from '#src/libs/private-service/components/pass/PrivatePassDeleteDialog.component';
import UniversalPassRestoreDialog from '#src/libs/universal-pass/components/UniversalPassRestoreDialog.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { fetchTags } from '#src/libs/tag/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';

import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import {
  fetchActivitiesCompany,
  fetchMetaActivities as fetchMetaActivitiesAction,
} from '../../libs/meta-activity/actions';
import {
  fetchMarketingNotificationList,
  updateMarketingNotification,
} from '#src/libs/marketing/actions';
import {
  emailTemplateDetail,
  fetchEmailTemplateSummariesBulk,
} from '#src/libs/email-editor/actions';
import { fetchSmartListBulk } from '#src/libs/smart-list/actions';
import { fetchResolvedGenericTags } from '#src/libs/notification-rule/actions';
import { getSmartListDict } from '#src/libs/smart-list/selectors';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';
import {
  getAllEmailTemplatesDict,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import { getPrivatePassNotifications } from '#src/libs/marketing/selectors';
import type { MarketingNotification } from '#src/libs/marketing/types';
import { OptionCallback } from '#src/state/types';
import { fetchEstablishments } from '#src/libs/establishment/actions';
import {
  type FeatureFlagProps,
  withFeatureFlags,
} from '#src/utils/feature-flag/withFeatureFlags';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PrivatePassCategory,
);

type OwnProps = {
  setOpenDeleteCompatibility: (id: number) => void;
  openDeleteCompatibilityDialog: number;
  archivationWarning: { [id: number]: { use_in_combo: boolean } };
};

type PrivatePassOption = {
  label: string;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
  pass: PrivatePass;
  updatePrivatePass: (data: any, options?: OptionCallback) => void;
  value: number;
};

const searchBarAdditionalParams = {
  available: true,
  manager_only: false,
};

const Option: React.FC<OptionPropsWithData<PrivatePassOption>> = (props) => (
  <PrivatePassListItem divider {...props.data} />
);

type StateHandlerInit = {
  openCreateForm: boolean;
  openEditForm: boolean;
  openDeletePassDialog: number | null;
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedPrivatePass: PrivatePass<PaymentPack> | null;
  selectedCategory: PrivatePassCategory | null;
  compatibleServicePassOfSelectedPass: ServiceCompatibilityPass | null;
  compatibilityLoading: boolean;
  openRestoreUniversalPassDialog: boolean;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type OwnAndConnectedProps = OwnProps &
  ConnectedProps &
  StateHandlerType &
  WithObjectSearch &
  FeatureFlagProps;

type Props = OwnAndConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  selectedCategories: Array<number>;
  selectedDisponibility: ManagerOnly;
  selectedSortOption: SortOption;
  privatePassOrderByCategory: Array<{
    id: number;
    ordering_in_category: number;
  }> | null;
};
export class PrivatePassList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCategories: this.props.userPreferenceSelectedCategories,
      selectedDisponibility: this.props.userPreferenceSelectedDisponibility,
      selectedSortOption: this.props.userPreferenceSortOption,
      privatePassOrderByCategory: null,
    };
  }

  componentDidMount() {
    this.props.fetchPrivatePassList({
      ...(this.props.shouldDisplayNewSubscriptionContracts && {
        from_subscription: false,
      }),
    });
    this.props.fetchAllPrivateServices();
    this.props.fetchAllPrivatePassCategory();

    this.props.fetchEstablishments();
    this.props.fetchActivitiesCompany(this.props.theme.company, {
      customer_enabled: true,
    });
    this.props.fetchMetaActivities();
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
    this.props.fetchNotificationsAndTemplatesAndSmartLists();
    this.props.fetchResolvedGenericTags();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (prevState.selectedSortOption !== this.state.selectedSortOption)
      this.updateSortOption(this.state.selectedSortOption);
    if (prevState.selectedCategories !== this.state.selectedCategories)
      this.props.setPrivatePassCategoryFilter(this.state.selectedCategories);
    if (prevState.selectedDisponibility !== this.state.selectedDisponibility)
      this.props.setPrivatePassManagerOnlyFilter(
        this.state.selectedDisponibility,
      );
    if (
      prevProps.privatePassByCategory.length !==
      this.props.privatePassByCategory.length
    )
      this.categoryOptions.apply({}, []);
    if (
      prevProps.selectedPrivatePass?.id !== this.props.selectedPrivatePass?.id
    ) {
      this.props.fetchCompatibleServicePasses();
      if (this.props.selectedPrivatePass?.linked_payment_pack?.id) {
        this.props.fetchPaymentPack(
          this.props.selectedPrivatePass.linked_payment_pack.id,
        );
      }
    }
  }

  onShowDisabled = () => {
    this.props.setShowDisabled(!this.props.showDisabled);
  };

  restorePrivatePass = async (id: number) => {
    if (this.props.disabledPrivatePassList.length === 1) {
      this.props.setShowDisabled(false);
    }
    const restorePrivatePassIsUniversal =
      !!this.props.disabledPrivatePassList?.find(
        (private_pass: PrivatePass) => private_pass.id === id,
      )?.linked_payment_pack;

    this.props.restorePrivatePass(id, {
      onSuccess: () => {
        if (restorePrivatePassIsUniversal) {
          this.props.setOpenRestoreUniversalPassdialog(true);
        }
      },
    });
  };

  categoryOptions = memoize(() => [
    ...this.props.privatePassByCategory.map((cat) => {
      return {
        value: cat.id || -1,
        label: cat.name || this.props.t('paymentPack:noCategory.name'),
      };
    }),
  ]);

  updateOrderBySortOption(
    sortFunction: (pp1: PrivatePass, pp2: PrivatePass) => number,
  ) {
    const toUpdate: Array<{
      id: number;
      ordering_in_category: number;
    }> | null = [];
    this.props.privatePassByCategory.forEach(
      // @ts-expect-error
      (category: PrivatePassCategoryWithPasses) => {
        const sorted = [...category.passes].sort((pp1, pp2) =>
          sortFunction(pp1, pp2),
        );
        toUpdate.push(
          ...sorted
            .map((pp, index) => {
              return pp.ordering_in_category !== index
                ? {
                    id: pp.id,
                    ordering_in_category: index,
                  }
                : null;
            })
            .filter((data) => data),
        );
      },
    );
    this.setState({ privatePassOrderByCategory: toUpdate });
  }

  updateSortOption(option: SortOption) {
    this.props.setPrivatePassSort(option);
    switch (option) {
      case SortOption.ascendingPrice:
        return this.updateOrderBySortOption(
          (pp1, pp2) => pp1.price - pp2.price,
        );
      case SortOption.descendingPrice:
        return this.updateOrderBySortOption(
          (pp1, pp2) => pp2.price - pp1.price,
        );
      case SortOption.ascendingCredit:
        return this.updateOrderBySortOption((pp1, pp2) => {
          if (pp1.credits !== 0 && !pp1.credits) return 1;
          if (pp2.credits !== 0 && !pp2.credits) return -1;
          return pp1.credits - pp2.credits;
        });
      case SortOption.descendingCredit:
        return this.updateOrderBySortOption((pp1, pp2) => {
          if (pp2.credits !== 0 && !pp2.credits) return 1;
          if (pp1.credits !== 0 && !pp1.credits) return -1;
          return pp2.credits - pp1.credits;
        });
      default:
        return this.setState({ privatePassOrderByCategory: null });
    }
  }

  categoryFilterOnchange = (categories: Array<number>) => {
    this.setState({
      selectedCategories: categories,
    });
  };

  managerOnlyOnChange = (value: number) =>
    this.setState({
      selectedDisponibility: value,
    });

  sortOnChange = (sortOpt: number) => {
    this.setState({
      selectedSortOption: sortOpt,
    });
  };

  openFormAndUploadCompatibilityInfo = (pass: PrivatePass) => {
    this.props.setSelectedPrivatePass(pass);
    this.props.setOpenEditForm(true);
  };

  openDeletePassDialog = (passId: number) => {
    this.props.isPrivatePassUsedInCombo(passId);
    this.props.setOpenDeletePassDialog(passId);
  };

  OpenEditForm = (privatePass: PrivatePass) =>
    this.openFormAndUploadCompatibilityInfo(privatePass);

  getOpenEditFormHandler = (privatePass: PrivatePass) => () =>
    this.openFormAndUploadCompatibilityInfo(privatePass);

  getRestorePrivatePassHandler = (pass: PrivatePass) => () =>
    this.restorePrivatePass(pass.id);

  getDeletePassHandler = (pass: PrivatePass) => () =>
    this.openDeletePassDialog(pass.id);

  privatePassesOptionsFormatter =
    (hasDeletePermission: boolean, hasEditPermission: boolean) =>
    (privatePasses: PrivatePass[]): PrivatePassOption[] =>
      privatePasses.map((privatePass) => {
        return {
          label: privatePass.name,
          onClick: () => this.props.goToPass(privatePass.id),
          onDelete:
            hasDeletePermission && this.getDeletePassHandler(privatePass),
          onEdit: hasEditPermission && this.getOpenEditFormHandler(privatePass),
          pass: privatePass,
          updatePrivatePass: this.createOrUpdatePrivatePassWithNotifications,
          value: privatePass.id,
        };
      });

  removePassFromNotification = (
    notification: MarketingNotification,
    passId: number,
  ) => {
    this.props.updateMarketingNotification(notification.id, {
      ...notification,
      event_rules: {
        ...notification.event_rules,
        private_pass_ids: notification.event_rules.private_pass_ids.filter(
          (id) => id !== passId,
        ),

        // :TODO: Remove this line when the related backend migration (BS-3934) is done
        private_pass_id: undefined,
      },
    });
  };

  addPassToNotification = (
    notification: MarketingNotification,
    passId: number,
  ) => {
    this.props.updateMarketingNotification(notification.id, {
      ...notification,
      event_rules: {
        ...notification.event_rules,
        private_pass_ids: [
          ...notification.event_rules.private_pass_ids,
          passId,
        ],

        // :TODO: Remove this line when the related backend migration (BS-3934) is done
        private_pass_id: undefined,
      },
    });
  };

  createOrUpdatePrivatePassWithNotifications = (
    data: FormikValues,
    options?: OptionCallback,
  ) => {
    const { addToNotifications, removeFromNotifications, ...rest } = data;
    this.props.createOrUpdatePrivatePassAction(
      rest,
      this.props.selectedPrivatePass?.id || null,
      {
        // @ts-expect-error
        onSuccess: (res: PrivatePass) => {
          this.props.selectedPrivatePass?.id &&
            this.props.refreshOptions('private_pass', {
              ...searchBarAdditionalParams,
              ...(this.props.shouldDisplayNewSubscriptionContracts && {
                from_subscription: false,
              }),
            });
          if (options?.onSuccess) options.onSuccess();
          this.props.closePrivatePassForm();
          addToNotifications?.forEach((n) =>
            this.addPassToNotification(n, res.id),
          );
          removeFromNotifications?.forEach((n) =>
            this.removePassFromNotification(n, res.id),
          );
        },
        onError: () => {
          if (options?.onError) options.onError();
        },
      },
    );
  };

  render() {
    const { classes, t, establishmentList, metaActivities, categoryList } =
      this.props;
    const paymentPackCategoryList = [...categoryList]
      .filter(
        (category) =>
          metaActivities.map((a) => a.SCT).indexOf(category.id) !== -1,
      )
      .concat(this.props.videoCategories)
      .filter(
        (value, index, arr) =>
          arr.findIndex((sct) => sct.id === value.id) === index,
      );

    // @ts-expect-error
    const passSelectedForDelete = this.props.privatePassList.find(
      (private_pass: PrivatePass) =>
        private_pass.id === this.props.openDeletePassDialog,
    );
    if (
      // @ts-expect-error
      (this.props.privatePassList ?? []).length +
        (this.props.disabledPrivatePassList ?? []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <div>
          <IsEmptyList
            button={this.props.t('privatePass.list.createButton')}
            onCreate={() => this.props.setOpenCreateForm(true)}
            onCreateLabel={this.props.t('privatePass.list.createButton')}
            text={this.props.t('noPrivatePass')}
          />
          <GenericResponsiveDrawer
            onClose={() => this.props.closePrivatePassForm()}
            open={this.props.openCreateForm}
            title={this.props.t('privatePass.form.title')}
            trackingObjectIdentifier={
              SegmentAnalyticsFormObjectIdentifier.PrivatePass
            }
          >
            <PrivatePassForm
              enableNotificationStep
              bookkeepingAccountById={this.props.bookingAccountById}
              bookkeepingAccounts={this.props.bookingAccounts}
              categoryList={paymentPackCategoryList}
              compatibleServicePass={this.props.compatibleServicePass}
              emailDetailLoading={this.props.emailDetailLoading}
              emailDetails={this.props.emailDetails}
              emailSummariesById={this.props.emailSummariesById}
              // @ts-expect-error
              establishmentList={establishmentList}
              getEmailDetail={this.props.fetchEmailTemplateDetail}
              metaActivityList={metaActivities}
              notifications={this.props.notifications}
              onCancel={() => this.props.closePrivatePassForm()}
              onSubmit={this.createOrUpdatePrivatePassWithNotifications}
              privatePassCategories={this.props.privatePassCategories}
              // @ts-expect-error
              privateServices={this.props.privateServices}
              resolvedGenericTags={this.props.resolvedGenericTags}
              smartListLoading={this.props.smartListLoading}
              smartListsById={this.props.smartListsById}
              // @ts-expect-error
              tagList={this.props.allTagsWithTagGroup}
              theme={this.props.theme}
            />
          </GenericResponsiveDrawer>
        </div>
      );
    }
    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.privatePass.allowed_actions.create',
          'product.privatePass.allowed_actions.edit',
          'product.privatePass.allowed_actions.delete',
        ]}
      >
        {([
          hasCreatePermission,
          hasEditPermission,
          hasDeletePermission,
        ]: boolean[]) => (
          <div>
            {!!this.props.loading && <BackofficeLinearProgress />}
            <div className={classes.search}>
              <div className={classes.buttonRow}>
                <div style={{ flex: 1 }}>
                  <ObjectSearchComponent
                    additionalParams={{
                      ...searchBarAdditionalParams,
                      ...(this.props.shouldDisplayNewSubscriptionContracts && {
                        from_subscription: false,
                      }),
                    }}
                    components={{
                      Option,
                    }}
                    optionsFormatter={this.privatePassesOptionsFormatter(
                      hasDeletePermission,
                      hasEditPermission,
                    )}
                    placeholder={this.props.t('search')}
                    searchedObjectType="private_pass"
                    variant="underlined"
                  />
                </div>
                {hasCreatePermission && (
                  <Button
                    color="primary"
                    onClick={() => {
                      this.props.setShowCategoryDialog(true);
                      trackFormAdd();
                    }}
                    variant="outlined"
                  >
                    <AddIcon color="primary" />
                    {t('paymentPack:category.add')}
                  </Button>
                )}
              </div>
            </div>
            <PaymentPackFilterAndSortHeader
              categoryFilterOnchange={this.categoryFilterOnchange}
              // @ts-expect-error
              categoryOptions={this.categoryOptions()}
              categoryValue={this.state.selectedCategories}
              managerOnlyOnChange={this.managerOnlyOnChange}
              managerOnlyValue={this.state.selectedDisponibility}
              sortOnChange={this.sortOnChange}
              sortValue={this.state.selectedSortOption}
            />
            <div className={this.props.classes.leftPanel}>
              {/* @ts-expect-error */}
              {!this.props.privatePassList.length && !this.props.loading && (
                <Typography variant="caption">
                  {this.props.t('privatePass.list.isEmpty')}
                </Typography>
              )}
              <PrivatePassCategoryList
                deletePrivatePassCategory={this.props.deletePrivatePassCategory}
                filteredCategories={this.state.selectedCategories}
                filterManagerOnly={this.state.selectedDisponibility}
                goToPass={this.props.goToPass}
                itemsDraggable={hasEditPermission}
                onEditPass={hasEditPermission && this.OpenEditForm}
                // @ts-expect-error
                privatePassCategoryById={this.props.privatePassByCategory}
                privatePassOrder={this.state.privatePassOrderByCategory}
                setOpenDeletePassDialog={
                  hasDeletePermission && this.openDeletePassDialog
                }
                setSelectedCategory={this.props.setSelectedCategory}
                showCategoryEditDialog={() =>
                  this.props.setShowCategoryDialog(true)
                }
                updateCategoryOrder={this.props.updatePrivatePassCategoryOrder}
                updatePassOrder={this.props.editOrderPrivatePass}
              />
            </div>
            {this.props.disabledPrivatePassList?.length ? (
              <div className={classes.disbabledList}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.sectionTitle} variant="h5">
                    {`${t('disabledPacksTitle')} (${
                      (this.props.disabledPrivatePassList ?? []).length
                    })`}
                  </Typography>

                  <IconButton onClick={this.onShowDisabled}>
                    {this.props.showDisabled ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </div>
                <Divider className={classes.divider} />
                <Collapse
                  unmountOnExit
                  className={classes.collapse}
                  in={this.props.showDisabled}
                >
                  <List disablePadding>
                    {this.props.disabledPrivatePassList.map(
                      (pass: PrivatePass) => (
                        <PrivatePassListItem
                          key={pass.id}
                          // @ts-expect-error
                          disabled
                          divider
                          onRestore={
                            hasEditPermission &&
                            this.getRestorePrivatePassHandler(pass)
                          }
                          pass={pass}
                        />
                      ),
                    )}
                  </List>
                </Collapse>
              </div>
            ) : null}
            <GenericResponsiveDrawer
              onClose={() => this.props.closePrivatePassForm()}
              open={
                (this.props.openEditForm || this.props.openCreateForm) &&
                !this.props.compatibleServicePassLoading
              }
              subtitle={this.props.selectedPrivatePass?.name}
              title={this.props.t('privatePass.form.title')}
              trackingObjectId={this.props.selectedPrivatePass?.id}
              trackingObjectIdentifier={
                SegmentAnalyticsFormObjectIdentifier.PrivatePass
              }
            >
              <PrivatePassForm
                enableNotificationStep
                bookkeepingAccountById={this.props.bookingAccountById}
                bookkeepingAccounts={this.props.bookingAccounts}
                categoryList={paymentPackCategoryList}
                compatibleServicePass={this.props.compatibleServicePass}
                emailDetailLoading={this.props.emailDetailLoading}
                emailDetails={this.props.emailDetails}
                emailSummariesById={this.props.emailSummariesById}
                // @ts-expect-error
                establishmentList={establishmentList}
                getEmailDetail={this.props.fetchEmailTemplateDetail}
                // @ts-expect-error
                initial={getFormInitial(
                  // @ts-expect-error
                  this.props.selectedPrivatePass,
                  this.props.compatibleServicePass,
                )}
                metaActivityList={metaActivities}
                notifications={this.props.notifications}
                onCancel={(ev: { stopPropagation: () => void }) => {
                  ev.stopPropagation();
                  this.props.closePrivatePassForm();
                }}
                onSubmit={this.createOrUpdatePrivatePassWithNotifications}
                privatePassCategories={this.props.privatePassCategories}
                // @ts-expect-error
                privateServices={this.props.privateServices}
                provincialTax={this.props.theme?.provincial_tax_value}
                resolvedGenericTags={this.props.resolvedGenericTags}
                smartListLoading={this.props.smartListLoading}
                smartListsById={this.props.smartListsById}
                // @ts-expect-error
                tagList={this.props.allTagsWithTagGroup}
                theme={this.props.theme}
              />
            </GenericResponsiveDrawer>
            <PrivatePassDeleteDialog
              onCancel={() => this.props.setOpenDeletePassDialog(null)}
              onConfirm={() =>
                this.props.deletePrivatePass(this.props.openDeletePassDialog)
              }
              open={!!this.props.openDeletePassDialog}
              pass={passSelectedForDelete}
              usedInCombo={
                this.props.archivationWarning[this.props.openDeletePassDialog]
                  ?.used_in_combo
              }
            />

            {hasCreatePermission && (
              <Fab
                className={this.props.classes.addButton}
                color="primary"
                onClick={() => this.props.setOpenCreateForm(true)}
                variant="extended"
              >
                <AddIcon className={this.props.classes.leftIcon} />
                {this.props.t('privatePass.list.createButton')}
              </Fab>
            )}
            {this.props.showCategoryDialog && (
              <PrivatePassCategoryCreationDialog
                handleClose={() => {
                  this.props.closePrivatePassCategoryForm();
                  trackFormCancel(this.props.selectedCategory?.id);
                }}
                onSubmit={this.props.upsertPrivatePassCategory}
                open={this.props.showCategoryDialog}
                privatePassCategorySelected={this.props.selectedCategory}
                trackIntent={() =>
                  trackFormSubmitIntent(this.props.selectedCategory?.id)
                }
              />
            )}
            {this.props.openRestoreUniversalPassDialog && (
              <UniversalPassRestoreDialog
                open
                onConfirm={() =>
                  this.props.setOpenRestoreUniversalPassdialog(false)
                }
              />
            )}
          </div>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

const styles = (theme: Theme): any => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  disbabledList: {
    paddingBottom: theme.spacing(16),
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  leftPanel: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(2),
    },
  },
  buttonTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  search: { marginBottom: theme.spacing(2) },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: '0px',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  searchPaperHidden: {
    border: '1px solid',
    borderTop: '0px',
    borderBottom: '0px',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  buttonRow: {
    display: 'flex',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  buttonAdd: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  collapse: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  formTitle: {
    fontWeight: 500,
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
});

const mapStateToProps = (state: RootState) => ({
  privatePassListCustomerEnabled: withLinkedPaymentPack(
    // @ts-expect-error
    getPrivatePassCustomerEnabled,
  )(state),
  // @ts-expect-error
  privatePassList: withLinkedPaymentPack(getAvailablePrivatePasses)(state),
  disabledPrivatePassList: getUnavailablePrivatePasses(state),
  privatePassCategories: getPrivatePassCategories(state),
  privatePassByCategory: getPrivatePassByCategoryWithPasses(
    // @ts-expect-error
    withLinkedPaymentPack(getAvailablePrivatePasses),
  )(state),
  loading: state.privateService.privatePass.loading,
  theme: themeSelectors.getTheme(state),
  userPreferenceSortOption: state.userPreference.privatePassSort,
  userPreferenceSelectedCategories:
    state.userPreference.privatePassCategoryFilter,
  userPreferenceSelectedDisponibility:
    state.userPreference.privatePassManagerOnlyFilter,
  privateServices: getPrivateServices(state),
  compatibleServicePass: getCompatibleServicePass(state),
  compatibleServicePassLoading: getCompatibleServicePassLoading(state),
  archivationWarning: state.privateService.privatePass.archivationWarning,
  categoryList: getEditableSCTs(state),
  establishmentList: getAllEstablishments(state),
  metaActivities: uniqBy(
    [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
      ...getActivitiesByIdList(state, []),
    ],
    'id',
  ),
  allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  videoCategories: state.video.filterableParams.items.SCTs,
  bookingAccounts: getBookkeepingAccountList(state),
  bookingAccountById: getBookkeepingAccountById(state),
  notifications: getPrivatePassNotifications(state),
  smartListsById: getSmartListDict(state),
  smartListLoading: state.smartList.loading,
  resolvedGenericTags: getResolvedGenericTags(state),
  emailDetails: getEmailTemplatesDetail(state),
  emailDetailLoading: state.emailTemplate.detail.loading,
  emailSummariesById: getAllEmailTemplatesDict(state),
});

const mapDispatchToProps = {
  fetchPrivatePassList,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  goToPass: (id: number) => pushRouter(`/private-service/pass/${id}`),
  createOrUpdatePrivatePassAction,
  deletePrivatePass,
  restorePrivatePass,
  editOrderPrivatePass,
  fetchAllPrivatePassCategory,
  upsertPrivatePassCategoryAction,
  updatePrivatePassCategoryOrder,
  deletePrivatePassCategory,
  setPrivatePassCategoryFilter,
  setPrivatePassManagerOnlyFilter,
  setPrivatePassSort,
  fetchPrivateSlotsByService: fetchAllPrivateSlots,
  fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
  isPrivatePassUsedInCombo,
  fetchPaymentPack: fetchPaymentPackAction,
  fetchEstablishments,
  fetchActivitiesCompany,
  fetchMetaActivities: fetchMetaActivitiesAction,
  fetchTags,
  fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  fetchMarketingNotificationList,
  fetchEmailTemplateSummariesBulk,
  fetchSmartListBulk,
  fetchResolvedGenericTags,
  fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
  updateMarketingNotification,
};

// @ts-expect-error
const withStateHandlersInit: StateHandlerInit = {
  openCreateForm: false,
  openEditForm: false,
  openDeletePassDialog: null,
  showDisabled: false,
  showCategoryDialog: false,
  selectedPrivatePass: null,
  selectedCategory: null,
  openRestoreUniversalPassDialog: false,
};

const withStateHandlersSetter = {
  setOpenCreateForm: () => (openCreateForm: boolean) => {
    return { openCreateForm };
  },
  setOpenEditForm: () => (openEditForm: boolean) => {
    return { openEditForm };
  },
  setOpenDeletePassDialog: () => (openDeletePassDialog: number | null) => {
    return { openDeletePassDialog };
  },
  setShowDisabled: () => (showDisabled: boolean) => {
    return { showDisabled };
  },
  setShowCategoryDialog: () => (showCategoryDialog: boolean) => {
    return { showCategoryDialog };
  },
  setSelectedPrivatePass: () => (selectedPrivatePass: PrivatePass | null) => {
    return { selectedPrivatePass };
  },
  setSelectedCategory: () => (selectedCategory: PrivatePassCategory | null) => {
    return { selectedCategory };
  },
  closePrivatePassForm: () => () => ({
    openCreateForm: false,
    openEditForm: false,
    // @ts-expect-error
    openDeletePassDialog: null,
    // @ts-expect-error
    selectedPrivatePass: null,
  }),
  closePrivatePassCategoryForm: () => () => {
    // @ts-expect-error
    return { showCategoryDialog: false, selectedCategory: null };
  },

  setOpenRestoreUniversalPassdialog:
    () => (openRestoreUniversalPassDialog: boolean) => {
      return { openRestoreUniversalPassDialog };
    },
};

const mapWithHandlers = {
  upsertPrivatePassCategory:
    (props: OwnAndConnectedProps) => (category: PrivatePassCategory) => {
      props.upsertPrivatePassCategoryAction(category, {
        onSuccess: () => {
          trackFormSuccess(category?.id);
          props.closePrivatePassCategoryForm();
          props.fetchAllPrivatePassCategory();
        },
      });
    },
  deletePrivatePassCategory:
    (props: OwnAndConnectedProps) =>
    (category: PrivatePassCategoryWithPasses) => {
      props.deletePrivatePassCategory(category, {
        onSuccess: () => {
          props.closePrivatePassCategoryForm();
          props.fetchPrivatePassList(
            category.passes.filter((p) => p?.id).map((p) => p.id),
          );
        },
      });
    },
  deletePrivatePass: (props: OwnAndConnectedProps) => (id: number) => {
    props.deletePrivatePass(id, {
      onSuccess: () => {
        props.refreshOptions('private_pass', {
          ...searchBarAdditionalParams,
          ...(!!props?.shouldDisplayNewSubscriptionContracts && {
            from_subscription: false,
          }),
        });
      },
    });
    props.closePrivatePassForm();
  },
  fetchCompatibleServicePasses: (props: OwnAndConnectedProps) => () => {
    if (props.selectedPrivatePass) {
      props.fetchCompatibleServicePassList(props.selectedPrivatePass.id, {
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
  fetchBookkeepingAccountList:
    // @ts-expect-error


      ({ fetchBookkeepingAccountList }) =>
      () => {
        fetchBookkeepingAccountList({ is_active: true });
      },
  fetchNotificationsAndTemplatesAndSmartLists:
    (props: OwnAndConnectedProps) => () => {
      props.fetchMarketingNotificationList(
        {
          kind__in: [
            NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
            NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
          ],
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
};

export default compose(
  routerParamsToProps({
    id: 'id:number',
  }),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('pageTitles.passList')),
  withStyles(styles),
  // @ts-expect-error
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibility',
    false,
  ),
  withObjectSearch,
  withFeatureFlags,
  withHandlers(mapWithHandlers),
)(PrivatePassList);
