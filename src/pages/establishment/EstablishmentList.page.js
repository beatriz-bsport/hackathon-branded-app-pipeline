// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Typography, Grid, Paper, List, withStyles } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import i18next from 'i18next';
import { push } from 'react-router-redux';
import { offer as offerActions } from '../../actions';
import Map from '../../components/map/Map.component';
import type { Establishment, Activity, Offer } from '../../api/types';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import EstablishmentListItem from '../../libs/establishment/components/EstablishmentListItem.component';
import EstablishmentCardItem from '../../libs/establishment/components/EstablishmentCardItem.component';

type Props = {
  isCardView: boolean,
  timetableLoading: boolean,
  loading: boolean,
  establishments: Array<Establishment>,
  activities: Array<Activity>,
  offers: Array<Offer>,

  startUpdateEstablishment: (*) => void,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  goToEstablishment: (id: number) => void,

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
      <div>
        {this.props.loading ? <LinearProgress /> : null}
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
                  goToEditForm={() => this.props.startUpdateEstablishment(e.id)}
                  goToOffer={this.props.goToOffer}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  };

  renderList = () => (
    <div>
      {this.props.loading ? <LinearProgress /> : null}
      <Paper>
        <List component="nav" disablePadding>
          {this.props.establishments.map((e) => (
            <EstablishmentListItem
              divider
              onClick={() => this.props.goToEstablishment(e.id)}
              establishment={e}
              onClickEdit={() => {
                this.props.startUpdateEstablishment(e.id);
              }}
            />
          ))}
        </List>
      </Paper>
    </div>
  );

  render() {
    const { establishments, loading } = this.props;
    if ((establishments || []).length === 0 && !loading) {
      return this.renderNoEstablishment();
    }
    if (this.props.isCardView) {
      return this.renderMapWithCards();
    }
    return this.renderList();
  }
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
  withNamespaces(),
  connect(
    (state) => ({
      loading: state.establishment.loading,
      establishments: state.establishment.all,
      offers: state.offer.offers,
      timetableLoading: state.activity.loading,
      activities: state.activity.all,
    }),
    {
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      fetchOffersByDay: offerActions.fetchOffersByDay,
      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
      goToEstablishment: (id) => push(`/establishment/details/${id}`),
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/establishment/add',
      text: i18next.t('establishment.addButton'),
    },
    switchButton: true,
  }),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.establishmentList')),
)(EstablishmentList);
