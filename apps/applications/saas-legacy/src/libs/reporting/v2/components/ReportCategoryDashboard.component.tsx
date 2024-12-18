import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography/Typography';

import Fuse, { FuseOptions } from 'fuse.js';

import ReportCategorySection from '#src/libs/reporting/v2/components/ReportCategorySection.component';
import FuzeSearch from '#src/components/FuzeSearch.component';

import type {
  ReportMetadataValue,
  ReportMetadataValueWithLabel,
} from '#src/libs/reporting/common/types';
import type { ObjectLevelPermissions } from '#src/libs/role/types';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

import {
  getReportObjectPermissionsBasedOnCategory,
  isNotReportMetadataValueWithLabel,
} from '#src/libs/reporting/common/utils';

type Props = {
  handleGoToReport: (categoryName: ReportCategoryEnum) => () => void;
  metadata: ReportMetadataValue[];
  // optional for franchisor
  objectLevelPermissions?: ObjectLevelPermissions;
};

const ReportCategoryDashboard: React.FC<Props> = ({
  handleGoToReport,
  metadata,
  objectLevelPermissions,
}) => {
  const { t } = useTranslation('reporting');

  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<ReportCategoryEnum[]>(
    [],
  );

  const classes = useStyles();

  const metadataWithLabel: ReportMetadataValueWithLabel[] = React.useMemo(
    () =>
      (metadata || []).reduce((acc, reportCategory) => {
        const { read: hasReadPermission } =
          getReportObjectPermissionsBasedOnCategory(
            objectLevelPermissions,
            reportCategory.category,
          );
        if (hasReadPermission) {
          acc.push({
            ...reportCategory,
            label: t(`categories.${reportCategory.category}`),
          });
        }
        return acc;
      }, []),
    [metadata, t, objectLevelPermissions],
  );

  const filteredMetadataWithSearch = React.useMemo(
    () =>
      search?.length > 0
        ? metadataWithLabel.filter((reportCategory) =>
            searchResult.includes(reportCategory.category),
          )
        : metadataWithLabel,
    [metadataWithLabel, search, searchResult],
  );

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

  const metadataGroupedByGlobalCategory = React.useMemo(
    () =>
      Object.entries(
        Object.groupBy(
          filteredMetadataWithSearch,
          ({ global_category }) => global_category,
        ),
      ).map(([globalCategory, reportCategories]) => ({
        globalCategory,
        reportCategories,
      })),
    [filteredMetadataWithSearch],
  );

  return (
    <div className={classes.root}>
      <FuzeSearch
        changeSearch={changeSearch}
        clearSearch={clearSearch}
        items={metadataWithLabel}
        placeholder={t('pageSearchPlaceholder')}
        searchFields={['label']}
        searchText={search}
      />
      {metadataGroupedByGlobalCategory.length > 0 ? (
        metadataGroupedByGlobalCategory.map((globalCategoryData) => (
          <ReportCategorySection
            key={globalCategoryData.globalCategory}
            globalCategoryData={globalCategoryData}
            handleGoToReport={handleGoToReport}
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

export default React.memo(ReportCategoryDashboard);
