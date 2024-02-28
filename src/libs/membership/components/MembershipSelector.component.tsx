// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps, withHandlers } from 'recompose';

import { useTranslation, Trans, TFunction } from 'react-i18next';
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
import DelayedTextField from '../../../components/DelayedTextField.component';

import type { Membership } from '../types';
import FuzeSearch from '../../../components/FuzeSearch.component';

import MembershipListItem from './MembershipListItem.component';
import CompanyListItem from './CompanyListItem.component';

type Props = {
  hasMore: boolean,
  loading: boolean,
  membershipList: Array<Membership>,
  classes: Object,
  goToConsumerHome: (company: number, companyName: string) => void,
  searchCompany: (string) => void,
  companyLoading: boolean,
  companyList: Array<Company>,
  fetchMoreMembership: (pageSize: number) => void,
};

const MembershipSelectorBase = (props: {
  classes: Object,
  searchText: string,
  clearSearch: () => void,
  changeSearch: (string) => void,
  membershipList: Array<Membership>,
  searchResult: Array<Membership>,
  onClick: (company: number) => void,
  t: TFunction,
}) => (
  <div className={props.classes.selectorContainer}>
    <FuzeSearch
      changeSearch={props.changeSearch}
      clearSearch={props.clearSearch}
      items={props.membershipList}
      placeholder={props.t('selector.placeholder')}
      searchFields={['company_name']}
      searchResult={props.searchResult}
      searchText={props.searchText}
      variant="outlined"
    />
    <Paper className={props.classes.membershipList}>
      {!props.searchResult || props.searchResult.length === 0
        ? props.membershipList.map((m) => (
            <MembershipListItem
              button
              divider
              membership={m}
              onClick={() => props.onClick(m.company)}
            />
          ))
        : props.searchResult.map((m) => (
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

const MembershipSelectorBaseComposed = compose(
  withState('searchText', 'setSearchText', ''),
  withState('searchResult', 'setSearchResult', null),
  withProps(({ setSearchResult, setSearchText }) => ({
    changeSearch: (fuse) => (ev) => {
      setSearchText(ev.target.value || '');
      setSearchResult(fuse.search(ev.target.value));
    },
  })),
  withHandlers(({ setSearchText, setSearchResult, membershipList }) => ({
    clearSearch: () => {
      setSearchText('');
      setSearchResult(membershipList);
    },
  })),
)(MembershipSelectorBase);

class CompanySelectorBase extends React.Component<{
  classes: Object,
  t: TFunction,
  handleTextChange: (string) => void,
  text: string,
  companyLoading: boolean,
  companyList: Array<Company>,
  onClick: (company: number) => void,
}> {
  componentDidMount() {
    this.props.handleTextChange('');
  }

  render() {
    return (
      <div className={this.props.classes.selectorContainer}>
        <Paper>
          <DelayedTextField
            fullWidth
            className={this.props.classes.selectorContainer}
            onChange={(ev) => this.props.handleTextChange(ev.target.value)}
            placeholder={this.props.t('selector.placeholder')}
            value={this.props.text}
            variant="outlined"
          />
        </Paper>
        <Paper className={this.props.classes.companyList}>
          {this.props.companyLoading ? <LinearProgress /> : null}
          {!this.props.companyLoading && this.props.companyList.length === 0 ? (
            <ListItem>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText
                primary={this.props.t('selector.noMatchingCompany')}
              />
            </ListItem>
          ) : null}
          {this.props.companyList.map((c) => (
            <CompanyListItem
              button
              divider
              noDivider
              company={c}
              onClick={() => this.props.onClick(c.id, c.name)}
            />
          ))}
        </Paper>
      </div>
    );
  }
}

const CompanySelectorBaseComposed = compose(
  withState('text', 'setText', ''),
  withProps(({ setText, searchCompany }) => ({
    handleTextChange: (txt) => {
      setText(txt);
      searchCompany(txt);
    },
  })),
)(CompanySelectorBase);

export const MembershipSelector = (props: Props) => {
  const { t } = useTranslation(['membership']);
  return (
    <div className={props.classes.container}>
      <div className={props.classes.innerContainer}>
        <Hidden xsDown>
          <div className={props.classes.panel}>
            <div className={props.classes.leftPanel}>
              <img
                alt="bsport logo"
                className={props.classes.bsportLogo}
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
        <div className={props.classes.panel}>
          {props.membershipList.length ? (
            <MembershipSelectorBaseComposed
              classes={props.classes}
              membershipList={props.membershipList}
              onClick={props.goToConsumerHome}
              t={t}
            />
          ) : (
            <CompanySelectorBaseComposed
              classes={props.classes}
              companyList={props.companyList}
              companyLoading={props.companyLoading}
              onClick={props.goToConsumerHome}
              searchCompany={props.searchCompany}
              t={t}
            />
          )}
          {props.hasMore && props.loading && (
            <div className={props.classes.buttonContainer}>
              <CircularProgress />
            </div>
          )}
          {props.hasMore && !props.loading && (
            <div className={props.classes.buttonContainer}>
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

const styles = (theme) => ({
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
});

export default compose(withStyles(styles))(MembershipSelector);
