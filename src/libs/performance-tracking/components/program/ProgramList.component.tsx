// @ts-nocheck
import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import Fuse, { FuseOptions } from 'fuse.js';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { PerformanceTrackingProgram } from '#libs/performance-tracking/types';

import FuzeSearch from '../../../../components/FuzeSearch.component';
import ProgramMenuItem from './ProgramMenuItem.component';
import ProgramListItem from './ProgramListItem.component';

type OwnProps = {
  programList: Array<PerformanceTrackingProgram>;
  onDelete?: (program: PerformanceTrackingProgram) => void;
  onEdit?: (program: PerformanceTrackingProgram) => void;
  onRestore?: (program: PerformanceTrackingProgram) => void;
  onClickOnItem?: (program: PerformanceTrackingProgram) => void;
  programSelectedId?: number;
  isSearchDisplayed?: boolean;
  onAddProgram?: () => void;
  isLinkedToMemberProgram?: boolean;
  isLinkedToConsumer?: boolean;
  noTitle?: boolean;
  creationLoading: boolean;
};
type Props = OwnProps & WithTranslation;
export const ProgramList = (props: Props) => {
  const {
    t,
    programList,
    programSelectedId,
    isSearchDisplayed,
    isLinkedToMemberProgram,
    isLinkedToConsumer,
    noTitle,
    creationLoading,
    onAddProgram,
    onEdit,
    onDelete,
    onClickOnItem,
    onRestore,
  } = props;
  const classes = useStyles({ noTitle });
  const [isArchivedDisplayed, setIsArchivedDisplayed] =
    useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<
    PerformanceTrackingProgram[]
  >([]);
  const changeSearch =
    (
      fuse: Fuse<
        PerformanceTrackingProgram,
        FuseOptions<PerformanceTrackingProgram>
      >,
    ) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setSearch(ev.target.value);
      const result = fuse.search(
        ev.target.value,
      ) as PerformanceTrackingProgram[];
      setSearchResult(result);
    };
  let programListFiltered = [];
  if (!search && programList) {
    programListFiltered = programList;
  } else {
    programListFiltered = searchResult;
  }
  let title = t('program.title');
  if (isLinkedToConsumer) {
    title = t('program.titleForConsumer');
  }
  if (onRestore) {
    title = `${t('program.archived')} (${programList?.length})`;
  }

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.titleAndSearch}>
          {noTitle ? null : (
            <div className={classes.title}>
              <Typography variant="h5">{title}</Typography>
            </div>
          )}
          <div className={classes.end}>
            {onRestore && (
              <IconButton
                disabled={programListFiltered?.length === 0}
                onClick={() => setIsArchivedDisplayed(!isArchivedDisplayed)}
              >
                {isArchivedDisplayed ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )}
              </IconButton>
            )}
            {onAddProgram && (
              <Button
                color="primary"
                disabled={creationLoading}
                onClick={() => onAddProgram()}
                variant="outlined"
              >
                <div className={classes.row}>
                  <Add />
                  {t('program.form.addProgram')}
                </div>
              </Button>
            )}
            {isSearchDisplayed && (
              <div className={classes.search}>
                <FuzeSearch
                  changeSearch={changeSearch}
                  clearSearch={() => {
                    setSearch('');
                  }}
                  items={programList}
                  placeholder={t('form.search')}
                  searchFields={['name']}
                  searchText={search}
                />
              </div>
            )}
          </div>
        </div>
        {noTitle ? null : <Divider />}
      </div>
      {onRestore ? (
        <Collapse in={isArchivedDisplayed}>
          {programListFiltered.map((program) => (
            <Paper square>
              <ProgramListItem onRestore={onRestore} program={program} />
            </Paper>
          ))}
        </Collapse>
      ) : (
        <div>
          <Collapse in={programListFiltered.length > 0}>
            {programListFiltered.map((program) => (
              <Paper square>
                <ProgramMenuItem
                  isLinkedToMemberProgram={isLinkedToMemberProgram}
                  isSelected={program?.id === programSelectedId}
                  onClickOnItem={onClickOnItem}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  program={program}
                />
              </Paper>
            ))}
          </Collapse>
        </div>
      )}
    </div>
  );
};
const useStyles = makeStyles<Theme, { noTitle: boolean }>((theme) => ({
  titleAndSearch: (props) => ({
    marginBottom: props.noTitle ? 0 : theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  }),
  title: {
    width: '30%',
    minWidth: theme.spacing(25),
  },
  end: (props) => ({
    width: props.noTitle ? '100%' : '70%',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(3),
  }),
  container: (props) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: props.noTitle ? theme.spacing(1) : theme.spacing(3),
  }),
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  search: {
    display: 'flex',
    alignItems: 'center',
    minWidth: theme.spacing(20),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramList,
);
