import React from 'react';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

type Props = {
  itemPerPage: number;
  items: any[];
  loading?: boolean;
  nbItems: number;
  page: number;
  onPageRequested: ({
    page,
    page_size,
  }: {
    page: number;
    page_size?: number;
  }) => void;
  renderItem: (item: any) => React.JSX.Element;
  hideDefaultEmptyComponent?: boolean;
};

const useStyles = makeStyles((theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
  sectionPagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },

  paperContainer: {
    position: 'relative',
  },
  paper: {
    position: 'relative',
    zIndex: 0,
  },
}));
const PaginatedListDefaultEmptyComponent: React.FC = () => {
  const { t } = useTranslation('translation');
  const classes = useStyles();
  return (
    <div className={classes.emptyContainer}>
      <Typography color="textSecondary" variant="caption">
        {t('paginatedList.isEmpty')}
      </Typography>
    </div>
  );
};
const PaginatedListBaseReworked: React.FC<Props> = ({
  onPageRequested,
  itemPerPage,
  items,
  renderItem,
  page: pageProp,
  loading,
  nbItems,
  hideDefaultEmptyComponent,
}) => {
  const classes = useStyles();
  const handlePageRequested = React.useCallback(
    (page: number) => {
      onPageRequested({ page, page_size: itemPerPage });
    },
    [onPageRequested, itemPerPage],
  );

  // CDM
  React.useEffect(() => {
    handlePageRequested(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = React.useCallback(
    (_: React.ChangeEvent, newPage: number) => {
      onPageRequested({ page: newPage });
    },
    [onPageRequested],
  );

  if (!loading && !items?.length) {
    if (hideDefaultEmptyComponent) {
      return null;
    }
    return <PaginatedListDefaultEmptyComponent />;
  }
  return (
    <>
      <div className={classes.paperContainer}>
        {loading && <LinearProgress />}
        <Paper className={classes.paper} elevation={0}>
          <List disablePadding>
            {(items ?? []).map((item) => renderItem(item))}
          </List>
        </Paper>
      </div>
      <Pagination
        className={classes.sectionPagination}
        count={Math.ceil(nbItems / itemPerPage)}
        hideNextButton={loading}
        hidePrevButton={loading}
        onChange={handleChange}
        page={pageProp}
      />
    </>
  );
};

export default React.memo(PaginatedListBaseReworked);
