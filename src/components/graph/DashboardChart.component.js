// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import { withStateHandlers, withState, withHandlers, compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Chip from '@material-ui/core/Chip';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

import ChartRange from '../../libs/dashboard/components/ChartRange.component';
import withSentryErrorReporting from '../../hocs/error-boundary.hoc';
import type { Coach } from '#libs/associated-coach/types';

type Props = {
  title: string,
  popoverText?: string,
  loading: boolean,
  filtersValue?: Object,
  openFilters: any,
  setOpenFiltersValue: (any) => void,
  setFilters: (any) => void,
  children: any,
  filtersComponent?: React.Element<any>,
  range: { start: string, end: string, kind: string },
  setDateRange: ({ start: string, end: string }) => void,
  onSaveGraph: () => void,
  onDelete: (graphIdentifier: string) => void,
  showSaveButton: (boolean) => void,
  timeSettings: string,
  graphIdentifier: string,
  coaches: Array<Coach>,
};

const DashboardChart = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation('dashboard');
  const classes = useStyles();
  const open = anchorEl;
  return (
    <>
      <div className={classes.titleRow}>
        <div className={classes.title}>
          <Typography variant="h6">{props.title}</Typography>
          {props.popoverText && (
            <InfoOutlineIcon
              className={classes.infoIcon}
              fontSize="small"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            />
          )}
        </div>
        <div className={classes.inlineContainer}>
          {!!(props.showSaveButton && !!props.onSaveGraph) && (
            <Chip
              clickable
              className={classes.saveChip}
              color="primary"
              icon={<SaveIcon />}
              label={t('save')}
              onClick={props.onSaveGraph}
              size="small"
            />
          )}

          {!!props.range && props.setDateRange ? (
            <ChartRange
              end_date={props.range.end}
              kind={props.range.kind}
              setRange={(range) => {
                props.setDateRange(props.timeSettings, range);
              }}
              start_date={props.range.start}
              timeSettings={props.timeSettings}
            />
          ) : null}
          {!!props.onDelete && (
            <IconButton
              color="primary"
              onClick={() => props.onDelete(props.graphIdentifier)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      </div>
      {props.popoverText && (
        <Popover
          disableRestoreFocus
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          classes={{ paper: classes.paper }}
          className={classes.popover}
          onClose={handlePopoverClose}
          open={open}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Typography variant="caption">{props.popoverText}</Typography>
        </Popover>
      )}
      {props.filtersComponent && (
        <div className={classes.filter}>
          <props.filtersComponent
            coaches={props.coaches}
            filters={props.filtersValue}
            open={props.openFilters}
            setFiltersValue={props.setFilters}
            setOpenValue={props.setOpenFiltersValue}
          />
          <Divider />
        </div>
      )}
      {props.loading ? (
        <div className={classes.skeleton}>
          <Skeleton
            height={
              props.children.props
                ? props.children.props.height || 400
                : props.children.find(
                    (child) => child.props && child.props.data,
                  ) &&
                  (props.children.find(
                    (child) => child.props && child.props.data,
                  ).props.height ||
                    400)
            }
            variant="text"
            // Find the graph in props.children and retrieve its height property
            // (or default wich is 400)
            width="90%"
          />
        </div>
      ) : (
        <div className={classes.graph}>{props.children}</div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: theme.spacing(1),
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  filter: {
    paddingLeft: theme.spacing(2),
  },
  skeleton: {
    display: 'flex',
    justifyContent: 'center',
  },
  graph: {
    paddingRight: theme.spacing(2),
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveChip: {
    marginRight: theme.spacing(2),
  },
}));

export default compose(
  withSentryErrorReporting,
  withState('showSaveButton', 'setShowSaveButton', false),
  withStateHandlers(
    ({ filters }) => ({ openFilters: {}, filtersValue: filters }),
    {
      setOpenFiltersValue:
        ({ openFilters }) =>
        (name: string) => {
          return {
            openFilters: {
              ...openFilters,
              [name]: !openFilters[name],
            },
          };
        },
      setFilters:
        ({ filtersValue }, { setChartFilters, setShowSaveButton }) =>
        (name: string, value: any) => {
          setShowSaveButton(true);
          let newFilters = { ...filtersValue };
          if (!value || value?.length === 0) {
            delete newFilters[name];
          } else {
            newFilters = {
              ...filtersValue,
              [name]: value,
            };
          }
          setChartFilters(newFilters);
          return { filtersValue: newFilters };
        },
    },
  ),
  withHandlers({
    setDateRange:
      ({ setDateRange, setShowSaveButton, graphIdentifier }) =>
      (timeSettings, range) => {
        if (setDateRange) {
          setShowSaveButton(true);
          setDateRange(graphIdentifier, timeSettings, range);
        }
      },
    onSaveGraph:
      ({ onSaveGraph, setShowSaveButton, graphIdentifier }) =>
      () => {
        setShowSaveButton(false);
        onSaveGraph(graphIdentifier);
      },
  }),
)(DashboardChart);
