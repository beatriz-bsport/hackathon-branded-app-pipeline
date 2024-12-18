import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ConditionalWrapper from '#src/components/ConditionnalWrapper.component';
import MemberSearchBar from '#src/libs/member/components/MemberSearchBar.component';

import type { MemberMinimal } from '#src/libs/member/types';

type Props = {
  disabled?: boolean;
  displayDropDownInPopover?: boolean;
  onClearSearch?: () => void;
  onMemberClick: (memberId: number) => void;
  reducedWidth?: boolean;
  searchMembers: (searchText: string, params: any, options: any) => void;
  title?: string;
};

const MemberVisitSearchMember: React.FC<Props> = ({
  disabled,
  displayDropDownInPopover,
  onClearSearch,
  onMemberClick,
  reducedWidth,
  searchMembers,
  title,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles({
    reducedWidth,
    displayDropDownInPopover,
  });

  const [searchText, setSearchText] = React.useState('');

  const [searchResults, setSearchResults] = React.useState<MemberMinimal[]>([]);

  const clearSearch = useCallback(() => {
    setSearchText('');
    setSearchResults([]);
    onClearSearch?.();
  }, [setSearchText, setSearchResults, onClearSearch]);

  const onChange = useCallback(
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

  const onMemberSelect = useCallback(
    (member: MemberMinimal) => {
      onMemberClick(member.id);
      setSearchText((_searchText) => {
        if (member?.name.replace(/\s/g, '')?.length) {
          return member.name;
        }
        if (member?.email?.replace(/\s/g, '')?.length) {
          return member.email;
        }
        return _searchText;
      });
      setSearchResults([]);
    },
    [onMemberClick, setSearchResults],
  );

  useEffect(() => {
    if (!searchText) {
      setSearchResults([]);
    }
  }, [searchText, setSearchResults]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {!!title && <Typography variant="h6">{title}</Typography>}
        <div className={classes.memberSearch}>
          <MemberSearchBar
            fullWidth
            autoFocus={false}
            disabled={disabled}
            onChange={onChange}
            onReset={clearSearch}
            placeholder={t('memberVisit.emptyState.searchMember')}
            searchedText={searchText}
          />
          {!!searchResults?.length && (
            <ConditionalWrapper
              condition={displayDropDownInPopover}
              wrapper={(children) => (
                <div style={{ position: 'relative' }}>{children}</div>
              )}
            >
              <ClickAwayListener onClickAway={clearSearch}>
                <Paper className={classes.memberListContainer} elevation={8}>
                  <List className={classes.memberList}>
                    {searchResults.map((member) => (
                      <ListItem
                        key={member.id}
                        button
                        className={classes.memberListItem}
                        onClick={() => onMemberSelect(member)}
                      >
                        <ListItemText
                          primary={member.name}
                          secondary={member.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </ClickAwayListener>
            </ConditionalWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  {
    displayDropDownInPopover?: boolean;
    reducedWidth?: boolean;
  }
>((theme) => ({
  root: {
    width: ({ reducedWidth }) => (reducedWidth ? 400 : '100%'),
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    [theme.breakpoints.up('md')]: {
      width: ({ reducedWidth }) => (reducedWidth ? '100%' : '70%'),
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
    maxHeight: 500,
    overflow: 'scroll',
  },
  memberListItem: {},
  memberListContainer: {
    width: '100%',

    position: ({ displayDropDownInPopover }) =>
      displayDropDownInPopover ? 'absolute' : 'relative',
    zIndex: ({ displayDropDownInPopover }) =>
      displayDropDownInPopover ? 99999 : 1,

    borderColor: theme.palette.grey[300],
    borderWidth: 2,
    borderRadius: theme.spacing(1),
  },
  memberSearch: {
    display: 'flex',
    flexDirection: 'column',
    gap: ({ displayDropDownInPopover }) =>
      displayDropDownInPopover ? 0 : theme.spacing(1),
    width: '100%',
  },
}));

export default React.memo(MemberVisitSearchMember);
