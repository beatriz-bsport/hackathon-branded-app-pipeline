// @flow

import Fuse from 'fuse.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import memoize from 'memoize-one';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

import ResultList from '../components/search/ResultList.component';
import MemberDetail from '../components/search/MemberDetail.component';
import SearchBar from '../components/SearchBar.component';

import {
  search as searchActions,
  paymentPack as paymentPackActions,
  booking as bookingActions,
} from '../actions';

type Props = {
  searchText: string,
  members: *[],
  classes: *,
  member: *,
  selected: number,
  bookings: *[],
  paymentPacks: *[],
  pushToMember: (memberId: number) => void,
  bookingUpdaters: {
    confirmBooking: (id: number) => void,
    confirmBookingAttendance: (id: number) => void,
    discardBooking: (id: number) => void,
    discardBookingAttendance: (id: number) => void,
  },
  incrementCredit: () => void,
  decrementCredit: () => void,
  selectEntity: (*) => void,
  t: TFunction,
};
type State = {};

const styles = (theme) => ({
  mobileOnly: {
    paddingTop: theme.spacing.unit * 1,
    paddingLeft: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 0.5,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    [theme.breakpoints.down('md')]: {
      paddingTop: 60,
    },
    [theme.breakpoints.up('md')]: {
      margin: -theme.spacing.unit * 3,
      width: `calc(100% + ${theme.spacing.unit * 6}px)`,
    },
    width: '100%',
    minHeight: 'calc(100vh - 65px)',
  },
  content: {
    height: 'calc(100vh - 65px)',
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexFlow: 'row',
    },
  },
  detail: {
    flex: 2,
    width: '100%',
    padding: theme.spacing.unit * 2,
    overflowY: 'auto',
  },
  hidden: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  buttonGoBack: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

export class SearchResults extends Component<Props, State> {
  getFuse = memoize((items) => {
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'email'],
    };
    return new Fuse(items, options);
  });

  getResults = () =>
    this.getFuse(this.props.members)
      .search(this.props.searchText)
      .slice(0, 30);

  selectEntity = (entity) => {
    if (entity.type === 'member') {
      this.props.pushToMember(entity.data.id);
    } else {
      this.props.selectEntity(entity);
    }
  };

  render() {
    const { t, classes, member, bookings, selected } = this.props;
    const results = this.getResults();
    const hasLoaded = member && bookings;
    const isLoadingMember = !hasLoaded && selected;
    return (
      <Paper className={classes.root}>
        <SearchBar className={classes.mobileOnly} />
        {isLoadingMember ? <LinearProgress /> : null}
        {hasLoaded ? (
          <Button
            color="secondary"
            fullWidth
            className={classes.buttonGoBack}
            onClick={() => this.props.selectEntity(null)}
          >
            {t('search.go_back')}
          </Button>
        ) : null}
        <div className={classes.content}>
          <ResultList
            items={results}
            selected={selected}
            selectEntity={this.selectEntity}
            className={selected && !isLoadingMember ? classes.hidden : ''}
          />
          <div className={classes.detail}>
            {hasLoaded ? (
              <MemberDetail
                member={member}
                bookings={bookings}
                bookingUpdaters={this.props.bookingUpdaters}
                decrementCredit={this.props.decrementCredit}
                incrementCredit={this.props.incrementCredit}
                paymentPacks={this.props.paymentPacks}
              />
            ) : null}
          </div>
        </div>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  const { member } = state.member;
  const { selectedId } = state.search;
  return {
    selected: selectedId,
    members: state.member.all,
    searchText: state.search.text,
    bookings: state.booking.all,
    member: member && member.id === selectedId ? member : null,
    paymentPacks: state.paymentPack.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushToMember(memberId: number) {
      dispatch(push(`/member/${memberId}`));
    },
    selectEntity(entity) {
      dispatch(searchActions.selectEntity(entity));
    },
    incrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, -1));
    },
    bookingUpdaters: {
      confirmBookingAttendance(bookingId) {
        dispatch(bookingActions.confirmBookingAttendance(bookingId));
      },
      discardBookingAttendance(bookingId) {
        dispatch(bookingActions.discardBookingAttendance(bookingId));
      },
      confirmBooking(bookingId) {
        dispatch(bookingActions.confirmBooking(bookingId));
      },
      discardBooking(bookingId) {
        dispatch(bookingActions.discardBooking(bookingId));
      },
    },
  };
}

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(SearchResults),
  ),
);
