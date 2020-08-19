// @flow

import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'connected-react-router';
import Map from '../../components/map/Map.component';
import FuzeSearch from '../../components/FuzeSearch.component';

import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
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
import { fetchFirstTimeNotifications as fetchNotifications } from '../../libs/booking/actions';
import { withBookingNotifications } from '../../libs/booking/selectors';

type Props = {
  loading: boolean,
  notificationLoading: boolean,
  establishments: Array<Establishment>,

  fetchEstablishments: () => void,
  startUpdateEstablishment: (*) => void,
  goToEstablishment: (id: number) => void,
  establishmentToDelete: ?number,
  fetchNotifications: (params?: Object) => void,
  setEstablishmentToDelete: (?number) => void,
  deleteEstablishment: (number) => void,
  onCreate: () => void,

  classes: Object,
  t: TFunction,
};

export class EstablishmentList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchNotifications({ is_establishment_notification: true });
  }

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    if ((this.props.establishments || []).length === 0 && !this.props.loading) {
      return (
        <IsEmptyList
          text={this.props.t('noEstablishement')}
          button={this.props.t('addButton')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('addButton')}
        />
      );
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading || this.props.notificationLoading ? (
          <LinearProgress />
        ) : null}
        {this.props.establishments.length > 0 ? (
          <div className={this.props.classes.search}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              searchFields={['title', 'location.adress']}
              items={this.props.establishments}
              placeholder={this.props.t('search')}
              searchResult={this.state.searchResult}
            />
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? this.props.classes.searchPaperDisplayed
                  : this.props.classes.searchPaperHiden
              }
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <List component="nav" disablePadding>
                  {this.state.searchResult.map((e) => (
                    <EstablishmentListItem
                      key={e.id}
                      divider
                      onClick={() => this.props.goToEstablishment(e.id)}
                      establishment={e}
                      onClickDelete={() =>
                        this.props.setEstablishmentToDelete(e.id)
                      }
                      onClickEdit={() => {
                        this.props.startUpdateEstablishment(e.id);
                      }}
                    />
                  ))}
                </List>
              </Collapse>
            </Paper>
          </div>
        ) : null}
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
          onCreateLabel={this.props.t('addButton')}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
  search: { marginBottom: theme.spacing(2) },
  textAndIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(),
    },
  },
  buttonEstablishement: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  map: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['establishment']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:establishment.establishmentList'),
  ),
  withState('establishmentToDelete', 'setEstablishmentToDelete', null),
  connect(
    (state) => ({
      loading: state.establishment.loading,
      notificationLoading: state.booking.notification.loading,
      establishments: withBookingNotifications(getAllPageEstablishments)(state),
    }),
    {
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      goToEstablishment: (id) => push(`/establishment/details/${id}`),
      fetchEstablishments,
      deleteEstablishment,
      fetchNotifications,
      onCreate: () => push('/establishment/add'),
    },
  ),
)(EstablishmentList);
