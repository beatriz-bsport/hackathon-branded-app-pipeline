import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { MuiThemeProvider } from '@material-ui/core';
import type { CallHistoryMethodAction } from 'connected-react-router';

import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

import SecondaryActionButton from '#src/components/button/SecondaryActionButton.component';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import type { SelectOption } from '#src/libs/types';
import type { ReportFilterConfig } from '#src/libs/reporting/common/types';
import { reportDetailHeaderTheme } from '#src/libs/reporting/v2/mui-theme-providers';

type Props = {
  advancedReportFilterConfig: ReportFilterConfig;
  categoryName: ReportCategoryEnum;
  pushRouter: (path: string) => CallHistoryMethodAction<[string, unknown?]>;
  reportId: number;
  handleEditDrawerOpening: () => void;
  handleAddModalOpening: () => void;
  upsertActionsDisabled: boolean;
};

const ReportDetailHeader: React.FC<Props> = ({
  advancedReportFilterConfig,
  categoryName,
  handleEditDrawerOpening,
  handleAddModalOpening,
  pushRouter,
  reportId,
  upsertActionsDisabled,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  const handleSelectOnChange = React.useCallback(
    ({ value }: SelectOption<number>) => {
      pushRouter(value.toString());
    },
    [pushRouter],
  );

  return (
    <MuiThemeProvider theme={reportDetailHeaderTheme}>
      <div className={classes.root}>
        <div className={classes.viewSelectorContainer}>
          <Typography className={classes.noTextWrap} variant="h6">
            {t('reportDetailHeader.currentView')}
          </Typography>
          <ObjectSearchComponent
            additionalParams={{ category: categoryName }}
            className={classes.search}
            initialValues={[reportId]}
            onChange={handleSelectOnChange}
            searchedObjectType="reportV2"
          />
          <div className={classes.groupedButtons}>
            <Badge
              color="error"
              invisible={
                advancedReportFilterConfig
                  ? !advancedReportFilterConfig.config.groups?.length
                  : true
              }
              variant="dot"
            >
              <IconButton
                disabled={upsertActionsDisabled}
                onClick={handleEditDrawerOpening}
              >
                <EditIcon />
              </IconButton>
            </Badge>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </div>
          <div>
            <SecondaryActionButton
              className={classes.addViewButton}
              disabled={upsertActionsDisabled}
              onClick={handleAddModalOpening}
              size="small"
              startIcon={<AddIcon />}
              variant="outlined"
            >
              <Typography className={classes.addViewLabel}>
                {t('reportDetailHeader.addView')}
              </Typography>
            </SecondaryActionButton>
          </div>
        </div>
        {advancedReportFilterConfig &&
        advancedReportFilterConfig.config.groups?.length > 0 ? (
          <Typography color="textSecondary" variant="body1">
            {t('reportDetailHeader.advancedFiltersApplied', {
              count: advancedReportFilterConfig.config.groups.length,
            })}
          </Typography>
        ) : (
          <Typography color="textSecondary" variant="body1">
            {t('reportDetailHeader.emptyAdvancedFilters')}
          </Typography>
        )}
      </div>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'column', gap: theme.spacing(0.5) },
  noTextWrap: { textWrap: 'nowrap' },
  viewSelectorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  addViewLabel: { padding: theme.spacing(0, 1) },
  addViewButton: { whiteSpace: 'nowrap' },
  groupedButtons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  search: {
    flexBasis: '100%',
  },
}));

export default React.memo(ReportDetailHeader);
