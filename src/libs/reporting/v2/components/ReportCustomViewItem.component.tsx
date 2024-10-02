import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { Card, CardActionArea } from '@material-ui/core';
import classNames from 'classnames';

import type { ReportConfiguration } from '#src/libs/reporting/common/types';

type Props = {
  reportCustomView: ReportConfiguration;
  handleGoToReportV2: (categoryName: ReportCategoryEnum) => () => void;
};

const ReportCustomViewItem: React.FC<Props> = ({
  reportCustomView,
  handleGoToReportV2,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  return (
    <Card className={classes.cardItem}>
      <CardActionArea
        className={classNames(classes.withPadding, classes.cardActionArea)}
        onClick={handleGoToReportV2(reportCustomView?.category)}
      >
        <div className={classes.titleContainer}>
          <Typography className={classes.title} variant="body1">
            {reportCustomView.name}
          </Typography>
          <Typography className={classes.subtitle} variant="body2">
            {t(`categories.${reportCustomView.category}`)}
          </Typography>
        </div>
      </CardActionArea>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  cardItem: {
    margin: `${theme.spacing(1)}px 0px`,
  },
  withPadding: { padding: theme.spacing(2) },
  cardActionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    background: '#FFF',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: '#000',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
  },

  subtitle: {
    color: '#757575',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  clickableTile: {
    style: 'none',
  },
}));

export default React.memo(ReportCustomViewItem);
