// @flow

import React from 'react';
import { compose, withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';

import { push as pushRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import themeSelectors from '../../libs/theme/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import PaymentPackForm from '../../libs/payment-packs/components/PaymentPackForm.component';
import {
  getPaymentPackById,
  getAllPaymentPackCategory,
} from '../../libs/payment-packs/selectors';
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
import { Establishment } from '../../libs/establishment/types';
import {
  createOrUpdate as createOrUpdatePaymentPack,
  fetchOne as fetchPaymentPack,
  fetchAllPaymentPackCategory,
} from '../../libs/payment-packs/actions';

import withTitle from '../../hocs/with-title.hoc';
import type { SCT, MetaActivity } from '../../api/types';
import { fetchVideoFilterableParams as fetchVideoFilterableParamsAction } from '../../libs/video/actions';
import type {
  PaymentPack,
  PaymentPackCategory,
} from '../../libs/payment-packs/types';
import {
  fetchAllGroups as fetchAllTagGroups,
  fetchAllTags,
} from '../../libs/tag/actions';
import { getallTagsWithTagGroup } from '../../libs/tag/selectors';
import type { Tag } from '../../libs/tag/types';

type Props = {
  loading: boolean,
  categories: Array<SCT>,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  fetchEstablishments: () => void,
  fetchAllActivities: () => void,
  fetchWorkhops: () => void,
  onSubmit: () => void,
  onCancel: () => void,
  initial: ?PaymentPack,
  classes: Object,
  fetchPaymentPack: (id: number, options: OptionCallback) => void,
  paymentPackId: number,
  fetchMetaActivityBulk: (Array<number>) => void,
  fetchVideoFilterableParams: (params: any) => void,
  videoSCTs: Array<number>,
  fetchAllPaymentPackCategory: () => void,
  paymentPackCategories: Array<PaymentPackCategory>,
  fetchAllTagGroups: () => void,
  fetchAllTags: () => void,
  allTagsWithTagGroup: Array<Tag>,
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
    this.props.fetchVideoFilterableParams({ mine: true });
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchAllTagGroups();
    this.props.fetchAllTags();
  }

  render() {
    const {
      videoSCTs,
      categories,
      metaActivities,
      loading,
      establishments,
      onSubmit,
      onCancel,
      initial,
      paymentPackId,
      paymentPackCategories,
      allTagsWithTagGroup,
    } = this.props;

    if (loading || (!!paymentPackId && !initial)) {
      return <LinearProgress />;
    }
    const availableCategoriesId = [
      ...metaActivities.map((a) => a.SCT),
      ...videoSCTs.map((sct) => sct.id),
    ];
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
              paymentPackCategories={paymentPackCategories}
              metaActivities={metaActivities}
              establishments={establishments}
              companyId={this.props.theme?.company}
              loading={loading}
              initial={initial}
              onCancel={onCancel}
              allTagsWithTagGroup={allTagsWithTagGroup}
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
  withTranslation(),
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
        theme: themeSelectors.getTheme(state),
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
        videoSCTs: uniqBy(state.video.filterableParams.items.SCTs, 'id'),
        paymentPackCategories: getAllPaymentPackCategory(state),
        allTagsWithTagGroup: getallTagsWithTagGroup(state),
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
      fetchVideoFilterableParams: fetchVideoFilterableParamsAction,
      fetchAllPaymentPackCategory,
      fetchAllTagGroups,
      fetchAllTags,
    },
  ),
  withProps(({ createOrUpdate, push }) => ({
    onSubmit: (data, options = {}) => {
      createOrUpdate(data, {
        ...options,
        onSuccess: () => {
          push('/payment-pack');
          if (options.onSuccess) options.onSuccess();
        },
      });
    },
    onCancel: () => {
      push('/payment-pack');
    },
  })),
)(PaymentPackFormPage);
