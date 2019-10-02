// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';
import Map from '../../components/map/Map.component';

import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import EstablishmentListItem from '../../libs/establishment/components/EstablishmentListItem.component';
import EstablishmentDeleteDialog from '../../libs/establishment/components/EstablishmentDeleteDialog.component';
import type { Establishment } from '../../libs/establishment/types';
import { getAllPageEstablishments } from '../../libs/establishment/selectors';
import {
  deleteEstablishment,
  fetchEstablishments,
} from '../../libs/establishment/actions';
import { checkCanDeleteEstablishment as canDeleteEstablishmentAPI } from '../../libs/establishment/api';

type Props = {
  loading: boolean,
  establishments: Array<Establishment>,

  fetchEstablishments: () => void,
  startUpdateEstablishment: (*) => void,
  goToEstablishment: (id: number) => void,
  establishmentToDelete: ?number,
  setEstablishmentToDelete: (?number) => void,
  deleteEstablishment: (number) => void,
  onCreate: () => void,

  classes: Object,
  t: TFunction,
};

export class EstablishmentList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchEstablishments();
  }

  render() {
    if ((this.props.establishments || []).length === 0 && !this.props.loading) {
      return (
        <div className={this.props.classes.emptyEstablishment}>
          <Typography variant="caption">
            {this.props.t('establishment.pleaseSelectOne')}
          </Typography>
        </div>
      );
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <Paper>
          <List component="nav" disablePadding>
            {this.props.establishments.map((e) => (
              <EstablishmentListItem
                key={e.id}
                divider
                onClick={() => this.props.goToEstablishment(e.id)}
                establishment={e}
                onClickDelete={() => this.props.setEstablishmentToDelete(e.id)}
                onClickEdit={() => {
                  this.props.startUpdateEstablishment(e.id);
                }}
              />
            ))}
          </List>
        </Paper>
        <Paper className={this.props.classes.map}>
          <Map markers={this.props.establishments} markerClicked={() => {}} />
        </Paper>
        <EstablishmentDeleteDialog
          establishmentId={this.props.establishmentToDelete}
          onClose={() => this.props.setEstablishmentToDelete(null)}
          canDeleteEstablishmentChecker={canDeleteEstablishmentAPI}
          deleteEstablishment={this.props.deleteEstablishment}
        />
        <BottomActionsButton
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('establishment.addButton')}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 16,
  },
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
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentList'),
  ),
  withState('establishmentToDelete', 'setEstablishmentToDelete', null),
  connect(
    (state) => ({
      loading: state.establishment.loading,
      establishments: getAllPageEstablishments(state),
    }),
    {
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      goToEstablishment: (id) => push(`/establishment/details/${id}`),
      fetchEstablishments,
      deleteEstablishment,
      onCreate: () => push('/establishment/add'),
    },
  ),
)(EstablishmentList);
