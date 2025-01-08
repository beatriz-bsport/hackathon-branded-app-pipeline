import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GlobalCategoryData } from '#src/libs/reporting/common/types';

import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CardSectionItem from '#src/components/CardSectionItem.component';
import { ReportCategoryEnum } from '@bsport/common/master-data/report-categories.js';

type Props = {
  globalCategoryData: GlobalCategoryData;
  handleGoToReport: (categoryName: ReportCategoryEnum) => () => void;
};

const ReportCategorySection: React.FC<Props> = ({
  globalCategoryData,
  handleGoToReport,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h6">
        {t(`globalCategories.${globalCategoryData.globalCategory}`)}
      </Typography>
      <div className={classes.sectionItemContainer}>
        {(globalCategoryData?.reportCategories ?? []).map((reportCategory) => (
          <CardSectionItem
            key={reportCategory.category}
            description={t(`descriptions.${reportCategory.category}`)}
            onCardClick={handleGoToReport(reportCategory.category)}
            title={t(`categories.${reportCategory.category}`)}
          />
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  sectionItemContainer: {
    display: 'grid',
    gap: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
}));

export default React.memo(ReportCategorySection);
