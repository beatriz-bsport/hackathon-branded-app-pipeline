import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import DelayedTextField from '#src/components/DelayedTextField.component';
import { CadenceMetricsSizes } from '#src/libs/sequential_marketing/constants';

import type {
  CadenceMembersInData,
  CadenceMembersOutData,
  CadenceStep,
} from '#src/libs/sequential_marketing/types';
import type { Member } from '#src/libs/member/types';
import CadenceMetricsMemberTableContent from './CadenceMetricsMemberTableContent.component';

type Props = {
  isHistoric?: boolean;
  loading?: boolean;
  membersById: {
    [id: string]: Member<number, number>;
  };
  membersInData?: CadenceMembersInData[];
  membersOutData?: CadenceMembersOutData[];
  page: number | null;
  searchText: string;
  totalMembers: number;
  totalPages: number;
  getCadenceStep: (stepId: number) => CadenceStep;
  setSearch: (search: string) => void;
  updatePageNumber: (page: number) => void;
};

const CadenceMetricsMemberTable: React.FC<Props> = ({
  isHistoric,
  loading,
  membersById,
  membersInData,
  membersOutData,
  page,
  searchText,
  totalMembers,
  totalPages,
  getCadenceStep,
  setSearch,
  updatePageNumber,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = event.target.value;
    setSearch(newSearchText);
  };

  const clearSearch = React.useCallback(() => setSearch(''), [setSearch]);

  const handleChangePage = React.useCallback(
    (_: React.ChangeEvent<unknown> | null, newPage: number) =>
      page !== newPage && updatePageNumber(newPage),
    [page, updatePageNumber],
  );

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="subtitle1">
        {isHistoric
          ? t('audience.memberTable.historicTitle', {
              count: totalMembers,
            })
          : t('audience.memberTable.title', {
              count: totalMembers,
            })}
      </Typography>
      <DelayedTextField
        fullWidth
        autoFocus={false}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchText ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={searchText ? 'Clear search' : 'Search'}
                onClick={clearSearch}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        onChange={changeSearch}
        placeholder={t('audience.memberTable.searchPlaceHolder')}
        value={searchText || ''}
        variant="outlined"
      />
      <TableContainer className={classes.tableContainer}>
        <CadenceMetricsMemberTableContent
          getCadenceStep={getCadenceStep}
          isHistoric={isHistoric}
          membersById={membersById}
          membersInData={!isHistoric && !!membersInData ? membersInData : null}
          membersOutData={
            isHistoric && !!membersOutData ? membersOutData : null
          }
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
  title: {
    fontWeight: 500,
  },
  input: {
    display: 'flex',
    height: CadenceMetricsSizes.MEMBER_TABLE_SEARCH_HEIGHT,
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
