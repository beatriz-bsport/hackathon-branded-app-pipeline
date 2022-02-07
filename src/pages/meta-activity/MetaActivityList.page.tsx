// @flow
import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { createStyles, Theme } from '@material-ui/styles';
import { TFunction } from 'i18next';
import FuzeSearch from '../../components/FuzeSearch.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import {
  getPageEnabledMetaActivities,
  getPageDisabledMetaActivities,
  getMetaActivityByCategoryWithActivities,
} from '../../libs/meta-activity/selectors';
import {
  deleteMetaActivity,
  restoreMetaActivity,
  fetchAllActivities as fetchAllMetactivitiesAction,
  makeActivityCopy as makeActivityCopyAction,
  fetchAllMetaActivityCategory,
  upsertMetaActivityCategory,
  deleteMetaActivityCategory,
  editOrderMetaActivity,
  updateMetaActivityCategoryOrder,
  fetchMetaActivityBulkAfterCategoryDelete,
} from '../../libs/meta-activity/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

import type { MetaActivity } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import { withBookingNotification } from '../../libs/marketing/selectors';
import { CategoryList } from '../../components/ordering/CategoryList.component';
import MetaActivityListItem from '#libs/meta-activity/components/MetaActivityListItem.component';
import { OptionCallback } from '../../state/types';
import {
  MetaActivityCategory,
  MetaActivityCategoryWithActivities,
} from '#libs/meta-activity/types';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
import AddCategoryButton from '#components/ordering/AddCategoryButton.component';
import CategoryCreationEditDialog from '#components/ordering/CategoryCreationEditDialog.component';

type OwnProps = {
  metaActivities: Array<MetaActivity>;
  disabledMetaActivities: Array<MetaActivity>;
  loading: boolean;
  notificationLoading: boolean;

  fetchAllMetactivities: () => void;
  goToDetail: (metaActivityId: number) => void;
  goToEdit: (metaActivityId: number) => void;
  onCreate: () => void;
  deleteMetaActivity: (metaActivityId: number) => void;
  restoreMetaActivity: (MetaActivityId: number) => void;
  setActivityToDelete: (id: number) => void;
  activityToDelete: (activity: number) => void;
  fetchMarketingNotificationList: (params: any) => void;

  goToPaymentPack: (id: number) => void;

  makeActivityCopy: (
    id: number,
    suffix: string,
    options?: OptionCallback,
  ) => void;

  metaActivityCategories: Array<MetaActivityCategoryWithActivities>;
  fetchAllMetaActivityCategory: (companyId?: number) => void;
  upsertMetaActivityCategory: (
    category: MetaActivityCategory,
    options?: OptionCallback,
  ) => void;
  deleteMetaActivityCategory: (
    category: MetaActivityCategoryWithActivities,
    options?: OptionCallback<MetaActivityCategoryWithActivities>,
  ) => void;
  editOrderMetaActivity: (
    data: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
  updateMetaActivityCategoryOrder: (
    data: Array<{ id: number; category_ordering: number }>,
    options?: OptionCallback,
  ) => void;
  categoryLoading: boolean;
  fetchMetaActivityBulkAfterCategoryDelete: (ids: Array<number>) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  searchText: string;
  searchResult: Array<MetaActivity>;
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedCategory: MetaActivityCategory;
};

const BOOKING_CREATION_NOTIFICATION = 2;

export class MetaActivityListPage extends React.Component<Props, State> {
  state: State = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
    showCategoryDialog: false,
    selectedCategory: null,
  };

  componentDidMount() {
    this.props.fetchAllMetactivities();
    this.props.fetchAllMetaActivityCategory();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind: BOOKING_CREATION_NOTIFICATION,
    });
  }

  changeSearch = (fuse: MetaActivity) => (ev: any) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  restoreMetaActivity = async (id: number) => {
    if (this.props.disabledMetaActivities.length === 1) {
      this.setState({ showDisabled: false });
    }
    this.props.restoreMetaActivity(id);
  };

  onEditCategory = (category: MetaActivityCategory) => {
    this.setState({ showCategoryDialog: true, selectedCategory: category });
  };

  onDeleteCategory = (category: MetaActivityCategoryWithActivities) => {
    this.props.deleteMetaActivityCategory(category, {
      onSuccess: () => {
        this.props.fetchMetaActivityBulkAfterCategoryDelete(
          category.items.map((item) => item.id),
        );
      },
    });
    this.setState({ selectedCategory: null });
  };

  onDuplicate = (id: number) =>
    this.props.makeActivityCopy(
      id,
      this.props.t('translation:common.copySuffix'),
    );

  render() {
    const { classes, t } = this.props;

    if (
      (this.props.metaActivities || []).length +
        (this.props.disabledMetaActivities || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <IsEmptyList
          text={this.props.t('noActivities')}
          button={this.props.t('actions.addActivity')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('actions.addActivity')}
        />
      );
    }
    return (
      <div className={classes.container}>
        {this.props.loading || this.props.notificationLoading ? (
          <LinearProgress />
        ) : null}
        {this.props.metaActivities.length > 0 ? (
          <div className={classes.search}>
            <div className={classes.header}>
              <div className={classes.searchField}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={this.props.metaActivities}
                  placeholder={t('actions.search')}
                  searchFields={['name', 'description']}
                  searchResult={this.state.searchResult}
                />
              </div>
              <Hidden smDown>
                <Button
                  onClick={() => this.props.goToPaymentPack}
                  color="primary"
                  variant="outlined"
                  startIcon={<ArrowForwardIcon className={classes.leftIcon} />}
                >
                  {t('navigation.goToPaymentPack')}
                </Button>
              </Hidden>
            </div>
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? classes.searchPaperDisplayed
                  : null
              }
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <MetaActivityList
                  metaActivities={this.state.searchResult}
                  goToDetail={this.props.goToDetail}
                  goToEdit={this.props.goToEdit}
                  deleteMetaActivity={this.props.setActivityToDelete}
                />
              </Collapse>
            </Paper>
          </div>
        ) : null}
        <AddCategoryButton
          setShowCategoryDialog={(showCategoryDialog: boolean) =>
            this.setState({ showCategoryDialog })
          }
        />
        {this.state.showCategoryDialog && (
          <CategoryCreationEditDialog
            open={this.state.showCategoryDialog}
            onClose={() =>
              this.setState({
                showCategoryDialog: false,
                selectedCategory: null,
              })
            }
            onSubmit={this.props.upsertMetaActivityCategory}
            categorySelected={this.state.selectedCategory}
          />
        )}
        {!this.props.categoryLoading && (
          <CategoryList
            onClickItem={this.props.goToDetail}
            onEditItem={this.props.goToEdit}
            onDeleteItem={this.props.setActivityToDelete}
            onDuplicateItem={this.onDuplicate}
            updateItemOrder={this.props.editOrderMetaActivity}
            itemLoading={this.props.loading}
            categoryWithItems={this.props.metaActivityCategories}
            editCategory={this.onEditCategory}
            deleteCategory={this.onDeleteCategory}
            updateCategoryOrder={this.props.updateMetaActivityCategoryOrder}
            ListItemComponent={MetaActivityListItem}
          />
        )}
        {(this.props.disabledMetaActivities || []).length ? (
          <div>
            <ButtonBase
              className={this.props.classes.buttonTitle}
              onClick={this.onShowDisabled}
            >
              <Typography variant="h5">
                {`${t('metaActivity:disabledMetaActivities')} (${
                  (this.props.disabledMetaActivities || []).length
                })`}
              </Typography>

              {this.state.showDisabled ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ButtonBase>
            <Divider />
            {this.state.showDisabled && (
              <Collapse in={this.state.showDisabled}>
                <MetaActivityList
                  metaActivities={this.props.disabledMetaActivities}
                  goToDetail={this.props.goToDetail}
                  goToEdit={this.props.goToEdit}
                  deleteMetaActivity={this.props.setActivityToDelete}
                  makeActivityCopy={this.props.makeActivityCopy}
                  restoreMetaActivity={this.restoreMetaActivity}
                />
              </Collapse>
            )}
          </div>
        ) : null}

        <MetaActivityDeleteDialog
          metaActivityId={this.props.activityToDelete}
          onClose={() => this.props.setActivityToDelete(null)}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={this.props.deleteMetaActivity}
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('actions.addActivity')}
          onCreate={this.props.onCreate}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(16),
    },
    search: { marginBottom: theme.spacing(2) },
    searchPaperDisplayed: {
      border: '1px solid',
      borderColor: theme.primary_color,
      borderTop: '0px',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchField: {
      flex: 1,
      marginRight: theme.spacing(1),
    },
    buttonTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: theme.spacing(1),
      marginTop: theme.spacing(3),
    },
  });

export default compose(
  withStyles(styles),
  withTranslation(['metaActivity', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityList'),
  ),
  connect(
    (state: RootState) => ({
      metaActivities: withBookingNotification(getPageEnabledMetaActivities)(
        state,
      ),
      disabledMetaActivities: getPageDisabledMetaActivities(state),
      loading: state.metaActivity.loading || state.metaActivity.delete.loading,
      notificationLoading: state.booking.notification.loading,
      metaActivityCategories: getMetaActivityByCategoryWithActivities(
        withBookingNotification(getPageEnabledMetaActivities),
      )(state),
      categoryLoading: state.metaActivity.metaActivityCategory.loading,
    }),
    {
      makeActivityCopy: makeActivityCopyAction,
      fetchAllMetactivities: fetchAllMetactivitiesAction,
      goToDetail: (metaActivityId: number) =>
        push(`/activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId: number) =>
        push(`/activity/${metaActivityId}/edit`),
      goToPaymentPack: () => push('/payment-pack'),
      deleteMetaActivity,
      restoreMetaActivity,
      fetchMarketingNotificationList,
      onCreate: () => push('/activity/add'),
      fetchAllMetaActivityCategory,
      upsertMetaActivityCategory,
      deleteMetaActivityCategory,
      editOrderMetaActivity,
      updateMetaActivityCategoryOrder,
      fetchMetaActivityBulkAfterCategoryDelete,
    },
  ),
  withHandlers({
    makeActivityCopy:
      ({ makeActivityCopy, fetchAllMetactivities }) =>
      (id: number, suffix: string) => {
        makeActivityCopy(id, suffix, {
          onSuccess: () => fetchAllMetactivities({ customer_enabled: true }),
        });
      },
  }),
  withState('activityToDelete', 'setActivityToDelete', null),
)(MetaActivityListPage);
