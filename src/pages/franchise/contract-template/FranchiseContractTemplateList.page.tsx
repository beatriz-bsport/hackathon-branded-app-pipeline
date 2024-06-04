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

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseContractTemplateList: React.FC<Props> = ({
  activeContractTemplateState,
  disabledContractTemplateState,
  getPaymentPackTemplateById,
  getPrivatePassTemplateById,
  getFranchiseCompanyListById,
  fetchActiveContractTemplateList,
  fetchDisabledContractTemplateList,
  fetchPaymentPackTemplateList,
  fetchPrivatePassTemplateList,
  fetchFranchise,
  t,
}) => {
  const classes = useStyles();
  const [showDisabledContractList, setShowDisabledContractList] =
    useState(false);

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

  const handleDeleteContractTemplate = () => {};
  const handleEditContractTemplate = () => {};
  const handleOnClickTemplate = () => {};

  return (
    <div>
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
        onDelete={handleDeleteContractTemplate}
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
            page={disabledContractTemplateState.page}
          />
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
