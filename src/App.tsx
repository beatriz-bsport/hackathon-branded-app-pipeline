// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { History } from 'history';

// used to init moment correctly
// eslint-disable-next-line
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/actions/category.actions';
import { getTheme } from 'bsport-saas/src/theme';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

/* FOR TESTING PURPOSES
import WorkshopWidget from './components/Workshop';
import CalendarWidget from './components/Calendar';
import ShopWidget from './components/Shop';
import PassWidget from './components/Pass';
*/
import { RootState } from './store/reducer';
import './App.scss';
import asyncComponent from './utils/async-component';

const CalendarWidget = asyncComponent(() => import('./components/Calendar'));
const PassWidget = asyncComponent(() => import('./components/Pass'));
const ShopWidget = asyncComponent(() => import('./components/Shop'));
const WorkshopWidget = asyncComponent(() => import('./components/Workshop'));

export type MaterialStyle<S> = {
  classes: Record<keyof S, string>
}

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyle<ReturnType<typeof styles>> &{
  companyId: number,
  store: any,
  history: History,
  widgetType: string,
  fetchCompanyActivities: (companyId: number) => void,
  fetchCompanyMetaActivities: (companyId: number) => void,
  fetchCompanyCoaches: (companyId: number) => void,
  fetchCompanyEstablishments: (companyId: number) => void,
  consumerProfile: any,
  lang: string,
  fetchData: () => void;
  compactMode: boolean;
  filtersOpen: boolean;
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
    this.fetchData();
  }

  fetchData() {
    this.props.fetchSCT();
    this.props.fetchCompanyTheme(this.props.companyId);
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
    const { theme } = this.props;

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
        >
          {this.renderWidget()}
          {!!theme && (
            <div className={this.props.classes.poweredByContainer}>
              <div className={this.props.classes.centerRight}>
                <a
                  className={this.props.classes.poweredBy}
                  href={`https://pro.bsport.io?utm_source=widget&utm_medium=referral&utm_content=bsport_logo&utm_campaign=${(
                    theme.company_name || ''
                  ).replace(/\//gi, '-')}`}
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
            </div>
          )}
        </MuiThemeProvider>
      </div>
    );
  }
}

const styles = () => ({
  poweredByContainer: {
    width: '100%',
  },
  centerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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


const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  theme: state.theme.theme,
});

const mapDispatchToProps = {
  fetchSCT,
  fetchCompanyTheme,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BsportWidget);
