// @flow

import React from 'react';
import { compose, withProps } from 'recompose';

import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import PaymentPackForm from '../../libs/payment-packs/components/PaymentPackForm.component';
import paymentPackSelectors from '../../libs/payment-packs/selectors';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '../../libs/meta-activity/selectors';
import { fetchAllActivities } from '../../libs/meta-activity/actions/meta-activity.actions';
import { fetchAll as fetchWorkhops } from '../../libs/meta-activity/actions/workshop-activity.actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import type { Establishment } from '../../libs/establishment/types';
import {
  createOrUpdate as createOrUpdatePaymentPack,
  fetchAllPaymentPacks as fetchAllPaymentPacksAction,
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
};

export class PaymentPackFormPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAllActivities();
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
    } = this.props;
    const availableCategoriesId = metaActivities.map((a) => a.SCT);
    const filterableCategories = categories.filter(
      (c) => availableCategoriesId.indexOf(c.id) !== -1,
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
    paddingBottom: theme.spacing.unit * 16,
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
    (state, { paymentPackId }) => ({
      initial:
        paymentPackId !== null
          ? paymentPackSelectors.get(state, paymentPackId)
          : null,
      categories: state.category.SCTs,
      metaActivities: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ],
      establishments: getAllEstablishments(state),
      loading: state.paymentPack.createOrUpdatePending,
    }),
    {
      fetchAllPaymentPacks: fetchAllPaymentPacksAction,
      fetchEstablishments,
      fetchAllActivities,
      fetchWorkhops,
      createOrUpdate: createOrUpdatePaymentPack,
      previousPage: goBack,
    },
  ),
  withProps(({ createOrUpdate, previousPage, fetchAllPaymentPacks }) => ({
    onSubmit: (data, options = {}) => {
      createOrUpdate(data, {
        ...options,
        onSuccess: () => {
          fetchAllPaymentPacks();
          if (options.onSuccess) options.onSuccess();
          previousPage();
        },
      });
    },
  })),
)(PaymentPackFormPage);
