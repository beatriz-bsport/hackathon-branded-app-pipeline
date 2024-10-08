import React from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography/Typography';
import { createTheme, MuiThemeProvider } from '@material-ui/core';

import {
  ReportConfiguration,
  ReportConfigurationPaginatedList,
  ReportViewSortOption,
} from '#src/libs/reporting/common/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type { ErrorAndLoading } from '#src/state/types';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import ReportCustomViewItem from '#src/libs/reporting/v2/components/ReportCustomViewItem.component';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
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

type Option = {
  label: string;
  value: ReportViewSortOption;
};

const ReportViewDashboard: React.FC<Props> = ({
  handleGoToReportV2,
  reportViews,
  onPageRequested,
  reportViewsPaginated,
}) => {
  const { t } = useTranslation('reporting');

  const [selectedSortOption, setSelectedSortOption] = React.useState<Option>({
    label: t('reportFilter.default'),
    value: ReportViewSortOption.DEFAULT,
  });

  const sortOptions = React.useMemo(
    () => [
      {
        label: t('reportFilter.default'),
        value: ReportViewSortOption.DEFAULT,
      },
      {
        label: t('reportFilter.lastUpdated'),
        value: ReportViewSortOption.LAST_UPDATED,
      },
    ],
    [t],
  );

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

  const handleOnChange = React.useCallback(
    (selectedOption: { label: string; value: ReportViewSortOption }) => {
      setSelectedSortOption(selectedOption);
    },
    [],
  );

  const sortResults = React.useCallback(
    (reportToSort: ReportConfiguration[]) => {
      switch (selectedSortOption.value) {
        case ReportViewSortOption.LAST_UPDATED:
          return [...reportToSort].sort(
            (a, b) =>
              new Date(b.updated_at || b.date_end).getTime() -
              new Date(a.updated_at || a.date_end).getTime(),
          );
        default:
          return [...reportToSort];
      }
    },
    [selectedSortOption],
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ObjectSearchComponent
        additionalParams={{
          page_size: REPORT_VIEWS_FETCHING_PAGINATION_SIZE,
          is_category_default: false,
        }}
        className={classes.searchComponent}
        components={{
          Option: ReportV2CustomViewSearchItem,
        }}
        optionsFormatter={formatSearchOptions}
        placeholder={t('search')}
        searchedObjectType="reportV2"
        variant="underlined"
      />
      <div className={classes.selector}>
        <MaterialUISelector
          onChange={handleOnChange}
          options={sortOptions}
          value={selectedSortOption}
        />
      </div>
      <div className={classes.titleContainer}>
        <Typography variant="h5">{t('viewTab.allViews')}</Typography>
      </div>
      {reportViewsPaginated && reportViews && reportViews.length > 0 ? (
        <MuiThemeProvider theme={paginatedListCustomTheme}>
          {reportViewsPaginated && (
            <PaginatedListBaseReworked
              itemPerPage={REPORT_VIEWS_FETCHING_PAGINATION_SIZE}
              items={sortResults(reportViews)}
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
      ) : (
        <div className={classes.noViewsContainer}>
          <Typography variant="body1">
            {t('reporting:viewTab.noCustomViews')}
          </Typography>
        </div>
      )}
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
  noViewsContainer: {
    display: 'flex',
    justifyContent: 'center',
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
  selector: { maxWidth: '150px' },
}));

export default React.memo(ReportViewDashboard);
