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
import type { TFunction } from 'i18next';
import { ClassNameMap } from '@material-ui/styles';
import DelayedTextField from '../../../components/DelayedTextField.component';

import type { Membership } from '../types';
import FuzeSearch from '../../../components/FuzeSearch.component';

// @ts-expect-error js file
import MembershipListItem from './MembershipListItem.component';
import CompanyListItem from './CompanyListItem.component';
import type { Company } from '#libs/company/types';

type Props = {
  hasMore: boolean;
  loading: boolean;
  membershipList: Array<Membership>;
  goToConsumerHome: (company: number, companyName: string) => void;
  searchCompany: (text: string) => void;
  companyLoading: boolean;
  companyList: Array<Company>;
  fetchMoreMembership: (pageSize: number) => void;
};

const MembershipSelectorBase = (props: {
  membershipList: Array<Membership>;
  onClick: (company: number) => void;
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
    setSearchResult(props.membershipList);
  }, [props.membershipList]);

  return (
    <div className={classes.selectorContainer}>
      <FuzeSearch
        changeSearch={changeSearch}
        clearSearch={clearSearch}
        items={props.membershipList}
        placeholder={t('selector.placeholder')}
        searchFields={['company_name']}
        searchText={searchText}
        variant="outlined"
      />
      <Paper className={classes.membershipList}>
        {!searchResult || searchResult.length === 0
          ? props.membershipList.map((m) => (
              <MembershipListItem
                button
                divider
                membership={m}
                onClick={() => props.onClick(m.company)}
              />
            ))
          : searchResult.map((m) => (
              <MembershipListItem
                button
                divider
                noDivider
                membership={m}
                onClick={() => props.onClick(m.company)}
              />
            ))}
      </Paper>
    </div>
  );
};

type CompanySelectorBaseProps = {
  classes: ClassNameMap<keyof ReturnType<typeof useStyles>>;
  t: TFunction;
  companyLoading: boolean;
  searchCompany: (text: string) => void;
  companyList: Array<Company>;
  onClick: (company: number) => void;
};

const CompanySelectorBase: React.FC<CompanySelectorBaseProps> = ({
  classes,
  companyList,
  companyLoading,
  onClick,
  searchCompany,
  t,
}) => {
  const [text, setText] = useState('');

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

  return (
    <div className={classes.selectorContainer}>
      <Paper>
        <DelayedTextField
          fullWidth
          className={classes.selectorContainer}
          onChange={(ev) => handleTextChange(ev.target.value)}
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
        {companyList.map((c) => (
          <CompanyListItem
            button
            divider
            noDivider
            company={c}
            onClick={() => onClick(c.id, c.name)}
          />
        ))}
      </Paper>
    </div>
  );
};

export const MembershipSelector = (props: Props) => {
  const { t } = useTranslation(['membership']);
  const classes = useStyles();
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
              <Typography align="center" variant="subtitle">
                <Trans i18nKey="selector.explainConsumer" t={t}>
                  With <strong>bsport</strong> blabla <br /> single login
                </Trans>
              </Typography>
            </div>
          </div>
        </Hidden>
        <div className={classes.panel}>
          {props.membershipList.length ? (
            <MembershipSelectorBase
              classes={classes}
              membershipList={props.membershipList}
              onClick={props.goToConsumerHome}
              t={t}
            />
          ) : (
            <CompanySelectorBase
              classes={classes}
              companyList={props.companyList}
              companyLoading={props.companyLoading}
              onClick={props.goToConsumerHome}
              searchCompany={props.searchCompany}
              t={t}
            />
          )}
          {props.hasMore && props.loading && (
            <div className={classes.buttonContainer}>
              <CircularProgress />
            </div>
          )}
          {props.hasMore && !props.loading && (
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                onClick={() => props.fetchMoreMembership(30)}
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
