import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { push } from 'connected-react-router';

import { Theme } from '@material-ui/core/styles';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import {
  fetchPaymentComboList,
  createOrUpdatePaymentCombo,
  deletePaymentCombo,
} from '#src/libs/payment-combo/actions';
import { fetchTags } from '#src/libs/tag/actions';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import {
  getAvailablePaymentComboList,
  getPaymentComboListAvailableForSale,
  getPaymentComboListUnavailableForSale,
} from '#src/libs/payment-combo/selectors';

import type { PaymentCombo } from '#src/libs/payment-combo/types';
// @ts-expect-error
import PaymentComboList from '#src/libs/payment-combo/components/PaymentComboList.component';
// @ts-expect-error
import PaymentComboListItem from '#src/libs/payment-combo/components/PaymentComboListItem.component';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';
import ModalConfirm from '#src/components/ModalConfirm.component';
// @ts-expect-error Could not find JS file
import withQueryParams from '#src/hocs/with-query-params.hoc';
import type { WithHandlerType } from '#src/utils/types';
// @ts-expect-error
import PaymentComboFormDrawerContainer from './PaymentComboFormDrawer.container';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import { MaterialStyleType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import themeSelectors from '../../libs/theme/selectors';

type OwnProps = {
  t: TFunction;
  queryParams?: {
    openForm?: string;
  };
  comboInitialData?: PaymentCombo;
  paymentComboIdToDelete: number | null;
  setPaymentComboIdToDelete: (arg: number | null) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandlers> &
  WithObjectSearch;

type PaymentComboOption = {
  label: string;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
  paymentCombo: PaymentCombo;
  value: number;
};

const Option: React.FC<OptionPropsWithData<PaymentComboOption>> = (props) => (
  <PaymentComboListItem divider {...props.data} />
);

export class PaymentComboListPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentComboList();
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
  }

  readonly searchBarAdditionalParams = {
    available: true,
  };

  handleOnDeletePaymentCombo = (id: number) =>
    this.props.setPaymentComboIdToDelete(id);

  handleCancelDelete = () => this.props.setPaymentComboIdToDelete(null);

  deletePaymentCombo = () => {
    const paymentComboIdToDelete = this.props.paymentComboIdToDelete;
    if (
      paymentComboIdToDelete !== null &&
      paymentComboIdToDelete !== undefined
    ) {
      this.props.deletePaymentCombo(paymentComboIdToDelete, {
        onSuccess: () => {
          this.props.setPaymentComboIdToDelete(null);
          this.props.refreshOptions(
            'payment_combo',
            this.searchBarAdditionalParams,
          );
        },
      });
    }
  };

  createOrUpdate = (values: any, options: OptionCallback) =>
    this.props.createOrUpdatePaymentCombo(values, {
      onSuccess: (...args) => {
        if (options && options.onSuccess) options.onSuccess(...args);
        this.props.refreshOptions(
          'payment_combo',
          this.searchBarAdditionalParams,
        );
        this.props.closeCreateOrUpdateForm();
        this.props.fetchPaymentComboList();
      },
      onError: (...args) => {
        if (options && options.onError) options.onError(...args);
      },
    });

  paymentCombosOptionsFormatter = (
    paymentCombos: PaymentCombo[],
  ): PaymentComboOption[] =>
    paymentCombos.map((paymentCombo) => {
      return {
        label: paymentCombo.name,
        onClick: () => this.props.goToPaymentCombo(paymentCombo.id),
        onDelete: () => this.handleOnDeletePaymentCombo(paymentCombo.id),
        onEdit: () => this.props.openCreateOrUpdateForm(paymentCombo),
        paymentCombo,
        value: paymentCombo.id,
      };
    });

  render() {
    const {
      t,
      classes,
      loading,
      paymentComboListAvailableOnline,
      paymentComboListUnavailableOnline,
      queryParams,
      openCreateOrUpdateForm,
      closeCreateOrUpdateForm,
      goToPaymentCombo,
      comboInitialData,
      bookkeepingAccountById,
      bookkeepingAccounts,
    } = this.props;

    const openForm = !!queryParams?.openForm;

    return (
      <div className={classes.container}>
        {loading ? <LinearProgress /> : null}
        {paymentComboListUnavailableOnline.length === 0 &&
        paymentComboListAvailableOnline.length === 0 &&
        !loading ? (
          <IsEmptyList
            button={t('list.buttons.add')}
            onCreate={() => openCreateOrUpdateForm(undefined)}
            text={t('list.explainIfEmpty')}
          />
        ) : (
          <div className={classes.search}>
            <ObjectSearchComponent
              additionalParams={this.searchBarAdditionalParams}
              components={{
                Option,
              }}
              optionsFormatter={this.paymentCombosOptionsFormatter}
              placeholder={t('search')}
              searchedObjectType="payment_combo"
              variant="underlined"
            />
          </div>
        )}
        <PaymentComboList
          loading={loading}
          onClickPaymentCombo={goToPaymentCombo}
          onDelete={this.handleOnDeletePaymentCombo}
          onEdit={openCreateOrUpdateForm}
          paymentComboListAvailableOnline={paymentComboListAvailableOnline}
          paymentComboListUnavailableOnline={paymentComboListUnavailableOnline}
        />
        <BottomActionButtons
          onCreate={() => openCreateOrUpdateForm(undefined)}
          onCreateLabel={t('list.buttons.add')}
        />
        {openForm ? (
          <PaymentComboFormDrawerContainer
            bookkeepingAccountById={bookkeepingAccountById}
            bookkeepingAccounts={bookkeepingAccounts}
            handleClose={closeCreateOrUpdateForm}
            initial={comboInitialData}
            onSubmit={this.createOrUpdate}
            open={openForm}
            provincialTax={this.props.theme?.provincial_tax_value}
            tagList={this.props.allTagsWithTagGroup}
          />
        ) : null}
        <ModalConfirm
          handleCancel={this.handleCancelDelete}
          handleConfirm={this.deletePaymentCombo}
          open={!!this.props.paymentComboIdToDelete}
          options={{
            title: 'paymentCombo:delete.title',
            cancel: 'paymentCombo:delete.cancel',
            confirm: 'paymentCombo:delete.submit',
            Content: () => <p>{t('paymentCombo:delete.content')}</p>,
          }}
        />
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
    paymentComboList: getAvailablePaymentComboList(state),
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

type SetQueryParams = (queryKey: 'openForm') => (nextValue: string) => void;

const mapWithHandlers = {
  fetchBookkeepingAccountList:
    ({ fetchBookkeepingAccountList }: ConnectedProps<typeof connector>) =>
    () =>
      fetchBookkeepingAccountList({ is_active: true }),
  openCreateOrUpdateForm:
    ({
      setComboInitialData,
      setQueryParams,
    }: {
      setQueryParams: SetQueryParams;
      setComboInitialData: (initialData?: PaymentCombo | null) => void;
    }) =>
    (paymentCombo?: PaymentCombo) => {
      setComboInitialData(paymentCombo);
      setQueryParams('openForm')('true');
    },
  closeCreateOrUpdateForm:
    ({ setQueryParams }: { setQueryParams: SetQueryParams }) =>
    () => {
      setQueryParams('openForm')('');
    },
};

export default compose<any, Props>(
  withTranslation(['paymentCombo']),
  // @ts-expect-error
  withStyles(styles),
  connector,
  withState('comboInitialData', 'setComboInitialData', null),
  withState('paymentComboIdToDelete', 'setPaymentComboIdToDelete', null),
  withQueryParams([['openForm'], 'queryParams', 'setQueryParams']),
  withObjectSearch,
  // @ts-expect-error Can not type withState and withQueryParams stuff
  withHandlers(mapWithHandlers),
)(PaymentComboListPage);
