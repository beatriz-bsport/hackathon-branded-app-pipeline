import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';

import MemberSearchBar from '#libs/member/components/MemberSearchBar.component';

import type { MemberMinimal } from '#libs/member/types';

type Props = {
  onMemberClick: (memberId: number) => void;
  searchMembers: (searchText: string, params: any, options: any) => void;
};

const MemberVisitSearchMember: React.FC<Props> = ({
  onMemberClick,
  searchMembers,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const [searchText, setSearchText] = React.useState('');

  const [searchResults, setSearchResults] = React.useState<MemberMinimal[]>([]);

  const clearSearch = React.useCallback(() => {
    setSearchText('');
    setSearchResults([]);
  }, []);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
      searchMembers(
        event.target.value,
        { hide_archived: true },
        {
          onSuccess: ({ data }: { data: MemberMinimal[] }) =>
            setSearchResults(data),
        },
      );
    },
    [searchMembers],
  );

  const onMemberSelect = React.useCallback(
    (memberId: number) => {
      onMemberClick(memberId);
      clearSearch();
    },
    [onMemberClick, clearSearch],
  );

  useEffect(() => {
    if (!searchText) {
      setSearchResults([]);
    }
  }, [searchText]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="h6">{t('memberVisit.emptyState.or')}</Typography>
        <div className={classes.memberSearch}>
          <MemberSearchBar
            fullWidth
            onChange={onChange}
            onReset={clearSearch}
            placeholder={t('memberVisit.emptyState.searchMember')}
            searchedText={searchText}
          />
          {!!searchResults?.length && (
            <List className={classes.memberList}>
              {searchResults.map((member) => (
                <ListItem
                  key={member.id}
                  button
                  className={classes.memberListItem}
                  onClick={() => onMemberSelect(member.id)}
                >
                  <ListItemText
                    primary={member.name}
                    secondary={member.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    [theme.breakpoints.up('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  memberList: {
    width: '100%',
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.grey[500],
    maxHeight: 500,
    overflow: 'scroll',
  },
  memberListItem: {},
  memberSearch: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  },
}));

export default React.memo(MemberVisitSearchMember);
