import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';

import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import QuicksaleSectionListPage from './QuicksaleSectionList.page';
import QuicksaleItemListPage from './QuicksaleItemList.page';

import { APP_HEIGHT } from '#src/pages/constants';

type Props = {
  pageHeight: number;
  fullHeight?: boolean;
};

const Quicksale: React.FC<Props> = ({ pageHeight, fullHeight = true }) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles({ pageHeight, fullHeight });

  return (
    <div className={classes.sectionListContainer}>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Switch>
        <Route
          exact
          component={QuicksaleSectionListPage}
          path="/settings/quicksale"
        />
        <Route
          exact
          component={QuicksaleItemListPage}
          path="/settings/quicksale/:sectionId"
        />
      </Switch>
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  { pageHeight: number; fullHeight?: boolean }
>(() => ({
  sectionListContainer: ({ pageHeight, fullHeight }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& > *':
      fullHeight && pageHeight ? { height: pageHeight - APP_HEIGHT } : {},
  }),
}));

export default withPageHeightHOC()(Quicksale);
