// @flow
import * as React from 'react';
import omit from 'lodash/omit';
import { withStateHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

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
};

const DashboardChart = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  const open = anchorEl;

  return (
    <Paper>
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
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
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
    paddingRight: theme.spacing(2),
  },
  skeleton: {
    display: 'flex',
    justifyContent: 'center',
  },
  graph: {
    paddingRight: theme.spacing(2),
  },
}));

export default withStateHandlers(
  { openFilters: {}, filtersValue: {} },
  {
    setOpenFiltersValue: ({ openFilters }) => (name: string) => {
      return {
        openFilters: {
          ...openFilters,
          [name]: !openFilters[name],
        },
      };
    },
    setFilters: ({ filtersValue }, { setChartFilters }) => (
      name: string,
      value: any,
    ) => {
      let newFilters = filtersValue;
      if (value === null) {
        newFilters = {
          filtersValue: omit(filtersValue, name),
        };
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
)(DashboardChart);
