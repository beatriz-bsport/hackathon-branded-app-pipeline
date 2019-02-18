// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  List,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import i18next from 'i18next';
import { push } from 'react-router-redux';
import {
  establishment as establishmentActions,
  offer as offerActions,
} from '../../actions';
import { Map } from '../../components';
import type { Establishment, Activity, Offer } from '../../api/types';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

import EstablishmentListItem from '../../libs/establishment/list/EstablishmentListItem.component';
import EstablishmentCardItem from '../../libs/establishment/list/EstablishmentCardItem.component';

type Props = {
  isCardView: boolean,
  timetableLoading: boolean,
  establishmentsLoading: boolean,
  establishments: Array<Establishment>,
  activities: Array<Activity>,
  offers: Array<Offer>,

  startUpdateEstablishment: (*) => void,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,

  classes: Object,
  t: TFunction,
};

export class EstablishmentList extends Component<Props> {
  renderNoEstablishment = () => {
    const { classes, t } = this.props;
    return (
      <div className={classes.emptyEstablishment}>
        <Typography variant="caption">
          {t('establishment.pleaseSelectOne')}
        </Typography>
      </div>
    );
  };

  renderMapWithCards = () => {
    const { classes, establishments } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.map}>
          <Map markers={establishments} markerClicked={() => {}} />
        </Paper>
        <Grid container direction="column" spacing={32}>
          {establishments.map((e) => (
            <Grid key={e.id} item>
              <EstablishmentCardItem
                fetchOffersByDay={this.props.fetchOffersByDay}
                establishment={e}
                offers={this.props.offers}
                activities={this.props.activities}
                timetableLoading={this.props.timetableLoading}
                goToEditForm={this.props.startUpdateEstablishment}
                goToOffer={this.props.goToOffer}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  renderList = () => (
    <Paper>
      <List component="nav" disablePadding>
        {this.props.establishments.map((e) => (
          <EstablishmentListItem divider establishment={e} />
        ))}
      </List>
    </Paper>
  );

  render() {
    const { establishmentsLoading, establishments } = this.props;
    if (establishmentsLoading) {
      return <CircularProgress />;
    }
    if ((establishments || []).length === 0) {
      return this.renderNoEstablishment();
    }
    if (this.props.isCardView) {
      return this.renderMapWithCards();
    }
    return this.renderList();
  }
}

function mapStateToProps(state) {
  return {
    establishentsLoading: state.establishment.loading,
    establishments: state.establishment.all,
    offers: state.offer.offers,
    timetableLoading: state.activity.loading,
    activities: state.activity.all,
  };
}

const styles = (theme) => ({
  emptyEstablishment: {
    padding: theme.spacing.unit * 3,
  },
  map: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  translate(),
  connect(
    mapStateToProps,
    {
      startUpdateEstablishment: establishmentActions.startUpdate,
      fetchOffersByDay: offerActions.fetchOffersByDay,
      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/establishment/add',
      text: i18next.t('establishment.addButton'),
    },
    switchButton: true,
  }),
)(withDrawer('establishmentList')(EstablishmentList));
