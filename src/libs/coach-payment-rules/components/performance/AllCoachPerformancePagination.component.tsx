import React from 'react';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  pagination: {
    page: number;
    count: number;
    next: number;
    previous: number;
  };
  loading: boolean;
  changePage: (page: number) => void;
  oldestUpdate?: null | number;
};
type Props = OwnProps;

const PAGE_SIZE = 50;

export const AllPerformancePagination = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('coachPerformance');
  const handleGeneratePreviousPage = () => {
    if (props.pagination.previous) {
      props.changePage(props.pagination.previous);
    }
  };

  const handleGenerateNextPage = () => {
    if (props.pagination.next) {
      props.changePage(props.pagination.next);
    }
  };

  return (
    <div className={classes.container}>
      <div>
        <IconButton
          onClick={handleGeneratePreviousPage}
          disabled={!props.pagination.previous || props.loading}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="caption">
          {`${(props.pagination.page - 1) * PAGE_SIZE + 1} - ${
            props.pagination.page * PAGE_SIZE > props.pagination.count
              ? props.pagination.count
              : props.pagination.page * PAGE_SIZE
          } / ${props.pagination.count} `}
        </Typography>
        <IconButton
          onClick={handleGenerateNextPage}
          disabled={!props.pagination.next || props.loading}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
      </div>
      <div>
        <Typography variant="caption" color="secondary">
          {props.oldestUpdate
            ? t('cachedData.oldestUpdate', {
                date: moment.unix(props.oldestUpdate).format('LLLL'),
              })
            : t('cachedData.undeterminedOldestUpdate')}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
}));

export default AllPerformancePagination;
