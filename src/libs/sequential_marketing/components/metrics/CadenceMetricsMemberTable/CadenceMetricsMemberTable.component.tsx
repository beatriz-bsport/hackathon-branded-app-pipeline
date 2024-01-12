import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography/Typography';
import Pagination from '@material-ui/lab/Pagination/Pagination';

import Fuse, { FuseOptions } from 'fuse.js';
// @ts-ignore
import FuzeSearch from '#components/FuzeSearch.component';

import CadenceMetricsMemberTableContent from './CadenceMetricsMemberTableContent.component';

function createData(
  id: string,
  photo: string,
  name: string,
  currentStepName: string,
  entryDate: string,
  exitDate: string,
  status: number,
) {
  return { id, photo, name, currentStepName, entryDate, exitDate, status };
}

const membersData = [
  createData(
    '1',
    '',
    'Frozen yoghurt',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    0,
  ),
  createData(
    '2',
    '',
    'Ice cream sandwich',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    0,
  ),
  createData(
    '3',
    '',
    'Eclair',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    1,
  ),
  createData(
    '4',
    '',
    'Cupcake',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    1,
  ),
  createData(
    '5',
    '',
    'Gingerbread',
    'currentStepName',
    '25/07/2022',
    '25/07/2022',
    0,
  ),
];

type Props = { historic?: boolean };

const CadenceMetricsMemberTable: React.FC<Props> = ({ historic }) => {
  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<any>([]);
  const classes = useStyles();
  const { t } = useTranslation('marketing');
  const changeSearch =
    (fuse: Fuse<any, FuseOptions<any>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      const result = fuse.search(event.target.value);
      setSearchResult(result);
    };

  const clearSearch = React.useCallback(() => {
    setSearch('');
    setSearchResult([]);
  }, []);

  const searchedRows = React.useMemo(() => {
    if (!search) {
      return membersData;
    }
    return searchResult;
  }, [search, searchResult]);

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1">
        {historic
          ? t('audience.memberTable.historicTitle', {
              count: searchedRows.length,
            })
          : t('audience.memberTable.title', {
              count: searchedRows.length,
            })}
      </Typography>
      <FuzeSearch
        changeSearch={changeSearch}
        clearSearch={clearSearch}
        inputPropsClassName={classes.search}
        items={membersData}
        placeholder={t('audience.memberTable.searchPlaceHolder')}
        searchFields={['name']}
        searchText={search}
        variant="outlined"
      />
      <TableContainer className={classes.tableContainer}>
        <CadenceMetricsMemberTableContent
          historic={historic}
          membersData={searchedRows}
        />
        <div className={classes.footer}>
          <Pagination className={classes.pagination} count={10} size="small" />
        </div>
      </TableContainer>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    background: 'white',
    borderRadius: '5px',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  search: { padding: theme.spacing(2, 0) },
  pagination: {
    '& li': { listStyleType: 'None' },
    '& ul': { justifyContent: 'flex-end' },
  },
  footer: {
    display: 'inline-flex',
    alignSelf: 'flex-end',
    gap: theme.spacing(1),
  },
}));

export default React.memo(CadenceMetricsMemberTable);
