// @flow

import React from 'react';
import { compose, withProps } from 'recompose';

import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import PaymentPackForm from '../../libs/payment-packs/PaymentPackForm.component';
import paymentPackSelectors from '../../libs/payment-packs/selectors';
import { paymentPack as paymentPackActions } from '../../actions';
import withDrawer from '../../hocs/with-drawer.hoc';
import type { SCT, MetaActivity } from '../../api/types';

type Props = {
  loading: boolean,
  categories: Array<SCT>,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  onSubmit: () => void,
  initial: ?PaymentPack,
};

export function PaymentPackFormPage(props: Props) {
  const {
    categories,
    metaActivities,
    loading,
    establishments,
    onSubmit,
    initial,
  } = props;
  const availableCategoriesId = metaActivities.map((a) => a.category_id);
  const filterableCategories = categories.filter(
    (c) => availableCategoriesId.indexOf(c.id) !== -1,
  );

  return (
    <Grid container>
      <Grid item xs={12} md={8}>
        <Paper>
          <PaymentPackForm
            onSubmit={onSubmit}
            categories={filterableCategories || []}
            metaActivities={metaActivities}
            establishments={establishments}
            loading={loading}
            initial={initial}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default compose(
  withNamespaces(),
  mapRouterParamsToProps({ id: 'paymentPackId:number' }),
  connect(
    (state, { paymentPackId }) => ({
      initial:
        paymentPackId !== null
          ? paymentPackSelectors.get(state, paymentPackId)
          : null,
      categories: state.category.SCTs,
      metaActivities: [
        ...(state.metaActivity.all || []),
        ...(state.workshopActivity.all || []),
      ],
      establishments: state.establishment.all,
      loading: state.paymentPack.createOrUpdatePending,
    }),
    {
      fetchPaymentPacks: paymentPackActions.fetchAll,
      createOrUpdate: paymentPackActions.createOrUpdate,
      previousPage: goBack,
    },
  ),
  withProps(({ createOrUpdate, previousPage, fetchPaymentPacks }) => ({
    onSubmit: (data, options = {}) => {
      createOrUpdate(data, {
        ...options,
        onSuccess: () => {
          fetchPaymentPacks();
          if (options.onSuccess) options.onSuccess();
          previousPage();
        },
      });
    },
  })),
  withDrawer(({ t }: { t: TFunction }) =>
    t('appbar.title.paymentPackFormPage'),
  ),
)(PaymentPackFormPage);
