import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import { ReportHeader } from '../types';
import { getConverter } from '../utils';

const CardHeaders: React.FC<{
  headerTitle?: 'average' | 'sum';
  headerDetails: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
}> = ({ headerDetails, headerTitle }) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');

  const converters = headerDetails.map((c) => getConverter(c, classes, t));
  return (
    <div>
      <Typography className={classes.headerSectionTitle} variant="h6">
        {t(`header.${(headerTitle || '').toLowerCase()}`)}
      </Typography>
      <Grid container direction="row" spacing={2}>
        {headerDetails.map((colum, index) => {
          return (
            <Grid item xs={6} md={4} alignItems="stretch" lg={2} key={index}>
              <Card elevation={1} className={classes.cardStyle}>
                <Typography variant="body2">
                  {t(`columns.${colum.column_identifier}`)}
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: '100%',
                    paddingLeft: '2',
                  }}
                >
                  <Typography
                    variant="h5"
                    {...(converters[index](colum.column_value).cellProps || {})}
                  >
                    {converters[index](colum.column_value).value}
                  </Typography>
                </div>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

const ReportTableHeaders: React.FC<{
  reportHeaders: ReportHeader;
}> = ({ reportHeaders }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {reportHeaders &&
        reportHeaders.averageable &&
        reportHeaders.averageable.length !== 0 && (
          <CardHeaders
            headerDetails={reportHeaders.averageable}
            headerTitle="average"
          />
        )}
      {reportHeaders &&
        reportHeaders.summable &&
        reportHeaders.summable.length !== 0 && (
          <CardHeaders
            headerDetails={reportHeaders.summable}
            headerTitle="sum"
          />
        )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  headerSectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  cardStyle: {
    height: '100%',
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2.0),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2.0),
    borderLeft: '8px solid',
    borderColor: theme.palette.primary.main,
  },
}));

export default ReportTableHeaders;
