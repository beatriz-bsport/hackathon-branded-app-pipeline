// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps } from 'recompose';

import { withTranslation, Trans } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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
  t: TFunction,
  membershipList: Array<Membership>,
  classes: Object,
  goToConsumerHome: (company: number) => void,
  searchCompany: (string) => void,
  companyLoading: boolean,
  companyList: Array<Company>,
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
      variant="outlined"
      searchText={props.searchText}
      clearSearch={props.clearSearch}
      changeSearch={props.changeSearch}
      searchFields={['company_name']}
      items={props.membershipList}
      placeholder={props.t('selector.placeholder')}
      searchResult={props.searchResult}
    />
    <Paper className={props.classes.membershipList}>
      {!props.searchResult || props.searchResult.length === 0
        ? props.membershipList.map((m) => (
            <MembershipListItem
              membership={m}
              divider
              button
              onClick={() => props.onClick(m.company)}
            />
          ))
        : props.searchResult.map((m) => (
            <MembershipListItem
              divider
              membership={m}
              noDivider
              button
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
  withProps(({ changeSearch }) => ({ clearSearch: () => changeSearch('') })),
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
            variant="outlined"
            value={this.props.text}
            fullWidth
            onChange={(ev) => this.props.handleTextChange(ev.target.value)}
            placeholder={this.props.t('selector.placeholder')}
            className={this.props.classes.selectorContainer}
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
              divider
              company={c}
              noDivider
              button
              onClick={() => this.props.onClick(c.id)}
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
  return (
    <div className={props.classes.container}>
      <div className={props.classes.innerContainer}>
        <Hidden xsDown>
          <div className={props.classes.panel}>
            <div className={props.classes.leftPanel}>
              <img
                className={props.classes.bsportLogo}
                src="https://cdn.bsport.io/assets/logo/logo-icono-dark.png"
                alt="bsport logo"
              />
              <Typography align="center" variant="subtitle">
                <Trans i18nKey="selector.explainConsumer">
                  With <strong>bsport</strong> blabla <br /> single login
                </Trans>
              </Typography>
            </div>
          </div>
        </Hidden>
        <div className={props.classes.panel}>
          {props.membershipList.length ? (
            <MembershipSelectorBaseComposed
              membershipList={props.membershipList}
              onClick={props.goToConsumerHome}
              t={props.t}
              classes={props.classes}
            />
          ) : (
            <CompanySelectorBaseComposed
              companyList={props.companyList}
              onClick={props.goToConsumerHome}
              searchCompany={props.searchCompany}
              companyLoading={props.companyLoading}
              t={props.t}
              classes={props.classes}
            />
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
});

export default compose(
  withTranslation(['membership']),
  withStyles(styles),
)(MembershipSelector);
