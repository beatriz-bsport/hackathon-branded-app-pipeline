// @ts-nocheck
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import { getConverter } from '#libs/reporting/utils';
import type { ReportHeader } from '#libs/reporting/types';

const CardHeaders: React.FC<{
  headerTitle?: 'average' | 'sum';
  headerDetails: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
  reportCategory: string;
}> = React.memo(({ headerDetails, headerTitle, reportCategory }) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');

  const converters = (headerDetails || []).map((detail) =>
    getConverter(detail, classes, t, reportCategory),
  );

  return (
    <div>
      <Typography className={classes.headerSectionTitle} variant="h6">
        {t(`header.${(headerTitle || '').toLowerCase()}`)}
      </Typography>
      <Grid container direction="row" spacing={2}>
        {headerDetails.map((detail, index) => {
          return (
            <Grid key={index} item alignItems="stretch" lg={2} md={4} xs={6}>
              <Card className={classes.cardStyle} elevation={1}>
                <Typography variant="body2">
                  {t(`columns.${detail.column_identifier}`)}
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
                    {...(converters[index](detail.column_value).cellProps ||
                      {})}
                  >
                    {converters[index](detail.column_value).value}
                  </Typography>
                </div>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
});

const ReportTableHeaders: React.FC<{
  reportHeaders: ReportHeader;
  reportCategory: number;
}> = ({ reportHeaders, reportCategory }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {!!reportHeaders?.averageable?.length &&
        reportHeaders.averageable.length > 0 && (
          <CardHeaders
            headerDetails={reportHeaders.averageable}
            headerTitle="average"
            reportCategory={reportCategory}
          />
        )}
      {!!reportHeaders?.averageable?.length &&
        reportHeaders.averageable.length > 0 && (
          <CardHeaders
            headerDetails={reportHeaders.summable}
            headerTitle="sum"
            reportCategory={reportCategory}
          />
        )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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

export default React.memo(ReportTableHeaders);
