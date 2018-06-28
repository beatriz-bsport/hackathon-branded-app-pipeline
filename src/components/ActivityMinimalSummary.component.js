import React from 'react';

import { Grid, Button } from '@material-ui/core';

import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Sport } from '../components';

export function ActivityMinimalSummary(props) {
  const { activity, t } = props;
  const { name, id, parent_category } = activity;

  return (
    <Grid container justify="space-between">
      <Grid item>
        <Grid container direction="row" alignItems="center" spacing={8}>
          <Grid item>
            <Sport parentCategory={parent_category} noname />
          </Grid>
          <Grid item>{name}</Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Link to={`/activity/${id}`} style={{ textDecoration: 'none' }}>
          <Button variant="primary">{t('common.seeMore')}</Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default translate()(ActivityMinimalSummary);
