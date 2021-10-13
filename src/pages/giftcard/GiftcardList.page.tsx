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
import withTitle from '../../hocs/with-title.hoc';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import BackofficeLinearProgressComponent from '../../components/navigation/BackofficeLinearProgress.component';
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
} from '../../libs/giftcard/actions';
import {
  getGiftcardBackgroundImageList,
  getGiftcardListActive,
  getGiftcardListUnavailableForSale,
  getGiftcardListInactive,
} from '../../libs/giftcard/selectors';
import GiftcardFormDialog from '../../libs/giftcard/components/GiftcardFormDialog.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import GiftcardList from '../../libs/giftcard/components/GiftcardList.component';
import DividerLoader from '../../components/DividerLoader.component';
import GiftcardBackgroundImageUploader from '../../libs/giftcard/components/GiftcardBackgroundImageUploader.component';

import {
  ConsumerGiftcard,
  GiftcardBackgroundImage,
} from '../../libs/giftcard/types';
import { OptionCallback } from '../../state/types';

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
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

type State = { showDisabled: boolean };

export class GiftcardListPage extends Component<Props, State> {
  state = { showDisabled: false };

  componentDidMount() {
    this.props.fetchGiftcardList();
    this.props.fetchGiftcardBackgroundImageList(this.props.company);
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

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.container}>
        {this.props.loading && <BackofficeLinearProgressComponent />}
        <Button
          variant="outlined"
          color="primary"
          onClick={this.props.toggleBackgroundImageForm}
        >
          <AddIcon />
          {t('list.addBackgroundImage')}
        </Button>
        {this.props.giftcardListActive.length === 0 &&
        this.props.giftcardListUnavailableForSale.length === 0 &&
        this.props.giftcardListInactive.length === 0 &&
        !this.props.loading ? (
          <IsEmptyList
            text={this.props.t('list.explainIfEmpty')}
            button={this.props.t('list.actions.create')}
            onCreate={this.props.openCreateForm}
          />
        ) : null}
        {!!this.props.giftcardListActive.length && (
          <>
            <Typography
              variant="h5"
              component="h2"
              className={classes.titleContainer}
            >
              {`${t('list.activeTitle')} (${
                this.props.giftcardListActive.length
              })`}
            </Typography>
            <DividerLoader
              loading={this.props.loading}
              className={classes.divider}
            />
            <GiftcardList
              onEdit={this.props.openEditForm}
              onRemove={this.props.deleteGiftcard}
              giftcardList={this.props.giftcardListActive}
              onClick={this.props.goToGiftcard}
            />
          </>
        )}
        {!!this.props.giftcardListUnavailableForSale.length && (
          <div className={classes.titleContainer}>
            <Typography variant="h5" component="h2">
              {`${t('list.unavailableForSaleTitle')} (${
                this.props.giftcardListUnavailableForSale.length
              })`}
            </Typography>
            <DividerLoader
              loading={this.props.loading}
              className={classes.divider}
            />
            <GiftcardList
              onEdit={this.props.openEditForm}
              onRemove={this.props.deleteGiftcard}
              giftcardList={this.props.giftcardListUnavailableForSale}
              onClick={this.props.goToGiftcard}
            />
          </div>
        )}
        {!!this.props.giftcardListInactive.length && (
          <React.Fragment>
            <div className={classes.row}>
              <Typography variant="h5" component="h2">
                {`${t('list.archivedTitle')} (${
                  this.props.giftcardListInactive.length
                })`}
              </Typography>
              <IconButton
                onClick={this.onShowDisabled}
                className={classes.iconContainer}
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
          onCreateLabel={this.props.t('list.actions.create')}
          onCreate={this.props.openCreateForm}
        />
        <GiftcardFormDialog
          open={!!this.props.queryParams?.isCreateFormOpen}
          onSubmit={this.props.createOrUpdate}
          onClose={this.props.closeForms}
        />
        {!!this.props.giftcardToEdit && (
          <GiftcardFormDialog
            open
            onSubmit={this.props.createOrUpdate}
            onClose={this.props.closeForms}
            initial={this.props.giftcardToEdit}
          />
        )}
        {this.props.queryParams.isBackgroundImageUploaderOpen && (
          <GiftcardBackgroundImageUploader
            open={this.props.queryParams.isBackgroundImageUploaderOpen}
            giftcardBackgroundImageList={this.props.giftcardBackgroundImageList}
            onClose={this.props.toggleBackgroundImageForm}
            onAddImage={this.onAddImage}
            onRemoveImage={this.onRemoveImage}
            companyCover={this.props.companyCover}
          />
        )}
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
  withHandlers({
    closeForms: ({ setQueryParams, queryParams }) => (
      callback: (() => void) | null,
    ) => {
      if (queryParams?.isCreateFormOpen) {
        setQueryParams('isCreateFormOpen')('', callback);
      }
      if (queryParams?.giftcardToEdit) {
        setQueryParams('giftcardToEdit')('', callback);
      }
    },
    openCreateForm: ({ setQueryParams, queryParams }) => () => {
      if (queryParams?.isCreateFormOpen) {
        setQueryParams('isCreateFormOpen')('');
      } else {
        setQueryParams('isCreateFormOpen')('true');
      }
    },
    toggleBackgroundImageForm: ({ setQueryParams, queryParams }) => () => {
      if (queryParams?.isBackgroundImageUploaderOpen) {
        setQueryParams('isBackgroundImageUploaderOpen')('');
      } else {
        setQueryParams('isBackgroundImageUploaderOpen')('true');
      }
    },
    openEditForm: ({ setQueryParams }) => (giftcardId: number | null) => {
      if (!giftcardId) {
        setQueryParams('giftcardToEdit')('');
      } else {
        setQueryParams('giftcardToEdit')(`${giftcardId}`);
      }
    },
  }),
  connector,
  withHandlers({
    deleteGiftcard: ({ deleteGiftcard, fetchGiftcardList }) => (
      id: number,
      options: OptionCallback<number>,
    ) => {
      deleteGiftcard(id, {
        onSuccess: (id_: number) => {
          fetchGiftcardList();
          if (options?.onSuccess) {
            options.onSuccess(id_);
          }
        },
      });
    },
    createOrUpdate: ({
      createOrUpdateGiftcard,
      fetchGiftcardList,
      queryParams,
      closeForms,
      push,
    }) => (
      data: ConsumerGiftcard,
      options: OptionCallback<ConsumerGiftcard>,
    ) => {
      const id = parseInt(queryParams?.giftcardToEdit, 10);
      createOrUpdateGiftcard(id, data, {
        onSuccess: (g) => {
          fetchGiftcardList();
          closeForms(() => push(`/giftcard/${g.id}/`));
          options?.onSuccess();
        },
        onError: options?.onError,
      });
    },
    goToGiftcard: ({ push }) => (id: number) => {
      push(`/giftcard/${id}/`);
    },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:giftcard')),
)(GiftcardListPage);
