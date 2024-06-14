import React, { useCallback, useEffect } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushAction } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';

import withTitle from '#src/hocs/with-title.hoc';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import type { RootState } from '#src/reducers';

import { fetchContractTemplateDetail as fetchContractTemplateDetailAction } from '#src/libs/subscription//actions';
import { retrievePrivatePassTemplate as retrievePrivatePassTemplateAction } from '#src/libs/private-service/actions';
import { retrievePaymentPackTemplate as retrievePaymentPackTemplateAction } from '#src/libs/payment-packs/actions';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';

import { getPrivatePassTemplateById as getPrivatePassTemplateByIdSelector } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentPackTemplateById as getPaymentPackTemplateByIdSelector } from '#src/libs/payment-packs/selectors';
import { getFranchiseCompanyListById as getFranchiseCompanyListByIdSelector } from '#src/libs/franchise/selectors';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ContractTemplateDetail from '#src/libs/subscription/franchise-components/ContractTemplateDetail.component';
import { getActiveContractTemplateById } from '#src/libs/subscription/selectors';

type Params = {
  selectedContractTemplateId: number;
};

type Props = ConnectedProps<typeof connector> & Params & WithTranslation;

const FranchiseContractTemplateDetail: React.FC<Props> = ({
  selectedContractTemplateId,
  selectedContractTemplateState,
  contractTemplate,
  getPrivatePassTemplateById,
  getPaymentPackTemplateById,
  getFranchiseCompanyListById,
  push,
  fetchFranchise,
  fetchContractTemplateDetail,
  retrievePrivatePassTemplate,
  retrievePaymentPackTemplate,
}) => {
  const classes = useStyles();

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    fetchContractTemplateDetail(selectedContractTemplateId);
  }, [fetchContractTemplateDetail, selectedContractTemplateId]);

  const { private_pass_template, payment_pack_template } =
    contractTemplate || {};

  useEffect(() => {
    private_pass_template && retrievePrivatePassTemplate(private_pass_template);
    payment_pack_template && retrievePaymentPackTemplate(payment_pack_template);
  }, [
    retrievePrivatePassTemplate,
    retrievePaymentPackTemplate,
    private_pass_template,
    payment_pack_template,
  ]);

  const onPaymentPackTemplateClick = useCallback(
    (id: number) => {
      push(`/f/payment-pack-template/${id}`);
    },
    [push],
  );

  const onPrivatePassTemplateClick = useCallback(
    (id: number) => {
      push(`/f/private-pass-template/${id}`);
    },
    [push],
  );

  if (selectedContractTemplateState.loading) {
    return <LinearProgress />;
  }

  return (
    <Grid container alignItems="stretch" spacing={3}>
      <Grid className={classes.detailContainer} md={6} xs={12}>
        <ContractTemplateDetail
          contractTemplate={contractTemplate}
          getFranchiseCompanyListById={getFranchiseCompanyListById}
          getPaymentPackTemplateById={getPaymentPackTemplateById}
          getPrivatePassTemplateById={getPrivatePassTemplateById}
          onPaymentPackTemplateClick={onPaymentPackTemplateClick}
          onPrivatePassTemplateClick={onPrivatePassTemplateClick}
        />
      </Grid>
      <Grid md={6} xs={12}></Grid>
    </Grid>
  );
};

const mapStateToProps = (
  state: RootState,
  { selectedContractTemplateId }: { selectedContractTemplateId: number },
) => ({
  selectedContractTemplateState: {
    loading: state.subscription.contractTemplate?.detail.loading,
    error: state.subscription.contractTemplate?.detail.error,
  },
  contractTemplate: getActiveContractTemplateById(
    state,
    selectedContractTemplateId,
  ),
  getPrivatePassTemplateById: (id: number) =>
    getPrivatePassTemplateByIdSelector(state, id),
  getPaymentPackTemplateById: (id: number) =>
    getPaymentPackTemplateByIdSelector(state, id),
  getFranchiseCompanyListById: (id__in: number[]) =>
    getFranchiseCompanyListByIdSelector(state, id__in),
});

const mapDispatchToProps = {
  fetchContractTemplateDetail: fetchContractTemplateDetailAction,
  retrievePrivatePassTemplate: retrievePrivatePassTemplateAction,
  retrievePaymentPackTemplate: retrievePaymentPackTemplateAction,
  fetchFranchise: fetchFranchiseAction,
  push: pushAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default compose(
  routerParamsToProps({
    selectedContractTemplateId: 'selectedContractTemplateId:number',
  }),
  connector,
  withTranslation('subscription'),
  withTitle(({ t }) =>
    t('navigation:franchiseMenu.products.contractTemplates'),
  ),
)(FranchiseContractTemplateDetail);
