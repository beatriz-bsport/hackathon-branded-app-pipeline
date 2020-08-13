// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { compose, withHandlers } from 'recompose';
import './App.scss';

// used to init moment correctly
// eslint-disable-next-line

import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/actions/category.actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getTheme } from 'bsport-saas/src/theme';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

/* FOR TESTING PURPOSES
import WorkshopWidget from './components/Workshop';
import CalendarWidget from './components/Calendar';
import ShopWidget from './components/Shop';
import PassWidget from './components/Pass';
*/

import asyncComponent from './async-component';

const CalendarWidget = asyncComponent(() => import('./components/Calendar'));
const PassWidget = asyncComponent(() => import('./components/Pass'));
const ShopWidget = asyncComponent(() => import('./components/Shop'));
const WorkshopWidget = asyncComponent(() => import('./components/Workshop'));

type Props = {
  companyId: number,
  store: any,
  history: Object,
  widgetType: string,
  fetchSCT: () => void,
  fetchCompanyActivities: (companyId: number) => void,
  fetchCompanyMetaActivities: (companyId: number) => void,
  fetchCompanyCoaches: (companyId: number) => void,
  fetchCompanyEstablishments: (companyId: number) => void,
  fetchCompanyTheme: (companyId: number) => void,
  auth: *,
  consumerProfile: *,
  lang: string,
  fetchData: () => void,
  compactMode: boolean,
  defaultFilters: {
    coaches: [],
    establishments: [],
    levels: [],
    metaActivities: [],
  },
};

class BsportWidget extends Component<Props> {
  componentWillMount() {
    if (this.props.lang && this.props.lang !== 'fr-FR') {
      import('bsport-saas/src/i18n')
        .then((i18n) => {
          i18n.default.changeLanguage(this.props.lang);
        })
        .catch(console.error);
    }
  }

  componentDidMount() {
    this.props.fetchData();
  }

  renderWidget() {
    const {
      companyId,
      store,
      history,
      widgetType,
      defaultFilters,
      filtersOpen,
      compactMode,
    } = this.props;
    switch (widgetType) {
      case 'workshop':
        return (
          <WorkshopWidget
            companyId={companyId}
            location={history.location}
            store={store}
            defaultFilters={defaultFilters}
            filtersOpen={filtersOpen}
          />
        );
      case 'pass':
        return (
          <PassWidget
            companyId={companyId}
            store={store}
            location={history.location}
          />
        );
      case 'shop':
        return (
          <ShopWidget
            companyId={companyId}
            store={store}
            location={history.location}
          />
        );
      default:
        return (
          <CalendarWidget
            companyId={companyId}
            location={history.location}
            compactMode={compactMode}
            store={store}
            defaultFilters={defaultFilters}
            filtersOpen={filtersOpen}
          />
        );
    }
  }

  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex !important',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MuiThemeProvider
          theme={getTheme(this.props.theme)}
          style={{ height: '100%', width: '100%', display: 'inline-block' }}
        >
          {this.renderWidget()}
          <div className={this.props.classes.poweredByContainer}>
            <a
              className={this.props.classes.poweredBy}
              href="https://pro.bsport.io"
            >
              <Typography color="textSecondary" variant="caption">
                Powered by
              </Typography>
              <img
                alt="bsport"
                className={this.props.classes.logo}
                src="https://cdn.bsport.io/bsport_logo_txt.png"
              />
            </a>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const styles = () => ({
  poweredByContainer: {
    width: '100%',
  },
  poweredBy: {
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'flex-end !important',
    padding: 18,
    '&>*': {
      textDecoration: 'none !important', // not working ?
    },
  },
  logo: {
    maxHeight: '24px !important',
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({ auth: state.auth, theme: state.theme.theme }),
    {
      // General information
      fetchSCT,
      fetchCompanyTheme,
    },
  ),
  withHandlers({
    fetchData: ({ companyId, fetchSCT, fetchCompanyTheme }) => () => {
      fetchSCT();
      fetchCompanyTheme(companyId);
    },
  }),
)(BsportWidget);
