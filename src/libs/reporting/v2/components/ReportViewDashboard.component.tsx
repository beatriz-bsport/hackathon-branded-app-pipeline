import React from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography/Typography';
import { createTheme, MuiThemeProvider } from '@material-ui/core';

import type {
  ReportConfiguration,
  ReportConfigurationPaginatedList,
} from '#src/libs/reporting/common/types';
import { PaginationFilterParams } from '#src/libs/types';
import { ErrorAndLoading } from '#src/state/types';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import ReportCustomViewItem from '#src/libs/reporting/v2/components/ReportCustomViewItem.component';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import ReportV2CustomViewSearchItem from '#src/libs/payment-packs/components/Search/ReportV2CustomViewSearchItem.component';

import { REPORT_VIEWS_FETCHING_PAGINATION_SIZE } from '#src/libs/reporting/common/constants';

type Props = {
  handleGoToReportV2: (categoryName: ReportCategoryEnum) => () => void;
  onPageRequested: (params: PaginationFilterParams) => void;
  reportViews: ReportConfiguration[];
  reportViewsPaginated: ReportConfigurationPaginatedList & ErrorAndLoading;
};

const paginatedListCustomTheme = createTheme({
  overrides: {
    MuiList: {
      root: {
        backgroundColor: 'transparent',
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: 'none',
      },
    },
  },
});

const ReportViewDashboard: React.FC<Props> = ({
  handleGoToReportV2,
  reportViews,
  onPageRequested,
  reportViewsPaginated,
}) => {
  const { t } = useTranslation('reporting');

  const handleOnPageRequested = React.useCallback(
    (params: PaginationFilterParams) => {
      onPageRequested(params);
    },
    [onPageRequested],
  );

  const formatSearchOptions = React.useCallback(
    (searchResults: ReportConfiguration[]) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        reportView: result,
        onClick: handleGoToReportV2,
      }));
    },
    [handleGoToReportV2],
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ObjectSearchComponent
        additionalParams={{ page_size: 10, is_category_default: false }}
        className={classes.searchComponent}
        components={{
          Option: ReportV2CustomViewSearchItem,
        }}
        optionsFormatter={formatSearchOptions}
        placeholder={t('search')}
        searchedObjectType="reportV2"
        variant="underlined"
      />
      <div className={classes.titleContainer}>
        <Typography variant="h5">{t('viewTab.allViews')}</Typography>
      </div>
      <MuiThemeProvider theme={paginatedListCustomTheme}>
        {reportViewsPaginated && (
          <PaginatedListBaseReworked
            itemPerPage={REPORT_VIEWS_FETCHING_PAGINATION_SIZE}
            items={reportViews}
            loading={reportViewsPaginated.loading}
            nbItems={reportViewsPaginated.count}
            onPageRequested={handleOnPageRequested}
            page={reportViewsPaginated.page}
            renderItem={(reportView: ReportConfiguration) => (
              <ReportCustomViewItem
                key={reportView.id}
                handleGoToReportV2={handleGoToReportV2}
                reportCustomView={reportView}
              />
            )}
          />
        )}
      </MuiThemeProvider>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    '& [class*="css-"][class*="-menu"]': {
      width: '70%',
      maxWidth: '600px',
    },
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  listConsumerGiftcard: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  searchComponent: {
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(ReportViewDashboard);
