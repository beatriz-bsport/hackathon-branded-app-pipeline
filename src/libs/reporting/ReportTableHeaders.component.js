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
    <Grid item xs={12}>
      <Typography>{headerTitle}</Typography>
      {headerDetails.map((average, index) => (
        <Grid xs={2}>
          <Card
            key={index}
            elevation={1}
            className={classes.cardStyle}
            borderColor="#888"
          >
            <Typography variant="subtitle1">
              {average.column_identifier.replace('_', ' ').toUpperCase()}
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
                {...(converters[index](average.column_value).cellProps || {})}
              >
                {converters[index](average.column_value).value}
              </Typography>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
export function ReportTableHeaders(props: Props) {
  const { classes, reportHeaders } = props;
  return (
    <Grid container spacing={1} xs={12} direction="column" alignItems="left">
      {reportHeaders ? (
        <CardHeaders
          headerDetails={reportHeaders.averageable}
          headerTitle="AVERAGE"
          classes={classes}
        />
      ) : null}
      {reportHeaders ? (
        <CardHeaders
          headerDetails={reportHeaders.summable}
          headerTitle="SUM"
          classes={classes}
        />
      ) : null}
    </Grid>
  );
}

const styles = (theme) => ({
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
  withTranslation(['headers'])(ReportTableHeaders),
);
