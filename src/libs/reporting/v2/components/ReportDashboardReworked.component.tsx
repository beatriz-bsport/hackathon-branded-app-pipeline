import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import SecondaryActionButton from '#src/components/button/SecondaryActionButton.component';
import Typography from '@material-ui/core/Typography/Typography';

import Fuse, { FuseOptions } from 'fuse.js';

import ReportCategorySection from '#src/libs/reporting/v2/components/ReportCategorySection.component';
import FuzeSearch from '#src/components/FuzeSearch.component';

import type {
  ReportMetadataValue,
  ReportMetadataValueWithLabel,
} from '#src/libs/reporting/common/types';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import { isNotReportMetadataValueWithLabel } from '#src/libs/reporting/common/utils';

type Props = {
  handleConfirmationDialogState: (bool: boolean) => () => void;
  handleGoToReportV2: (categoryName: ReportCategoryEnum) => () => void;
  metadata: ReportMetadataValue[];
};
const ReportDashboardReworked: React.FC<Props> = ({
  handleConfirmationDialogState,
  handleGoToReportV2,
  metadata,
}) => {
  const { t } = useTranslation('reporting');

  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<ReportCategoryEnum[]>(
    [],
  );

  const classes = useStyles();

  const metadataWithLabel: ReportMetadataValueWithLabel[] = React.useMemo(
    () =>
      (metadata || []).map((reportCategory) => ({
        ...reportCategory,
        label: t(`categories.${reportCategory.category}`),
      })),
    [metadata, t],
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
      (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearch(ev.target.value);
        const results = fuse.search(ev.target.value);
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
      <div className={classes.titleContainer}>
        <Typography variant="h5">{t('pageTitle')}</Typography>
        <SecondaryActionButton onClick={handleConfirmationDialogState(true)}>
          {t('versionSwitcher.fromNewToOld')}
        </SecondaryActionButton>
      </div>
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
            handleGoToReportV2={handleGoToReportV2}
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

export default React.memo(ReportDashboardReworked);
