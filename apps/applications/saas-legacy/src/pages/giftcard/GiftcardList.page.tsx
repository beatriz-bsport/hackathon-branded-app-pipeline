import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushAction } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { fetchTags } from '#src/libs/tag/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import withTitle from '../../hocs/with-title.hoc';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import BackofficeLinearProgressComponent from '../../components/navigation/BackofficeLinearProgress.component';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import { RootState } from '../../reducers';
import {
  fetchGiftcardList as fetchGiftcardListAction,
  createOrUpdateGiftcard as createOrUpdateGiftcardAction,
  deleteGiftcard as deleteGiftcardActions,
  createGiftcardBackgroundImage,
  deleteGiftcardBackgroundImage,
  fetchGiftcardBackgroundImageList,
  restoreGiftcard,
  makeGiftcardCopy as makeGiftcardCopyAction,
} from '../../libs/giftcard/actions';
import {
  getGiftcardBackgroundImageList,
  getGiftcardListActive,
  getGiftcardListUnavailableForSale,
  getGiftcardListInactive,
} from '../../libs/giftcard/selectors';
import { GiftcardFormDrawer } from '#src/libs/giftcard/components/GiftcardFormDrawer';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import GiftcardList from '../../libs/giftcard/components/GiftcardList.component';
import DividerLoader from '../../components/DividerLoader.component';
import GiftcardBackgroundImageUploader from '../../libs/giftcard/components/GiftcardBackgroundImageUploader.component';

import {
  ConsumerGiftcard,
  Giftcard,
  GiftcardBackgroundImage,
} from '../../libs/giftcard/types';
import { OptionCallback } from '../../state/types';
import GiftcardListItem from '../../libs/giftcard/components/GiftcardListItem.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import GiftcardListDeleteDialog from '#src/libs/giftcard/components/GiftcardListDeleteDialog.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

const styles = (theme: Theme) =>
  createStyles({
    titleContainer: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(3),
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonRow: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  });

type OwnProps = {
  openCreateForm: () => void;
  openEditForm: (consumerGiftcardId: number) => void;
  closeForms: () => void;
  addImage: (data: any) => void;
  removeImage: (index: number) => void;
  goToGiftcard: (id: number) => void;
  toggleBackgroundImageForm: () => void;
  createOrUpdate: () => void;
  queryParams: any;
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>;
  companyCover: string;
  makeGiftcardCopy: (id: number, options: OptionCallback) => void;
  fetchBookkeepingAccountList: () => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation &
  WithObjectSearch;

type State = {
  showDisabled: boolean;
  giftcardIdToDelete: number | null;
};

const searchBarAdditionalParams = {
  disabled: false,
  manager_only: false,
};

type GiftcardOption = {
  label: string;
  onDuplicate?: (id: number) => void;
  onEdit?: (id: number) => void;
  onClick?: (id: number) => void;
  giftcard: Giftcard;
  value: number;
};

const Option: React.FC<OptionPropsWithData<GiftcardOption>> = (props) => (
  <GiftcardListItem divider {...props.data} />
);

export class GiftcardListPage extends Component<Props, State> {
  state: State = {
    showDisabled: false,
    giftcardIdToDelete: null,
  };

  componentDidMount() {
    this.props.fetchGiftcardList();
    this.props.fetchGiftcardBackgroundImageList(this.props.company);
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      // @ts-expect-error
      this.props.fetchAvailableBookkeepingAccounts();
  }

  onShowDisabled = () =>
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));

  onAddImage = (file: any) => {
    this.props.addImage(file);
  };

  onRemoveImage = (index: number) => {
    const id = this.props.giftcardBackgroundImageList[index].id;
    this.props.removeImage(id);
  };

  handleOpenDeleteModal = (id: number) =>
    this.setState({ giftcardIdToDelete: id });

  handleCloseDeleteModal = () => this.setState({ giftcardIdToDelete: null });

  handleDeleteGiftCard = () => {
    if (!this.state.giftcardIdToDelete) {
      console.warn(
        '[Giftcard] Could not delete giftcard. giftcardIdToDelete is undefined',
      );
      return;
    }

    this.props.deleteGiftcard(this.state.giftcardIdToDelete, {
      onSuccess: () => {
        this.setState({ giftcardIdToDelete: null });
        this.props.refreshOptions('giftcard', searchBarAdditionalParams);
      },
      onError: () => {
        this.setState({ giftcardIdToDelete: null });
        this.props.refreshOptions('giftcard', searchBarAdditionalParams);
      },
    });
  };

  giftcardOptionsFormatter = (giftcards: Giftcard[]): GiftcardOption[] =>
    giftcards.map((giftcard) => {
      return {
        label: giftcard.name,
        giftcard,
        onClick: this.props.goToGiftcard,
        onEdit: this.props.openEditForm,
        onRemove: this.handleOpenDeleteModal,
        value: giftcard.id,
      };
    });

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.container}>
        {this.props.loading && <BackofficeLinearProgressComponent />}
        {this.props.giftcardListActive?.length ? (
          <ObjectSearchComponent
            additionalParams={searchBarAdditionalParams}
            components={{
              Option,
            }}
            optionsFormatter={this.giftcardOptionsFormatter}
            placeholder={this.props.t('search')}
            searchedObjectType="giftcard"
            variant="underlined"
          />
        ) : null}
        <div className={classes.buttonRow}>
          <Button
            color="primary"
            onClick={this.props.toggleBackgroundImageForm}
            variant="outlined"
          >
            <AddIcon />
            {t('list.addBackgroundImage')}
          </Button>
        </div>
        {this.props.giftcardListActive.length === 0 &&
        this.props.giftcardListUnavailableForSale.length === 0 &&
        this.props.giftcardListInactive.length === 0 &&
        !this.props.loading ? (
          <IsEmptyList
            button={this.props.t('list.actions.create')}
            onCreate={this.props.openCreateForm}
            text={this.props.t('list.explainIfEmpty')}
          />
        ) : null}
        {!!this.props.giftcardListActive.length && (
          <>
            <Typography
              className={classes.titleContainer}
              component="h2"
              variant="h5"
            >
              {`${t('list.activeTitle')} (${
                this.props.giftcardListActive.length
              })`}
            </Typography>
            <DividerLoader
              className={classes.divider}
              loading={this.props.loading}
            />
            <GiftcardList
              giftcardList={this.props.giftcardListActive}
              onClick={this.props.goToGiftcard}
              // @ts-expect-error
              onDuplicate={this.props.makeGiftcardCopy}
              onEdit={this.props.openEditForm}
              onRemove={this.handleOpenDeleteModal}
            />
          </>
        )}
        {!!this.props.giftcardListUnavailableForSale.length && (
          <div className={classes.titleContainer}>
            <Typography component="h2" variant="h5">
              {`${t('list.unavailableForSaleTitle')} (${
                this.props.giftcardListUnavailableForSale.length
              })`}
            </Typography>
            <DividerLoader
              className={classes.divider}
              loading={this.props.loading}
            />
            <GiftcardList
              giftcardList={this.props.giftcardListUnavailableForSale}
              onClick={this.props.goToGiftcard}
              onEdit={this.props.openEditForm}
              onRemove={this.handleOpenDeleteModal}
            />
          </div>
        )}
        {!!this.props.giftcardListInactive.length && (
          <React.Fragment>
            <div className={classes.row}>
              <Typography component="h2" variant="h5">
                {`${t('list.archivedTitle')} (${
                  this.props.giftcardListInactive.length
                })`}
              </Typography>
              <IconButton
                className={classes.iconContainer}
                onClick={this.onShowDisabled}
              >
                {this.state.showDisabled ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </div>
            <Divider />
          </React.Fragment>
        )}
        <Collapse in={this.state.showDisabled}>
          {this.state.showDisabled && (
            <GiftcardList
              giftcardList={this.props.giftcardListInactive}
              onRestore={this.props.restoreGiftcard}
            />
          )}
        </Collapse>
        <BottomActionButtons
          onCreate={this.props.openCreateForm}
          onCreateLabel={this.props.t('list.actions.create')}
        />
        <GiftcardFormDrawer
          bookkeepingAccountById={this.props.bookkeepingAccountById}
          bookkeepingAccounts={this.props.bookkeepingAccounts}
          onClose={this.props.closeForms}
          onSubmit={this.props.createOrUpdate}
          open={!!this.props.queryParams?.isCreateFormOpen}
          // @ts-expect-error Keep it for ci:compile script to succeed
          tagList={this.props.allTagsWithTagGroup}
        />
        <GiftcardFormDrawer
          bookkeepingAccountById={this.props.bookkeepingAccountById}
          bookkeepingAccounts={this.props.bookkeepingAccounts}
          initial={this.props.giftcardToEdit}
          onClose={this.props.closeForms}
          onSubmit={this.props.createOrUpdate}
          open={!!this.props.giftcardToEdit}
          // @ts-expect-error Keep it for ci:compile script to succeed
          tagList={this.props.allTagsWithTagGroup}
        />
        {this.props.queryParams.isBackgroundImageUploaderOpen && (
          <GiftcardBackgroundImageUploader
            companyCover={this.props.companyCover}
            giftcardBackgroundImageList={this.props.giftcardBackgroundImageList}
            onAddImage={this.onAddImage}
            onClose={this.props.toggleBackgroundImageForm}
            onRemoveImage={this.onRemoveImage}
            open={this.props.queryParams.isBackgroundImageUploaderOpen}
          />
        )}
        <GiftcardListDeleteDialog
          handleCancel={this.handleCloseDeleteModal}
          handleConfirm={this.handleDeleteGiftCard}
          open={!!this.state.giftcardIdToDelete}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { queryParams }: any) => ({
    giftcardListActive: getGiftcardListActive(state),
    giftcardListUnavailableForSale: getGiftcardListUnavailableForSale(state),
    giftcardListInactive: getGiftcardListInactive(state),
    loading: state.giftcard.giftcard.loading,
    giftcardBackgroundImageList: getGiftcardBackgroundImageList(state),
    companyCover: state.theme.theme.cover,
    company: state.theme.theme.company,
    giftcardToEdit:
      state.giftcard.giftcard.byId[parseInt(queryParams?.giftcardToEdit, 10)],
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountById: getBookkeepingAccountById(state),
  }),
  {
    fetchGiftcardList: fetchGiftcardListAction,
    fetchGiftcardBackgroundImageList,
    addImage: createGiftcardBackgroundImage,
    removeImage: deleteGiftcardBackgroundImage,
    createOrUpdateGiftcard: createOrUpdateGiftcardAction,
    deleteGiftcard: deleteGiftcardActions,
    restoreGiftcard,
    push: pushAction,
    makeGiftcardCopy: makeGiftcardCopyAction,
    fetchTags,
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  withQueryParams([
    ['isCreateFormOpen', 'giftcardToEdit', 'isBackgroundImageUploaderOpen'],
    'queryParams',
    'setQueryParams',
  ]),
  withObjectSearch,
  withHandlers({
    closeForms:
      ({ setQueryParams, queryParams }) =>
      (callback: (() => void) | null) => {
        if (queryParams?.isCreateFormOpen) {
          setQueryParams('isCreateFormOpen')('', callback);
        }
        if (queryParams?.giftcardToEdit) {
          setQueryParams('giftcardToEdit')('', callback);
        }
      },
    openCreateForm:
      ({ setQueryParams, queryParams }) =>
      () => {
        if (queryParams?.isCreateFormOpen) {
          setQueryParams('isCreateFormOpen')('');
        } else {
          setQueryParams('isCreateFormOpen')('true');
        }
      },
    toggleBackgroundImageForm:
      ({ setQueryParams, queryParams }) =>
      () => {
        if (queryParams?.isBackgroundImageUploaderOpen) {
          setQueryParams('isBackgroundImageUploaderOpen')('');
        } else {
          setQueryParams('isBackgroundImageUploaderOpen')('true');
        }
      },
    openEditForm:
      ({ setQueryParams }) =>
      (giftcardId: number | null) => {
        if (!giftcardId) {
          setQueryParams('giftcardToEdit')('');
        } else {
          setQueryParams('giftcardToEdit')(`${giftcardId}`);
        }
      },
  }),
  connector,
  withHandlers({
    deleteGiftcard:
      ({ deleteGiftcard, fetchGiftcardList }) =>
      (id: number, options: OptionCallback<number>) => {
        deleteGiftcard(id, {
          onSuccess: (id_: number) => {
            fetchGiftcardList();
            if (options?.onSuccess) {
              options.onSuccess(id_);
            }
          },
        });
      },
    createOrUpdate:
      ({
        createOrUpdateGiftcard,
        fetchGiftcardList,
        queryParams,
        closeForms,
        push,
      }) =>
      (data: ConsumerGiftcard, options: OptionCallback<ConsumerGiftcard>) => {
        const id = parseInt(queryParams?.giftcardToEdit, 10);
        createOrUpdateGiftcard(id, data, {
          // @ts-expect-error
          onSuccess: (g) => {
            fetchGiftcardList();
            closeForms(() => push(`/giftcard/${g.id}/`));
            options?.onSuccess();
          },
          onError: options?.onError,
        });
      },
    makeGiftcardCopy:
      ({ makeGiftcardCopy, fetchGiftcardList }) =>
      (id: number) => {
        makeGiftcardCopy(id, {
          onSuccess: () => fetchGiftcardList(),
        });
      },
    goToGiftcard:
      ({ push }) =>
      (id: number) => {
        push(`/giftcard/${id}/`);
      },
    fetchAvailableBookkeepingAccounts:
      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({
          is_active: true,
        }),
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:giftcard')),
)(GiftcardListPage);
