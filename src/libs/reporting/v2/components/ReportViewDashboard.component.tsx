import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography/Typography';

import Fuse, { FuseOptions } from 'fuse.js';

import FuzeSearch from '#src/components/FuzeSearch.component';

import type {
  ReportConfiguration,
  ReportMetadataValueWithLabel,
} from '#src/libs/reporting/common/types';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import { isNotReportMetadataValueWithLabel } from '#src/libs/reporting/common/utils';
import ReportCustomViewItem from './ReportCustomViewItem.component';

type Props = {
  handleGoToReportV2: (categoryName: ReportCategoryEnum) => () => void;
  reportViews: ReportConfiguration[];
};

const ReportViewDashboard: React.FC<Props> = ({
  reportViews,
  handleGoToReportV2,
}) => {
  const { t } = useTranslation('reporting');

  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<ReportCategoryEnum[]>(
    [],
  );

  const classes = useStyles();

  const changeSearch = React.useCallback(
    (
        fuse: Fuse<
          ReportMetadataValueWithLabel,
          FuseOptions<ReportMetadataValueWithLabel>
        >,
      ) =>
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearch(event.target.value);
        const results = fuse.search(event.target.value);
        if (isNotReportMetadataValueWithLabel(results)) {
          setSearchResult(results.map((result) => result.item.category));
        } else setSearchResult(results.map((result) => result.category));
      },
    [],
  );

  const clearSearch = React.useCallback(() => {
    setSearch('');
    setSearchResult([]);
  }, []);

  const filteredReportViewsWithSearch = React.useMemo(
    () =>
      search?.length > 0
        ? reportViews.filter((view) => searchResult.includes(view.category))
        : reportViews,
    [reportViews, search, searchResult],
  );

  return (
    <div className={classes.root}>
      <FuzeSearch
        changeSearch={changeSearch}
        clearSearch={clearSearch}
        items={reportViews}
        placeholder={t('viewPageSearchPlaceholder')}
        searchFields={['name', 'category']}
        searchText={search}
      />
      <div className={classes.titleContainer}>
        <Typography variant="h5">All Views</Typography>
      </div>
      {filteredReportViewsWithSearch &&
      filteredReportViewsWithSearch.length > 0 ? (
        filteredReportViewsWithSearch.map((view) => (
          <ReportCustomViewItem
            key={view.id}
            handleGoToReportV2={handleGoToReportV2}
            reportCustomView={view}
          />
        ))
      ) : (
        <Typography align="center" color="textSecondary" variant="body1">
          {t('pageSearchEmpty')}
        </Typography>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  titleContainer: { display: 'flex', justifyContent: 'space-between' },
}));

export default React.memo(ReportViewDashboard);
