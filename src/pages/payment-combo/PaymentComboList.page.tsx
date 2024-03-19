// @ts-nocheck
// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import List from '@material-ui/core/List';

import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles';
import Fuse, { FuseOptions } from 'fuse.js';
import {
  fetchPaymentComboList,
  createOrUpdatePaymentCombo,
  deletePaymentCombo,
} from '#libs/payment-combo/actions';
import { fetchTags } from '#libs/tag/actions';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import {
  getPaymentComboList,
  getPaymentComboListAvailableForSale,
  getPaymentComboListUnavailableForSale,
} from '#libs/payment-combo/selectors';
import FuzeSearch from '../../components/FuzeSearch.component';

import type { PaymentCombo } from '#libs/payment-combo/types';
import PaymentComboFormDrawerContainer from './PaymentComboFormDrawer.container';
import PaymentComboList from '#libs/payment-combo/components/PaymentComboList.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import { MaterialStyleType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import PaymentComboListItem from '#libs/payment-combo/components/PaymentComboListItem.component';
import { RootState } from '../../reducers';
import themeSelectors from '../../libs/theme/selectors';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';

type OwnProps = {
  t: TFunction;

  openCreateOrUpdateForm: (arg?: PaymentCombo) => void;
  openForm: boolean;
  setOpenForm: (arg: boolean) => void;
  comboInitialData?: PaymentCombo;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  ConnectedProps<typeof connector>;

type State = {
  searchText: string;
  searchResult: Array<PaymentCombo>;
};
export class PaymentComboListPage extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchPaymentComboList();
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
  }

  createOrUpdate = (values: any, options: OptionCallback) =>
    this.props.createOrUpdatePaymentCombo(values, {
      onSuccess: (...args) => {
        if (options && options.onSuccess) options.onSuccess(...args);
        this.props.setOpenForm(false);
        this.props.fetchPaymentComboList();
      },
      onError: (...args) => {
        if (options && options.onError) options.onError(...args);
      },
    });

  changeSearch =
    (fuse: Fuse<PaymentCombo, FuseOptions<PaymentCombo>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      this.setState({
        searchText: ev.target.value,
        searchResult: fuse.search(ev.target.value),
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    const {
      paymentComboList,
      t,
      classes,
      loading,
      paymentComboListAvailableOnline,
      paymentComboListUnavailableOnline,
      openCreateOrUpdateForm,
      bookkeepingAccountById,
      bookkeepingAccounts,
    } = this.props;

    return (
      <div className={classes.container}>
        {loading ? <LinearProgress /> : null}
        {this.props.paymentComboListUnavailableOnline.length === 0 &&
        this.props.paymentComboListAvailableOnline.length === 0 &&
        !loading ? (
          <IsEmptyList
            button={this.props.t('list.buttons.add')}
            onCreate={() => openCreateOrUpdateForm(null)}
            text={this.props.t('list.explainIfEmpty')}
          />
        ) : (
          <div className={classes.search}>
            <FuzeSearch
              changeSearch={this.changeSearch}
              clearSearch={this.clearSearch}
              items={paymentComboList}
              placeholder={t('search')}
              searchFields={['name']}
              searchResult={this.state.searchResult}
              searchText={this.state.searchText}
            />

            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
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
                  {this.state.searchResult.map((pc) => (
                    <PaymentComboListItem
                      key={pc.id}
                      divider
                      onClick={() => this.props.goToPaymentCombo(pc.id)}
                      onDelete={() => this.props.deletePaymentCombo(pc.id)}
                      onEdit={() => openCreateOrUpdateForm(pc)}
                      paymentCombo={pc}
                    />
                  ))}
                </List>
              </Collapse>
            </Paper>
          </div>
        )}
        <PaymentComboList
          loading={loading}
          onClickPaymentCombo={this.props.goToPaymentCombo}
          onDelete={this.props.deletePaymentCombo}
          onEdit={openCreateOrUpdateForm}
          paymentComboListAvailableOnline={paymentComboListAvailableOnline}
          paymentComboListUnavailableOnline={paymentComboListUnavailableOnline}
        />
        <BottomActionButtons
          onCreate={() => openCreateOrUpdateForm(null)}
          onCreateLabel={t('list.buttons.add')}
        />
        {this.props.openForm ? (
          <PaymentComboFormDrawerContainer
            bookkeepingAccountById={bookkeepingAccountById}
            bookkeepingAccounts={bookkeepingAccounts}
            displayNewCheckoutFlow={this.props.theme.display_new_checkout_flow}
            handleClose={() => this.props.setOpenForm(false)}
            initial={this.props.comboInitialData}
            onSubmit={this.createOrUpdate}
            open={this.props.openForm}
            provincialTax={this.props.theme?.provincial_tax_value}
            tagList={this.props.allTagsWithTagGroup}
          />
        ) : null}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  explainIfEmpty: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    color: 'bleu',
    fontSize: 'larger',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    border: '2px solid #E2E2E2',
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    width: '400px',
    marginLeft: '200px',
  },
  container: {
    paddingBottom: theme.spacing(16),
  },
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
  search: { marginBottom: theme.spacing(2) },
});

const connector = connect(
  (state: RootState) => ({
    loading: state.paymentCombo.loading,
    paymentComboListAvailableOnline: getPaymentComboListAvailableForSale(state),
    paymentComboListUnavailableOnline:
      getPaymentComboListUnavailableForSale(state),
    error: state.paymentCombo.createOrUpdate.error,
    paymentComboList: getPaymentComboList(state),
    theme: themeSelectors.getTheme(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountById: getBookkeepingAccountById(state),
  }),
  {
    fetchPaymentComboList,
    createOrUpdatePaymentCombo,
    deletePaymentCombo,
    goToPaymentCombo: (id: number) => push(`/combo/${id}`),
    fetchTags,
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  },
);

export default compose<any, Props>(
  withTranslation(['paymentCombo']),
  withStyles(styles),
  connector,
  withHandlers({
    fetchBookkeepingAccountList:
      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({ is_active: true }),
  }),
  withState('openForm', 'setOpenForm', false),
  withState('comboInitialData', 'setComboInitialData', null),
  withProps(({ setComboInitialData, setOpenForm }) => ({
    openCreateOrUpdateForm: (paymentCombo?: PaymentCombo) => {
      setComboInitialData(paymentCombo);
      setOpenForm(true);
    },
  })),
)(PaymentComboListPage);
