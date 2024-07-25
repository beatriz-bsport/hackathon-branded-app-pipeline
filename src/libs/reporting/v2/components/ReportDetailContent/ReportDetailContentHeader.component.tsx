import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InformationIcon from '#src/components/InformationIcon';

import { CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES } from '#src/libs/reporting/common/constants';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Props = {
  categoryName: ReportCategoryEnum;
  handleExport: () => void;
  handleGeneration: () => void;
};

const ReportDetailContentHeader: React.FC<Props> = ({
  categoryName,
  handleExport,
  handleGeneration,
}) => {
  const { t } = useTranslation(['reporting', 'smartList']);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.titleWrapper}>
        <Typography variant="h6">
          {t('reporting:reportDetailContent.title')}
        </Typography>
        {CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES.includes(categoryName) && (
          <InformationIcon text={t(`helperText.${categoryName}`)} />
        )}
      </div>
      <div className={classes.dateWrapper}>
        {/* Date selector to be done in next commit */}
      </div>
      <Button color="secondary" startIcon={<AddIcon />} variant="text">
        {/* Quick filter logic to be added here and no translation needed*/}
        Add a quick filter
      </Button>
      <div className={classes.actionButtonsWrapper}>
        <Button
          color="secondary"
          onClick={handleGeneration}
          variant="contained"
        >
          {t('smartList:generateReport')}
        </Button>
        <Button color="secondary" onClick={handleExport} variant="outlined">
          {t('smartList:downloadReport')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
  },
  titleWrapper: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  dateWrapper: { display: 'flex' },
  actionButtonsWrapper: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default React.memo(ReportDetailContentHeader);
