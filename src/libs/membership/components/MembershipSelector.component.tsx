import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useTranslation, Trans } from 'react-i18next';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinearProgress from '@material-ui/core/LinearProgress';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';
import DelayedTextField from '#components/DelayedTextField.component';

import type { Membership } from '../types';
import FuzeSearch from '#components/FuzeSearch.component';

import MembershipListItem from '#libs/membership/components/MembershipListItem.component';
import CompanyListItem from './CompanyListItem.component';
import type { Company } from '#libs/company/types';

type Props = {
  hasMore: boolean;
  loading: boolean;
  membershipList: Membership[];
  goToConsumerHome: (companyId: number) => void;
  searchCompany: (text: string) => void;
  companyLoading: boolean;
  companyList: Company[];
  fetchMoreMembership: (pageSize: number) => void;
};

type MembershipSelectorBaseProps = {
  membershipList: Membership[];
  onClick: (company: number) => void;
};

const MembershipSelectorBase: React.FC<MembershipSelectorBaseProps> = ({
  membershipList,
  onClick,
}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<Membership[]>(null);
  const { t } = useTranslation('membership');

  const changeSearch = useCallback(
    (fuse: any) => (ev: ChangeEvent<HTMLInputElement>) => {
      const newSearchText = ev.target.value || '';
      setSearchText(newSearchText);
      setSearchResult(fuse.search(newSearchText));
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchText('');
    setSearchResult(membershipList);
  }, [membershipList]);

  const selectCompany = useCallback(
    (membership: Membership) => () => {
      onClick?.(membership.company);
    },
    [onClick],
  );

  return (
    <div className={classes.selectorContainer}>
      <FuzeSearch
        changeSearch={changeSearch}
        clearSearch={clearSearch}
        items={membershipList}
        placeholder={t('selector.placeholder')}
        searchFields={['company_name']}
        searchText={searchText}
        variant="outlined"
      />
      <Paper className={classes.membershipList}>
        {!searchResult || searchResult.length === 0
          ? membershipList.map((membership) => (
              <MembershipListItem
                membership={membership}
                onClick={selectCompany(membership)}
              />
            ))
          : searchResult.map((membership) => (
              <MembershipListItem
                membership={membership}
                onClick={selectCompany(membership)}
              />
            ))}
      </Paper>
    </div>
  );
};

type CompanySelectorBaseProps = {
  classes: ClassNameMap<keyof ReturnType<typeof useStyles>>;
  companyLoading: boolean;
  searchCompany: (text: string) => void;
  companyList: Company[];
  onClick: (company: number) => void;
};

const CompanySelectorBase: React.FC<CompanySelectorBaseProps> = ({
  classes,
  companyList,
  companyLoading,
  onClick,
  searchCompany,
}) => {
  const [text, setText] = useState('');
  const { t } = useTranslation('membership');

  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      searchCompany(newText);
    },
    [setText, searchCompany],
  );

  useEffect(() => {
    handleTextChange('');
  });
  const onTextFieldChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      handleTextChange(ev.target.value);
    },
    [handleTextChange],
  );

  useEffect(() => {
    handleTextChange('');
  });

  const selectCompany = useCallback(
    (company: Company) => () => {
      onClick(company.id);
    },
    [onClick],
  );

  return (
    <div className={classes.selectorContainer}>
      <Paper>
        <DelayedTextField
          fullWidth
          className={classes.selectorContainer}
          onChange={onTextFieldChange}
          placeholder={t('selector.placeholder')}
          value={text}
          variant="outlined"
        />
      </Paper>
      <Paper className={classes.companyList}>
        {companyLoading ? <LinearProgress /> : null}
        {!companyLoading && companyList.length === 0 ? (
          <ListItem>
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText primary={t('selector.noMatchingCompany')} />
          </ListItem>
        ) : null}
        {companyList.map((company) => (
          <CompanyListItem company={company} onClick={selectCompany(company)} />
        ))}
      </Paper>
    </div>
  );
};

const MembershipSelector: React.FC<Props> = ({
  companyList,
  companyLoading,
  fetchMoreMembership,
  goToConsumerHome,
  hasMore,
  loading,
  membershipList,
  searchCompany,
}) => {
  const { t } = useTranslation('membership');
  const classes = useStyles();
  const nextMembershipBatchSize = 30;
  const fetchNextMembershipBatch = useCallback(
    () => fetchMoreMembership(nextMembershipBatchSize),
    [fetchMoreMembership],
  );

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <Hidden xsDown>
          <div className={classes.panel}>
            <div className={classes.leftPanel}>
              <img
                alt="bsport logo"
                className={classes.bsportLogo}
                src="https://cdn.bsport.io/assets/logo/logo-icono-dark.png"
              />
              <Typography align="center" variant="body2">
                <Trans i18nKey="selector.explainConsumer" t={t}>
                  With <strong>bsport</strong> blabla <br /> single login
                </Trans>
              </Typography>
            </div>
          </div>
        </Hidden>
        <div className={classes.panel}>
          {membershipList.length ? (
            <MembershipSelectorBase
              membershipList={membershipList}
              onClick={goToConsumerHome}
            />
          ) : (
            <CompanySelectorBase
              classes={classes}
              companyList={companyList}
              companyLoading={companyLoading}
              onClick={goToConsumerHome}
              searchCompany={searchCompany}
            />
          )}
          {hasMore && loading && (
            <div className={classes.buttonContainer}>
              <CircularProgress />
            </div>
          )}
          {hasMore && !loading && (
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                onClick={fetchNextMembershipBatch}
                variant="outlined"
              >
                {t('selector.fetchMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100vw',
    minHeight: '100vh',
    paddingLeft: '10vw',
    paddingRight: '10vw',
    paddingTop: '4vw',
  },
  innerContainer: {
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    minHeight: '70vh',
    paddingTop: theme.spacing(2),
  },
  bsportLogo: {
    height: 320,
    width: 320,
    marginBottom: theme.spacing(4),
  },
  panel: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  leftPanel: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
  },
  selectorContainer: {
    minWidth: '40vw',
    height: '100%',
  },
  membershipList: {
    marginTop: theme.spacing(2),
  },
  companyList: {
    marginTop: theme.spacing(2),
  },
  bigIcon: {
    height: '20vw',
    width: '20vw',
  },
  buttonContainer: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default React.memo(MembershipSelector);
