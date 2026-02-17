// @flow

import React from 'react';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import { withProps, compose } from 'recompose';

import { goBack, push as routerPush } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { mapFormData, unmap } from '../form.utils';
import themeSelectors from '../../libs/theme/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  upsert,
  fetchMetaActivities as fetchMetaActivitiesAction,
} from '../../libs/meta-activity/actions';
import { getWorkshop } from '../../libs/meta-activity/selectors';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getEditableSCTs } from '../../libs/category/selectors';
import MetaActivityForm from '../../libs/meta-activity/components/MetaActivityForm.component';

type Props = {
  id?: number,
  loading?: boolean,
  initial?: MetaActivity,

  SCTs: any[],

  fetchMetaActivities: () => void,
  removeImage: () => void,
  addImage: () => void,
  onSubmit: () => void,

  goToPreviousPage: () => void,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
};
const WorkshopActivityMap = {
  cover_main: 'cover_main',
  alt_cover_main: 'alt_cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  first_booking_minutes_until: 'first_booking_minutes_until',
  is_workshop: 'is_workshop',
  SCT: 'SCT',
  color: 'color',
  is_broadcast: 'is_broadcast',
  auto_discard_active: 'auto_discard_active',
  auto_discard_hours_before_start: 'auto_discard_hours_before_start',
  auto_discard_min_bookings_nb: 'auto_discard_min_bookings_nb',
  custom_restriction_rule: 'custom_restriction_rule',
};

export class WorkshopActivityEditPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMetaActivities();
  }

  render() {
    const { SCTs, loading, id, addImage, removeImage, initial } = this.props;
    const initialData = initial
      ? {
          ...unmap(initial, WorkshopActivityMap),
          SCT: initial.SCT,
        }
      : null;
    if (loading || !this.props.initial) {
      return <LinearProgress />;
    }

    return (
      <Grid container alignItems="center" justify="center">
        <Grid item lg={9} xs={12}>
          <Paper>
            <MetaActivityForm
              is_broadcast_enabled
              initial={{ ...initialData, images: (initial || {}).images || [] }}
              metaActivityNames={[]}
              onCancel={this.props.goToPreviousPage}
              onSubmit={this.props.onSubmit}
              SCTs={SCTs}
              tags={this.props.allTagsWithTagGroup}
              variant="workshop"
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withTranslation([]),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      initial: getWorkshop(state, id),
      companyTheme: themeSelectors.getTheme(state),
      SCTs: getEditableSCTs(state),
      loading: state.metaActivity.loading,
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    }),
    {
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      goToWorkshop: (id: number) =>
        routerPush(`/workshop-activity/${id}/general`),
      fetchMetaActivities: fetchMetaActivitiesAction,
    },
  ),
  withProps(({ upsertWorkshopActivity, initial, id, goToWorkshop }) => ({
    onSubmit: (values, options) => {
      const formData = mapFormData(values, WorkshopActivityMap);
      if (initial) {
        formData.append('id', initial.id);
      }
      formData.append('is_workshop', true);
      upsertWorkshopActivity(formData, {
        ...options,
        onSuccess: () => {
          if (options.onSuccess) options.onSuccess();
          goToWorkshop(id);
        },
      });
    },
  })),
  withTitle(({ t }) => t('titles:workshopActivity.workshopActivityFormPage')),
)(WorkshopActivityEditPage);
