// @flow

import React from 'react';
import { compose, withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';

import { push as pushRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import PaymentPackForm from '../../libs/payment-packs/components/PaymentPackForm.component';
import { getPaymentPackById } from '../../libs/payment-packs/selectors';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
  getActivitiesByIdList,
} from '../../libs/meta-activity/selectors';
import {
  fetchAllActivities,
  fetchMetaActivityBulk,
  fetchAll as fetchWorkhops,
} from '../../libs/meta-activity/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';
import {
  createOrUpdate as createOrUpdatePaymentPack,
  fetchOne as fetchPaymentPack,
} from '../../libs/payment-packs/actions';
import withTitle from '../../hocs/with-title.hoc';
import type { SCT, MetaActivity } from '../../api/types';

type Props = {
  loading: boolean,
  categories: Array<SCT>,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  fetchAllActivities: () => void,
  fetchWorkhops: () => void,
  onSubmit: () => void,
  initial: ?PaymentPack,
  classes: Object,
  fetchPaymentPack: (id: number, options: OptionCallback) => void,
  paymentPackId: number,
  fetchMetaActivityBulk: (Array<number>) => void,
};

export class PaymentPackFormPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentPack(this.props.paymentPackId, {
      onSuccess: (pp) => {
        this.props.fetchMetaActivityBulk(pp.metaActivities);
      },
    });
    this.props.fetchEstablishments();
    this.props.fetchAllActivities({ customer_enabled: true });
    this.props.fetchWorkhops();
  }

  render() {
    const {
      categories,
      metaActivities,
      loading,
      establishments,
      onSubmit,
      initial,
      paymentPackId,
    } = this.props;

    if (loading || (!!paymentPackId && !initial)) {
      return <LinearProgress />;
    }
    const availableCategoriesId = metaActivities.map((a) => a.SCT);
    const filterableCategories = categories.filter(
      (c) =>
        availableCategoriesId.indexOf(c.id) !== -1 ||
        (initial && initial.categories.includes(c.id)),
    );

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        className={this.props.classes.container}
      >
        <Grid item xs={12} md={8} style={{ width: '100%' }}>
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
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
});

export default compose(
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackFormPage'),
  ),
  withStyles(styles),
  mapRouterParamsToProps({ id: 'paymentPackId:number' }),
  connect(
    (state, { paymentPackId }) => {
      const paymentPackInitial = getPaymentPackById(state)[paymentPackId];
      return {
        initial: paymentPackId !== null ? paymentPackInitial : null,
        categories: state.category.SCTs,
        metaActivities: uniqBy(
          [
            ...getEnabledMetaActivities(state),
            ...getEnabledWorkshops(state),
            ...getActivitiesByIdList(
              state,
              (paymentPackInitial && paymentPackInitial.metaActivities) || [],
            ),
          ],
          'id',
        ),
        establishments: getAllEstablishments(state),
        loading: state.paymentPack.loading,
      };
    },
    {
      fetchEstablishments,
      fetchAllActivities,
      fetchMetaActivityBulk,
      fetchPaymentPack,
      fetchWorkhops,
      createOrUpdate: createOrUpdatePaymentPack,
      push: pushRouter,
    },
  ),
  withProps(({ createOrUpdate, push }) => ({
    onSubmit: (data, options = {}) => {
      createOrUpdate(data, {
        ...options,
        onSuccess: (pp) => {
          push(`/payment-pack/${pp.id}`);
          if (options.onSuccess) options.onSuccess();
        },
      });
    },
  })),
)(PaymentPackFormPage);
