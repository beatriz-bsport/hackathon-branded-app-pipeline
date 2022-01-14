// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import memoize from 'memoize-one';
import { push as pushRouter } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import Fuse, { FuseOptions } from 'fuse.js';
import { Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import themeSelectors from '#libs/theme/selectors';
import withTitle from '#hocs/with-title.hoc';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import {
  getPrivatePassCustomerEnabled,
  getAvailablePrivatePasses,
  getUnavailablePrivatePasses,
  getCompatibilityPassWithService as getCompatibleServicePass,
  getCompatibleServicePassLoading,
} from '#libs/private-service/selectors/private-pass';
import { getPrivateServices } from '#libs/private-service/selectors/private-service';
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
} from '#libs/private-service/actions';
import PrivatePassListItem from '#libs/private-service/components/pass/PrivatePassListItem.component';
import PrivatePassForm from '#libs/private-service/components/pass/PrivatePassForm.component';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
  ServiceCompatibilityPass,
  PrivateSlot,
} from '#libs/private-service/types';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import FuzeSearch from '#components/FuzeSearch.component';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { PrivatePassCategoryList } from '#libs/private-service/components/category/PrivatePassCategoryList.component';
import PrivatePassCategoryCreationDialog from '#libs/private-service/components/category/PrivatePassCategoryCreationDialog.component';
import {
  getPrivatePassByCategoryWithPasses,
  getPrivatePassCategories,
} from '#libs/private-service/selectors/private-pass-category';
import PaymentPackFilterAndSortHeader, {
  ManagerOnly,
  SortOption,
} from '#libs/payment-packs/components/PaymentPackFilterAndSortHeader.component';
import {
  setPrivatePassCategoryFilter,
  setPrivatePassManagerOnlyFilter,
  setPrivatePassSort,
} from '#libs/user-preference/actions';
import { OptionCallback } from '../../state/types';
import { getFormInitial } from '#libs/private-service/utils';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type OwnProps = {
  setOpenDeleteCompatibility: (id: number) => void;
  openDeleteCompatibilityDialog: number;
};

type StateHandlerInit = {
  openCreateForm: boolean;
  openEditForm: boolean;
  openDeletePassDialog: number | null;
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedPrivatePass: PrivatePass | null;
  selectedCategory: PrivatePassCategory | null;
  compatibleServicePassOfSelectedPass: ServiceCompatibilityPass | null;
  compatibilityLoading: boolean;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type OwnAndConnectedProps = OwnProps &
  ConnectedProps &
  StateHandlerType &
  WithSegmentAnalyticsFormTrackerHandlers;

type Props = OwnProps &
  ConnectedProps &
  StateHandlerType &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers> &
  WithSegmentAnalyticsFormTrackerHandlers;

type State = {
  searchText: string;
  searchResult: Array<PrivatePass>;
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
      searchText: '',
      searchResult: [],
      selectedCategories: this.props.userPreferenceSelectedCategories,
      selectedDisponibility: this.props.userPreferenceSelectedDisponibility,
      selectedSortOption: this.props.userPreferenceSortOption,
      privatePassOrderByCategory: null,
    };
  }

  componentDidMount() {
    this.props.fetchPrivatePassList();
    this.props.fetchAllPrivateServices();
    this.props.fetchAllPrivatePassCategory();
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
    }
  }

  onShowDisabled = () => {
    this.props.setShowDisabled(!this.props.showDisabled);
  };

  restorePrivatePass = async (id: number) => {
    if (this.props.disabledPrivatePassList.length === 1) {
      this.props.setShowDisabled(false);
    }
    this.props.restorePrivatePass(id);
  };

  changeSearch =
    (fuse: Fuse<PrivatePass, FuseOptions<PrivatePass>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      this.setState({
        searchText: ev.target.value,
        searchResult: fuse.search(ev.target.value),
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
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

  render() {
    const { classes, t } = this.props;

    if (
      (this.props.privatePassList || []).length +
        (this.props.disabledPrivatePassList || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <div>
          <IsEmptyList
            text={this.props.t('noPrivatePass')}
            button={this.props.t('privatePass.list.createButton')}
            onCreate={() => this.props.setOpenCreateForm(true)}
            onCreateLabel={this.props.t('privatePass.list.createButton')}
          />
          <GenericResponsiveDrawer
            open={this.props.openCreateForm}
            onClose={() => this.props.closePrivatePassForm()}
          >
            <Typography variant="h4" className={classes.formTitle}>
              {this.props.t('privatePass.form.title')}
            </Typography>
            <PrivatePassForm
              privatePassCategories={this.props.privatePassCategories}
              onSubmit={this.props.createOrUpdatePrivatePass}
              onCancel={() => this.props.closePrivatePassForm()}
              compatibleServicePass={this.props.compatibleServicePass}
              privateServices={this.props.privateServices}
            />
          </GenericResponsiveDrawer>
        </div>
      );
    }
    return (
      <div>
        {!!this.props.loading && <BackofficeLinearProgress />}
        <div className={classes.search}>
          <FuzeSearch
            searchText={this.state.searchText}
            clearSearch={this.clearSearch}
            changeSearch={this.changeSearch}
            items={this.props.privatePassListCustomerEnabled}
            placeholder={t('searshAppointmentPass')}
            searchFields={['name']}
            searchResult={this.state.searchResult}
          />
          <Paper
            className={
              this.state.searchResult.length > 0 && this.state.searchText !== ''
                ? classes.searchPaperDisplayed
                : classes.searchPaperHidden
            }
          >
            <Collapse
              in={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
              }
            >
              <List disablePadding>
                {this.state.searchResult
                  .filter((pp) => !pp.manager_only)
                  .map((pass) => (
                    <PrivatePassListItem
                      pass={pass}
                      key={pass.id}
                      divider
                      onClick={() => {
                        this.props.goToPass(pass.id);
                      }}
                      onEdit={() => {
                        this.openFormAndUploadCompatibilityInfo(pass);
                      }}
                      onDelete={() =>
                        this.props.setOpenDeletePassDialog(pass.id)
                      }
                      updatePrivatePass={this.props.createOrUpdatePrivatePass}
                    />
                  ))}
              </List>
            </Collapse>
          </Paper>
        </div>
        <>
          <div className={classes.buttonRow}>
            <Button
              variant="outlined"
              onClick={() => {
                this.props.setShowCategoryDialog(true);
                this.props.formAdd && this.props.formAdd({});
              }}
              color="primary"
            >
              <AddIcon color="primary" />
              {t('paymentPack:category.add')}
            </Button>
          </div>
          <PaymentPackFilterAndSortHeader
            categoryOptions={this.categoryOptions()}
            categoryFilterOnchange={this.categoryFilterOnchange}
            categoryValue={this.state.selectedCategories}
            managerOnlyOnChange={this.managerOnlyOnChange}
            managerOnlyValue={this.state.selectedDisponibility}
            sortOnChange={this.sortOnChange}
            sortValue={this.state.selectedSortOption}
          />
          <div className={this.props.classes.leftPanel}>
            {!this.props.privatePassList.length && !this.props.loading && (
              <Typography variant="caption">
                {this.props.t('privatePass.list.isEmpty')}
              </Typography>
            )}
            <PrivatePassCategoryList
              privatePassOrder={this.state.privatePassOrderByCategory}
              filterManagerOnly={this.state.selectedDisponibility}
              filteredCategories={this.state.selectedCategories}
              privatePassCategoryById={this.props.privatePassByCategory}
              goToPass={this.props.goToPass}
              setOpenDeletePassDialog={this.props.setOpenDeletePassDialog}
              updatePassOrder={this.props.editOrderPrivatePass}
              onEditPass={(pass) => {
                this.openFormAndUploadCompatibilityInfo(pass);
              }}
              updateCategoryOrder={this.props.updatePrivatePassCategoryOrder}
              setSelectedCategory={this.props.setSelectedCategory}
              showCategoryEditDialog={() =>
                this.props.setShowCategoryDialog(true)
              }
              deletePrivatePassCategory={this.props.deletePrivatePassCategory}
            />
          </div>
          {this.props.disabledPrivatePassList?.length ? (
            <div className={classes.disbabledList}>
              <div className={classes.buttonTitle}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  {`${t('disabledPacksTitle')} (${
                    (this.props.disabledPrivatePassList || []).length
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
              <Collapse in={this.props.showDisabled}>
                {this.props.showDisabled && (
                  <List disablePadding>
                    {this.props.disabledPrivatePassList.map(
                      (pass: PrivatePass) => (
                        <PrivatePassListItem
                          pass={pass}
                          divider
                          onRestore={() => this.restorePrivatePass(pass.id)}
                          key={pass.id}
                          disabled
                        />
                      ),
                    )}
                  </List>
                )}
              </Collapse>
            </div>
          ) : null}
          <GenericResponsiveDrawer
            open={
              (this.props.openEditForm || this.props.openCreateForm) &&
              !this.props.compatibleServicePassLoading
            }
            onClose={() => this.props.closePrivatePassForm()}
          >
            <Typography variant="h4" className={classes.formTitle}>
              {this.props.t('privatePass.form.title')}
            </Typography>
            <PrivatePassForm
              privatePassCategories={this.props.privatePassCategories}
              onSubmit={this.props.createOrUpdatePrivatePass}
              onCancel={(ev: { stopPropagation: () => void }) => {
                ev.stopPropagation();
                this.props.closePrivatePassForm();
              }}
              privateServices={this.props.privateServices}
              initial={getFormInitial(
                this.props.selectedPrivatePass,
                this.props.compatibleServicePass,
              )}
              compatibleServicePass={this.props.compatibleServicePass}
            />
          </GenericResponsiveDrawer>
          <Dialog open={!!this.props.openDeletePassDialog}>
            <DialogTitle>
              {this.props.t('privatePass.delete.title')}
            </DialogTitle>
            <DialogContent>
              {this.props.t('privatePass.delete.explain')}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.setOpenDeletePassDialog(null)}>
                {this.props.t('privatePass.delete.cancel')}
              </Button>
              <Button
                onClick={() =>
                  this.props.deletePrivatePass(this.props.openDeletePassDialog)
                }
              >
                {this.props.t('privatePass.delete.submit')}
              </Button>
            </DialogActions>
          </Dialog>
          <Fab
            className={this.props.classes.addButton}
            variant="extended"
            color="primary"
            onClick={() => this.props.setOpenCreateForm(true)}
          >
            <AddIcon className={this.props.classes.leftIcon} />
            {this.props.t('privatePass.list.createButton')}
          </Fab>
        </>
        {this.props.showCategoryDialog && (
          <PrivatePassCategoryCreationDialog
            open={this.props.showCategoryDialog}
            handleClose={() => {
              this.props.closePrivatePassCategoryForm();
              this.props.formCancel &&
                this.props.formCancel(
                  this.props.selectedCategory
                    ? {
                        private_pass_category_id:
                          this.props.selectedCategory.id || null,
                      }
                    : {},
                );
            }}
            onSubmit={this.props.upsertPrivatePassCategory}
            privatePassCategorySelected={this.props.selectedCategory}
            trackIntent={() =>
              this.props.formSubmitIntent &&
              this.props.formSubmitIntent(
                this.props.selectedCategory
                  ? {
                      private_pass_category_id:
                        this.props.selectedCategory.id || null,
                    }
                  : {},
              )
            }
          />
        )}
      </div>
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
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
    boderBottom: '0px',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  buttonRow: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
  },
  formTitle: {
    fontWeight: 500,
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
});

const mapStateToProps = (state: RootState) => ({
  privatePassListCustomerEnabled: getPrivatePassCustomerEnabled(state),
  privatePassList: getAvailablePrivatePasses(state),
  disabledPrivatePassList: getUnavailablePrivatePasses(state),
  privatePassCategories: getPrivatePassCategories(state),
  privatePassByCategory: getPrivatePassByCategoryWithPasses(
    getAvailablePrivatePasses,
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
};

const withStateHandlersInit: StateHandlerInit = {
  openCreateForm: false,
  openEditForm: false,
  openDeletePassDialog: null,
  showDisabled: false,
  showCategoryDialog: false,
  selectedPrivatePass: null,
  selectedCategory: null,
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
    openDeletePassDialog: null,
    selectedPrivatePass: null,
  }),
  closePrivatePassCategoryForm: () => () => {
    return { showCategoryDialog: false, selectedCategory: null };
  },
};

const mapWithHandlers = {
  upsertPrivatePassCategory:
    (props: OwnAndConnectedProps) => (category: PrivatePassCategory) => {
      props.upsertPrivatePassCategoryAction(category, {
        onSuccess: () => {
          props.formSuccess &&
            props.formSuccess(
              category
                ? {
                    private_pass_category_id: category.id || null,
                  }
                : {},
            );
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
    props.deletePrivatePass(id);
    props.closePrivatePassForm();
  },
  createOrUpdatePrivatePass:
    (props: OwnAndConnectedProps) => (data: any, options?: OptionCallback) => {
      props.createOrUpdatePrivatePassAction(
        data,
        props.selectedPrivatePass?.id || null,
        {
          onSuccess: () => {
            if (options?.onSuccess) options.onSuccess();
            props.closePrivatePassForm();
          },
          onError: () => {
            if (options?.onError) options.onError();
          },
        },
      );
    },
  fetchCompatibleServicePasses: (props: OwnAndConnectedProps) => () => {
    if (props.selectedPrivatePass) {
      props.fetchCompatibleServicePassList(props.selectedPrivatePass.id, {
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
};

export default compose(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.PRIVATE_PASS_CATEGORY,
  }),
  routerParamsToProps({
    id: 'id:number',
  }),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('pageTitles.passList')),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibility',
    false,
  ),
  withHandlers(mapWithHandlers),
)(PrivatePassList);
