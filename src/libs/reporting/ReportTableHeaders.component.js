import React from 'react';

import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { getConverter } from './ReportTable.component';

function CardHeaders(props: Props) {
  const { headerDetails, headerTitle, classes, t } = props;
  const converters = headerDetails.map((c) => getConverter(c, classes, t));
  return (
    <div>
      <Typography className={classes.headerSectionTitle} variant="h6">
        {t(`header.${(headerTitle || '').toLowerCase()}`)}
      </Typography>
      <Grid container direction="row" spacing={1}>
        {headerDetails.map((colum, index) => (
          <Grid item xs={6} md={4} lg={2}>
            <Card
              key={index}
              elevation={1}
              className={classes.cardStyle}
              borderColor="#888"
            >
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
                  className={classes.typographyValue}
                  {...(converters[index](colum.column_value).cellProps || {})}
                >
                  {converters[index](colum.column_value).value}
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
export function ReportTableHeaders(props: Props) {
  const { classes, t, reportHeaders } = props;
  return (
    <div className={classes.container}>
      {reportHeaders &&
      reportHeaders.averageable &&
      reportHeaders.averageable.length !== 0 ? (
        <CardHeaders
          headerDetails={reportHeaders.averageable}
          headerTitle="average"
          classes={classes}
          t={t}
        />
      ) : null}
      {reportHeaders &&
      reportHeaders.summable &&
      reportHeaders.summable.length !== 0 ? (
        <CardHeaders
          headerDetails={reportHeaders.summable}
          t={t}
          headerTitle="sum"
          classes={classes}
        />
      ) : null}
    </div>
  );
}

const styles = (theme) => ({
  container: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  headerSectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  cardStyle: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2.0),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2.0),
    borderLeft: '8px solid',
    borderColor: theme.palette.primary.main,
  },
});

export default withStyles(styles)(
  withTranslation(['reporting'])(ReportTableHeaders),
);
