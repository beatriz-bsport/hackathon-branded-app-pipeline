import React, { useState, useCallback, useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';

import { connect, ConnectedProps } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { compose } from 'recompose';
import withTitle from '#src/hocs/with-title.hoc';

import { RootState } from '#src/reducers';

import {
  fetchActiveContractTemplateList as fetchActiveContractTemplateListAction,
  fetchDisabledContractTemplateList as fetchDisabledContractTemplateListAction,
  deleteContractTemplate as deleteContractTemplateAction,
  restoreContractTemplate as restoreContractTemplateAction,
} from '#src/libs/subscription/actions';
import { fetchPaymentPackTemplateList as fetchPaymentPackTemplateListAction } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassTemplateList as fetchPrivatePassTemplateListAction } from '#src/libs/private-service/actions';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';

import {
  getActiveContractTemplateList,
  getDisabledContractTemplateList,
} from '#src/libs/subscription/selectors';
import { getPaymentPackTemplateById as getPaymentPackTemplateByIdSelector } from '#src/libs/payment-packs/selectors';
import { getPrivatePassTemplateById as getPrivatePassTemplateByIdSelector } from '#src/libs/private-service/selectors/private-pass';
import { getFranchiseCompanyListById as getFranchiseCompanyListByIdSelector } from '#src/libs/franchise/selectors';
import ContractTemplateList from '#src/libs/subscription/franchise-components/ContractTemplateList.component';
import ContractTemplateListItem from '#src/libs/subscription/franchise-components/ContractTemplateListItem.component';
import ContractTemplateDeleteDialog from '#src/libs/subscription/components/ContractTemplateDeleteDialog.component';
import { CONTRACT_TEMPLATE_PAGE_SIZE } from '#src/libs/subscription/constants';

import ObjectSearch from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import type { ContractTemplate } from '#src/libs/subscription/types';

type Props = ConnectedProps<typeof connector> & WithTranslation;

type OptionProps = React.ComponentProps<typeof ContractTemplateListItem>;

const SearchOption: React.FC<OptionPropsWithData<OptionProps>> = React.memo(
  (props) => <ContractTemplateListItem {...props.data} />,
);
const FranchiseContractTemplateList: React.FC<Props> = ({
  activeContractTemplateState,
  disabledContractTemplateState,
  getPaymentPackTemplateById,
  getPrivatePassTemplateById,
  getFranchiseCompanyListById,
  fetchActiveContractTemplateList,
  fetchDisabledContractTemplateList,
  deleteContractTemplate,
  restoreContractTemplate,
  fetchPaymentPackTemplateList,
  fetchPrivatePassTemplateList,
  fetchFranchise,
  t,
}) => {
  const classes = useStyles();
  const [showDisabledContractList, setShowDisabledContractList] =
    useState(false);

  const [
    selectedContractTemplateIdToDelete,
    setSelectedContractTemplateIdToDelete,
  ] = React.useState<number | null>(null);

  const fetchActiveContractTemplateListHandler = useCallback(
    (page?: number) => {
      fetchActiveContractTemplateList({ page });
    },
    [fetchActiveContractTemplateList],
  );

  const fetchDisabledContractTemplateListHandler = useCallback(
    (page?: number) => {
      fetchDisabledContractTemplateList({ page });
    },
    [fetchDisabledContractTemplateList],
  );

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    fetchPaymentPackTemplateList();
    fetchPrivatePassTemplateList();
  }, [fetchPaymentPackTemplateList, fetchPrivatePassTemplateList]);

  useEffect(() => {
    fetchActiveContractTemplateList();
    fetchDisabledContractTemplateList();
  }, [fetchActiveContractTemplateList, fetchDisabledContractTemplateList]);

  const handleShowDisabledContractList = useCallback(() => {
    setShowDisabledContractList(
      (previousShowDisabledContractList) => !previousShowDisabledContractList,
    );
  }, []);

  const OptionsFormatter = useCallback(
    (contractTemplateList: ContractTemplate[]) =>
      (contractTemplateList ?? []).map((contractTemplate) => ({
        label: contractTemplate.name,
        value: contractTemplate.id,
        key: contractTemplate.id,
        item: contractTemplate,
        getFranchiseCompanyListById,
        getPaymentPackTemplateById,
        getPrivatePassTemplateById,
        onClick: handleOnClickTemplate,
        contractTemplate,
      })),
    [
      getFranchiseCompanyListById,
      getPaymentPackTemplateById,
      getPrivatePassTemplateById,
    ],
  );

  const handleOpenDeleteDialog = useCallback((id: number) => {
    setSelectedContractTemplateIdToDelete(id);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setSelectedContractTemplateIdToDelete(null);
  }, []);

  const handleDeleteContractTemplate = useCallback(() => {
    deleteContractTemplate(selectedContractTemplateIdToDelete, {
      onSuccess: () => {
        fetchActiveContractTemplateListHandler();
        fetchDisabledContractTemplateListHandler();
      },
    });
    setSelectedContractTemplateIdToDelete(null);
  }, [
    deleteContractTemplate,
    fetchActiveContractTemplateListHandler,
    fetchDisabledContractTemplateListHandler,
    selectedContractTemplateIdToDelete,
  ]);

  const handleRestoreContractTemplate = useCallback(
    (id: number) => {
      restoreContractTemplate(id, {
        onSuccess: () => {
          fetchActiveContractTemplateListHandler();
          fetchDisabledContractTemplateListHandler();
        },
      });
    },
    [
      fetchActiveContractTemplateListHandler,
      fetchDisabledContractTemplateListHandler,
      restoreContractTemplate,
    ],
  );

  const handleEditContractTemplate = () => {};
  const handleOnClickTemplate = () => {};

  return (
    <div>
      <ObjectSearch
        additionalParams={{
          page_size: CONTRACT_TEMPLATE_PAGE_SIZE,
          id__in: activeContractTemplateState.list.map(
            (contractTemplate) => contractTemplate.id,
          ),
          disabled: false,
        }}
        className={classes.searchInput}
        components={{
          Option: SearchOption,
        }}
        optionsFormatter={OptionsFormatter}
        placeholder={t('contractTemplate.filter.searchPlaceholder')}
        searchedObjectType="contract_template"
        variant="underlined"
      />
      <ContractTemplateList
        contractTemplateList={activeContractTemplateState.list}
        contractTemplateNumberOfPages={
          activeContractTemplateState.numberOfPages
        }
        fetchNewPage={fetchActiveContractTemplateListHandler}
        getFranchiseCompanyListById={getFranchiseCompanyListById}
        getPaymentPackTemplateById={getPaymentPackTemplateById}
        getPrivatePassTemplateById={getPrivatePassTemplateById}
        loading={activeContractTemplateState.loading}
        onClick={handleOnClickTemplate}
        onDelete={handleOpenDeleteDialog}
        onEdit={handleEditContractTemplate}
        page={activeContractTemplateState.page}
      />
      <div>
        <div className={classes.row}>
          <Typography className={classes.sectionTitle} variant="h5">
            {`${t('contract.list.titleInactive')} (${
              disabledContractTemplateState.count
            })`}
          </Typography>
          <IconButton onClick={handleShowDisabledContractList}>
            {showDisabledContractList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        <Divider className={classes.divider} />
        {showDisabledContractList && (
          <ContractTemplateList
            contractTemplateList={disabledContractTemplateState.list}
            contractTemplateNumberOfPages={
              disabledContractTemplateState.numberOfPages
            }
            fetchNewPage={fetchDisabledContractTemplateListHandler}
            getFranchiseCompanyListById={getFranchiseCompanyListById}
            getPaymentPackTemplateById={getPaymentPackTemplateById}
            getPrivatePassTemplateById={getPrivatePassTemplateById}
            loading={disabledContractTemplateState.loading}
            onRestore={handleRestoreContractTemplate}
            page={disabledContractTemplateState.page}
          />
        )}
      </div>
      <ContractTemplateDeleteDialog
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteContractTemplate}
        open={!!selectedContractTemplateIdToDelete}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  searchInput: {
    flex: 1,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
}));

const mapStateToProps = (state: RootState) => ({
  activeContractTemplateState: {
    list: getActiveContractTemplateList(state),
    page: state.subscription.contractTemplate.active.page,
    loading: state.subscription.contractTemplate.active.loading,
    numberOfPages: state.subscription.contractTemplate.active.numberOfPages,
  },
  disabledContractTemplateState: {
    list: getDisabledContractTemplateList(state),
    page: state.subscription.contractTemplate.disabled.page,
    loading: state.subscription.contractTemplate.disabled.loading,
    count: state.subscription.contractTemplate.disabled.count,
    numberOfPages: state.subscription.contractTemplate.disabled.numberOfPages,
  },
  getPaymentPackTemplateById: (id: number) =>
    getPaymentPackTemplateByIdSelector(state, id),
  getPrivatePassTemplateById: (id: number) =>
    getPrivatePassTemplateByIdSelector(state, id),
  getFranchiseCompanyListById: (id__in: number[]) =>
    getFranchiseCompanyListByIdSelector(state, id__in),
});
const mapDispatchToProps = {
  fetchActiveContractTemplateList: fetchActiveContractTemplateListAction,
  fetchDisabledContractTemplateList: fetchDisabledContractTemplateListAction,
  deleteContractTemplate: deleteContractTemplateAction,
  restoreContractTemplate: restoreContractTemplateAction,
  fetchPaymentPackTemplateList: fetchPaymentPackTemplateListAction,
  fetchPrivatePassTemplateList: fetchPrivatePassTemplateListAction,
  fetchFranchise: fetchFranchiseAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, {}>(
  connector,
  withTranslation('subscription'),
  withTitle(({ t }) =>
    t('navigation:franchiseMenu.products.contractTemplates'),
  ),
)(FranchiseContractTemplateList);
