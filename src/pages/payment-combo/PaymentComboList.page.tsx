// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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
} from '../../libs/payment-combo/actions';
import {
  getPaymentComboListAvailableOnline,
  getPaymentComboListUnavailableOnline,
  getPaymentComboList,
} from '../../libs/payment-combo/selectors';
import FuzeSearch from '../../components/FuzeSearch.component';

import type { PaymentCombo } from '../../libs/payment-combo/types';
import PaymentComboFormDialogContainer from './PaymentComboFormDialog.container';
import PaymentComboList from '../../libs/payment-combo/components/PaymentComboList.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import { MaterialStyleType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import PaymentComboListItem from '../../libs/payment-combo/components/PaymentComboListItem.component';
import { RootState } from '../../reducers';

type OwnProps = {
  t: TFunction;
  classes: Object;

  loading: boolean;
  fetchPaymentComboList: () => void;
  paymentComboListAvailableOnline: Array<PaymentCombo>;
  paymentComboListUnavailableOnline: Array<PaymentCombo>;
  paymentComboList: Array<PaymentCombo>;
  deletePaymentCombo: (id: number, options?: OptionCallback) => void;

  goToPaymentCombo: (id: number) => void;
  createOrUpdatePaymentCombo: (values: any, options?: OptionCallback) => void;
  openCreateOrUpdateForm: (arg?: PaymentCombo) => void;

  openForm: boolean;
  setOpenForm: (arg: boolean) => void;
  comboInitialData?: PaymentCombo;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

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
    } = this.props;

    return (
      <div className={classes.container}>
        {loading ? <LinearProgress /> : null}
        {this.props.paymentComboListUnavailableOnline.length === 0 &&
        this.props.paymentComboListAvailableOnline.length === 0 &&
        !loading ? (
          <IsEmptyList
            text={this.props.t('list.explainIfEmpty')}
            button={this.props.t('list.buttons.add')}
            onCreate={() => openCreateOrUpdateForm(null)}
          />
        ) : (
          <div className={classes.search}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              items={paymentComboList}
              placeholder={t('search')}
              searchFields={['name']}
              searchResult={this.state.searchResult}
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
                      divider
                      paymentCombo={pc}
                      onEdit={() => openCreateOrUpdateForm(pc)}
                      onDelete={() => this.props.deletePaymentCombo(pc.id)}
                      key={pc.id}
                      onClick={() => this.props.goToPaymentCombo(pc.id)}
                    />
                  ))}
                </List>
              </Collapse>
            </Paper>
          </div>
        )}
        <PaymentComboList
          paymentComboListAvailableOnline={paymentComboListAvailableOnline}
          paymentComboListUnavailableOnline={paymentComboListUnavailableOnline}
          onEdit={openCreateOrUpdateForm}
          onDelete={this.props.deletePaymentCombo}
          onClickPaymentCombo={this.props.goToPaymentCombo}
          loading={loading}
        />
        <BottomActionButtons
          onCreateLabel={t('list.buttons.add')}
          onCreate={() => openCreateOrUpdateForm(null)}
        />
        {this.props.openForm ? (
          <PaymentComboFormDialogContainer
            initial={this.props.comboInitialData}
            open={this.props.openForm}
            handleClose={() => this.props.setOpenForm(false)}
            onSubmit={this.createOrUpdate}
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

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
  connect(
    (state: RootState) => ({
      loading: state.paymentCombo.loading,
      paymentComboListAvailableOnline:
        getPaymentComboListAvailableOnline(state),
      paymentComboListUnavailableOnline:
        getPaymentComboListUnavailableOnline(state),
      error: state.paymentCombo.createOrUpdate.error,
      paymentComboList: getPaymentComboList(state),
    }),
    {
      fetchPaymentComboList,
      createOrUpdatePaymentCombo,
      deletePaymentCombo,
      goToPaymentCombo: (id: number) => push(`/combo/${id}`),
    },
  ),
  withState('openForm', 'setOpenForm', false),
  withState('comboInitialData', 'setComboInitialData', null),
  withProps(({ setComboInitialData, setOpenForm }) => ({
    openCreateOrUpdateForm: (paymentCombo?: PaymentCombo) => {
      setComboInitialData(paymentCombo);
      setOpenForm(true);
    },
  })),
)(PaymentComboListPage);
