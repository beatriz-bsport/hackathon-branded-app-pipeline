import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import type { ReportConfiguration } from '#src/libs/reporting/common/types';

type Props = {
  reportCustomView: ReportConfiguration;
  handleGoToReport: (reportView: ReportConfiguration) => () => void;
};

type ItemData = {
  reportView: ReportConfiguration;
  onClick: (reportView: ReportConfiguration) => () => void;
};

const ReportV2CustomViewItem: React.FC<Props> = ({
  reportCustomView,
  handleGoToReport,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  return (
    <a
      className={clsx(classes.withPadding, classes.cardActionArea)}
      onClick={handleGoToReport(reportCustomView)}
    >
      <div className={classes.titleContainer}>
        <Typography className={classes.title} variant="body1">
          {reportCustomView.name}
        </Typography>
        <Typography className={classes.subtitle} variant="body2">
          {t(`categories.${reportCustomView.category}`)}
        </Typography>
      </div>
    </a>
  );
};

const ReportV2CustomViewSearchItem: React.ComponentType<
  OptionPropsWithData<ReportConfiguration> & {
    data: ItemData;
  }
> = (props) => {
  return (
    <ReportV2CustomViewItem
      handleGoToReport={props.data.onClick}
      reportCustomView={{ ...props.data.reportView }}
    />
  );
};

const useStyles = makeStyles(() => ({
  cardItem: {
    margin: '0px',
  },
  withPadding: { padding: '6px 16px' },
  cardActionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: '0px',
    background: '#FFF',
    '&:hover': {
      background: 'rgba(0,0,0,0.04)',
    },
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
    color: 'rgba(0,0,0,0.6)',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  clickableTile: {
    style: 'none',
  },
}));

export default React.memo(ReportV2CustomViewSearchItem);
