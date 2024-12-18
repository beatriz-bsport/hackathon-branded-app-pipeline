import React from 'react';
import { DateTime } from 'luxon';
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

const PAGE_SIZE = 25;

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
          aria-label="previous page"
          disabled={!props.pagination.previous || props.loading}
          onClick={handleGeneratePreviousPage}
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
          aria-label="next page"
          disabled={!props.pagination.next || props.loading}
          onClick={handleGenerateNextPage}
        >
          <KeyboardArrowRight />
        </IconButton>
      </div>
      <div>
        <Typography color="secondary" variant="caption">
          {props.oldestUpdate
            ? t('cachedData.oldestUpdate', {
                date: DateTime.fromSeconds(props.oldestUpdate).toFormat(
                  'EEEE, DDD t',
                ),
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
