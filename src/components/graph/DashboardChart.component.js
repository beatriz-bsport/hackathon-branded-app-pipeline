// @flow
import * as React from 'react';
import { withStateHandlers, withState, withHandlers, compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import SaveIcon from '@material-ui/icons/Save';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import ChartRange from '../../libs/dashboard/components/ChartRange.component';

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
  setRange: ({ start: string, end: string }) => void,
  save: () => void,
  showSaveButton: (boolean) => void,
  timeSettings: string,
};

const DashboardChart = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation(['dashboard']);
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
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              fontSize="small"
            />
          )}
        </div>
        <div className={classes.inlineContainer}>
          {props.showSaveButton ? (
            <Chip
              className={classes.saveChip}
              icon={<SaveIcon />}
              color="primary"
              label={t('save')}
              onClick={props.save}
              size="small"
              clickable
            />
          ) : null}

          {props.range ? (
            <ChartRange
              start_date={props.range.start}
              end_date={props.range.end}
              kind={props.range.kind}
              setRange={props.setRange}
              timeSettings={props.timeSettings}
            />
          ) : null}
        </div>
      </div>
      {props.popoverText && (
        <Popover
          className={classes.popover}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          classes={{ paper: classes.paper }}
        >
          <Typography variant="caption">{props.popoverText}</Typography>
        </Popover>
      )}
      {props.filtersComponent && (
        <div className={classes.filter}>
          <props.filtersComponent
            setFiltersValue={props.setFilters}
            filters={props.filtersValue}
            open={props.openFilters}
            setOpenValue={props.setOpenFiltersValue}
          />
          <Divider />
        </div>
      )}
      {props.loading ? (
        <div className={classes.skeleton}>
          <Skeleton
            variant="text"
            width="90%"
            // Find the graph in props.children and retrieve its height property
            // (or default wich is 400)
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
  },
  saveChip: {
    marginRight: theme.spacing(2),
  },
}));

export default compose(
  withState('showSaveButton', 'setShowSaveButton', false),
  withStateHandlers(
    ({ filters }) => ({ openFilters: {}, filtersValue: filters }),
    {
      setOpenFiltersValue: ({ openFilters }) => (name: string) => {
        return {
          openFilters: {
            ...openFilters,
            [name]: !openFilters[name],
          },
        };
      },
      setFilters: (
        { filtersValue },
        { setChartFilters, setShowSaveButton },
      ) => (name: string, value: any) => {
        setShowSaveButton(true);
        let newFilters = { ...filtersValue };
        if (value === null) {
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
    setRange: ({ setRange, setShowSaveButton }) => (r) => {
      if (setRange) {
        setShowSaveButton(true);
        setRange(r);
      }
    },
    save: ({ save, setShowSaveButton }) => () => {
      setShowSaveButton(false);
      save();
    },
  }),
)(DashboardChart);
