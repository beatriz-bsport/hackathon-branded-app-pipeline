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
import i18next from 'i18next';
import { push } from 'react-router-redux';
import Map from '../../components/map/Map.component';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import EstablishmentListItem from '../../libs/establishment/components/EstablishmentListItem.component';
import EstablishmentDeleteDialog from '../../libs/establishment/components/EstablishmentDeleteDialog.component';
import type { Establishment } from '../../libs/establishment/types';
import { deleteEstablishment } from '../../libs/establishment/actions';
import { checkCanDeleteEstablishment as canDeleteEstablishmentAPI } from '../../libs/establishment/api';

type Props = {
  loading: boolean,
  establishments: Array<Establishment>,

  startUpdateEstablishment: (*) => void,
  goToEstablishment: (id: number) => void,
  establishmentToDelete: ?number,
  setEstablishmentToDelete: (?number) => void,
  deleteEstablishment: (number) => void,

  classes: Object,
  t: TFunction,
};

export const EstablishmentList = (props: Props) => {
  if ((props.establishments || []).length === 0 && !props.loading) {
    return (
      <div className={props.classes.emptyEstablishment}>
        <Typography variant="caption">
          {props.t('establishment.pleaseSelectOne')}
        </Typography>
      </div>
    );
  }
  return (
    <div>
      {props.loading ? <LinearProgress /> : null}
      <Paper>
        <List component="nav" disablePadding>
          {props.establishments.map((e) => (
            <EstablishmentListItem
              key={e.id}
              divider
              onClick={() => props.goToEstablishment(e.id)}
              establishment={e}
              onClickDelete={() => props.setEstablishmentToDelete(e.id)}
              onClickEdit={() => {
                props.startUpdateEstablishment(e.id);
              }}
            />
          ))}
        </List>
      </Paper>
      <Paper className={props.classes.map}>
        <Map markers={props.establishments} markerClicked={() => {}} />
      </Paper>
      <EstablishmentDeleteDialog
        establishmentId={props.establishmentToDelete}
        onClose={() => props.setEstablishmentToDelete(null)}
        canDeleteEstablishmentChecker={canDeleteEstablishmentAPI}
        deleteEstablishment={props.deleteEstablishment}
      />
    </div>
  );
};

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
  withState('establishmentToDelete', 'setEstablishmentToDelete', null),
  connect(
    (state) => ({
      loading: state.establishment.loading,
      establishments: state.establishment.all,
    }),
    {
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      goToEstablishment: (id) => push(`/establishment/details/${id}`),
      deleteEstablishment,
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/establishment/add',
      text: i18next.t('establishment.addButton'),
    },
  }),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.establishmentList')),
)(EstablishmentList);
