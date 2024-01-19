import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography/Typography';
import Pagination from '@material-ui/lab/Pagination/Pagination';
import LinearProgress from '@material-ui/core/LinearProgress';

import Fuse, { FuseOptions } from 'fuse.js';
// @ts-ignore
import FuzeSearch from '#components/FuzeSearch.component';

import CadenceMetricsMemberTableContent from './CadenceMetricsMemberTableContent.component';
import type {
  CadenceMembersInData,
  CadenceMembersOutData,
  CadenceStep,
} from '#libs/sequential_marketing/types';
import type { Member } from '#libs/member/types';

type Props = {
  isHistoric?: boolean;
  loading?: boolean;
  membersById: {
    [id: string]: Member<number, number>;
  };
  membersData: CadenceMembersInData[] | CadenceMembersOutData[];
  page: number | null;
  totalMembers: number;
  totalPages: number;
  getCadenceStep: (stepId: number) => CadenceStep;
  updatePageNumber: (page: number) => void;
};

const CadenceMetricsMemberTable: React.FC<Props> = ({
  isHistoric,
  loading,
  membersById,
  membersData,
  page,
  totalMembers,
  totalPages,
  getCadenceStep,
  updatePageNumber,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const [search, setSearch] = React.useState('');

  const [searchResult, setSearchResult] = React.useState<any>([]);

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

  const handleChangePage = React.useCallback(
    (_: React.ChangeEvent<unknown> | null, newPage: number) => {
      if (page !== newPage) {
        updatePageNumber(newPage);
      }
    },
    [page, updatePageNumber],
  );

  const searchedRows = React.useMemo(() => {
    if (!search) {
      return membersData;
    }
    return searchResult;
  }, [membersData, search, searchResult]);

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1">
        {isHistoric
          ? t('audience.memberTable.historicTitle', {
              count: totalMembers,
            })
          : t('audience.memberTable.title', {
              count: totalMembers,
            })}
      </Typography>
      <FuzeSearch
        disableAutoFocus
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
          getCadenceStep={getCadenceStep}
          isHistoric={isHistoric}
          membersById={membersById}
          membersInData={!isHistoric ? searchedRows : null}
          membersOutData={isHistoric ? searchedRows : null}
        />
        {loading ? <LinearProgress /> : null}
        <div className={classes.footer}>
          <Pagination
            className={classes.pagination}
            count={totalPages}
            onChange={handleChangePage}
            page={page ?? 1}
            size="small"
          />
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
