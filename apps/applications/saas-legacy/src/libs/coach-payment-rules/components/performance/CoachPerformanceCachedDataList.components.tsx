import React from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Collapse from '@material-ui/core/Collapse';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Paper from '@material-ui/core/Paper';
import type { CoachPerformanceCachedData } from '#src/libs/coach-payment-rules/types';
import Tooltip from '#src/components/Tooltip.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { OptionCallback } from '../../../../state/types';

type Props = {
  cachedDataList: Array<CoachPerformanceCachedData>;
  selectedCachedTimestamp: null | number;
  setSelectedCachedTimestamp: (timestamp: null | number) => void;
  exportExcelPerformance: (
    params: {
      score_timestamp: number;
    },
    options?: OptionCallback & {
      backgroundDialog?: {
        message: string;
        title: string;
      };
    },
  ) => void;
};

/**
 * For legacy reasons, the backend does not always return ISO strings.
 * If the string cannot be parsed as ISO, we're using another format as a fallback
 *
 * @param {string} date
 */
const parseDate = (date: string) => {
  return DateTime.fromISO(date).isValid
    ? DateTime.fromISO(date)
    : DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ssZZ');
};

export const CoachPerformanceCachedDataList = (props: Props) => {
  const [openSection, setOptionSection] = React.useState<boolean>(false);
  const { t } = useTranslation('coachPerformance');
  const classes = useStyles();
  const handleExcelExportation = (params: { score_timestamp: number }) => {
    const backgroundDialog = {
      message: t('export.completed.message'),
      title: t('export.completed.title'),
    };

    props.exportExcelPerformance(params, {
      backgroundDialog,
    });
  };
  return (
    <div className={classes.outterContainer}>
      <ButtonBase
        disableRipple
        className={classes.flexHeader}
        disabled={!props.cachedDataList?.length}
        onClick={() => setOptionSection(!openSection)}
      >
        <div className={classes.flexHeader}>
          <SaveIcon color="primary" />
          <Typography variant="h6">
            {t('cachedData.title', {
              count: props.cachedDataList?.length,
            })}
          </Typography>
          {openSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </ButtonBase>
      <Collapse in={openSection}>
        <List>
          {props.cachedDataList?.map(
            (data: CoachPerformanceCachedData, index: number) => (
              <ListItem
                key={`cached_data_item${index}`}
                dense
                alignItems="flex-start"
                // @ts-expect-error
                ContainerComponent={
                  props.selectedCachedTimestamp === data.timestamp
                    ? Paper
                    : 'li'
                }
              >
                <ListItemText
                  primary={t('cachedData.dateSaved', {
                    date: DateTime.fromSeconds(data.timestamp).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                    ),
                  })}
                  secondary={
                    !data?.metadata?.date_start || !data?.metadata?.date_start
                      ? t('cachedData.unresolvedDaterange')
                      : t('cachedData.dateRange', {
                          startDate: parseDate(
                            data?.metadata.date_start,
                          ).toLocaleString(DateTime.DATE_SHORT),
                          endDate: parseDate(
                            data?.metadata.date_end,
                          ).toLocaleString(DateTime.DATE_SHORT),
                        })
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title={t('cachedData.enterPreviewMode')}>
                    <IconButton
                      onClick={() =>
                        props.setSelectedCachedTimestamp(data.timestamp)
                      }
                    >
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.payroll">
                    {(hasPermission: boolean) =>
                      hasPermission && (
                        <Tooltip title={t('cachedData.downloadMySavedData')}>
                          <IconButton
                            onClick={() =>
                              handleExcelExportation({
                                score_timestamp: data.score,
                              })
                            }
                          >
                            <CloudDownloadIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  </ObjectLevelPermissionProviderComponent>
                </ListItemSecondaryAction>
              </ListItem>
            ),
          )}
        </List>
      </Collapse>
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  outterContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    gap: theme.spacing(2),
  },
}));
export default CoachPerformanceCachedDataList;
