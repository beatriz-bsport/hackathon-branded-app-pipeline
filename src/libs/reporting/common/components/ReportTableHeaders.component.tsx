import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';

import { getConverter } from '#src/libs/reporting/common/utils';
import type { ReportHeader } from '#src/libs/reporting/common/types';

const SKELETON_NUMBERS = [1, 2, 3, 4];

const CardHeaders: React.FC<{
  headerTitle?: 'average' | 'sum';
  headerDetails: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
  v2?: boolean;
  hasReportBeenGenerated?: boolean;
  isLoading?: boolean;
}> = React.memo(
  ({ headerDetails, headerTitle, v2, hasReportBeenGenerated, isLoading }) => {
    const classes = useStyles();
    const { t } = useTranslation('reporting');

    const converters = (headerDetails || []).map((detail) =>
      getConverter(detail, classes, t),
    );

    if (v2) {
      return (
        <div className={classes.containerV2}>
          <Typography variant="h6">
            {t(`header.${(headerTitle || '').toLowerCase()}`)}
          </Typography>

          {!hasReportBeenGenerated && !isLoading && (
            <Typography color="textSecondary">
              {t('reportHasNotBeenGenerated')}
            </Typography>
          )}
          {isLoading && (
            <div className={classes.skeletonContainer}>
              {SKELETON_NUMBERS.map((skeletonNumber) => (
                <Skeleton
                  key={`report-skeleton-card${skeletonNumber}`}
                  height={80}
                  variant="rect"
                  width={200}
                />
              ))}
            </div>
          )}
          {hasReportBeenGenerated && !isLoading && (
            <Grid container direction="row" spacing={2}>
              {(headerDetails || []).map((detail, index) => {
                return (
                  <Grid
                    key={index}
                    item
                    alignItems="stretch"
                    lg={2}
                    md={4}
                    xs={6}
                  >
                    <Card elevation={0}>
                      <Typography color="textSecondary" variant="subtitle2">
                        {t(`columns.${detail.column_identifier}`)}
                      </Typography>
                      <Typography
                        variant="h5"
                        {...(converters[index](detail.column_value).cellProps ||
                          {})}
                      >
                        {converters[index](detail.column_value).value}
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </div>
      );
    }

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
                  <Typography color="textPrimary" variant="body2">
                    {t(`columns.${detail.column_identifier}`)}
                  </Typography>
                  <Typography
                    variant="h5"
                    {...(converters[index](detail.column_value).cellProps ||
                      {})}
                  >
                    {converters[index](detail.column_value).value}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  },
);

const ReportTableHeaders: React.FC<{
  reportHeaders: ReportHeader;
  v2?: boolean;
  hasReportBeenGenerated?: boolean;
  isLoading: boolean;
}> = ({ reportHeaders, v2 = false, hasReportBeenGenerated, isLoading }) => {
  const classes = useStyles();

  if (v2) {
    return (
      <>
        <CardHeaders
          hasReportBeenGenerated={hasReportBeenGenerated}
          headerDetails={reportHeaders.averageable}
          headerTitle="average"
          isLoading={isLoading}
          v2={v2}
        />
        <CardHeaders
          hasReportBeenGenerated={hasReportBeenGenerated}
          headerDetails={reportHeaders.summable}
          headerTitle="sum"
          isLoading={isLoading}
          v2={v2}
        />
      </>
    );
  }

  return (
    <div className={classes.container}>
      {!!reportHeaders?.averageable?.length &&
        reportHeaders.averageable.length > 0 && (
          <CardHeaders
            headerDetails={reportHeaders.averageable}
            headerTitle="average"
          />
        )}
      {!!reportHeaders?.averageable?.length &&
        reportHeaders.averageable.length > 0 && (
          <CardHeaders
            headerDetails={reportHeaders.summable}
            headerTitle="sum"
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
  containerV2: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
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
  skeletonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
}));

export default React.memo(ReportTableHeaders);
