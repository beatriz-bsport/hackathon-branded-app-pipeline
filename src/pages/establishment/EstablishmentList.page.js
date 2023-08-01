// @flow

import React from 'react';
import { withHandlers, compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { push } from 'connected-react-router';

import Map from '../../components/map/Map.component';
import FuzeSearch from '../../components/FuzeSearch.component';

import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import EstablishmentListItem from '../../libs/establishment/components/EstablishmentListItem.component';
import EstablishmentListGroupByAddress from '../../libs/establishment/components/EstablishmentListGroupByAddress.component';
import EstablishmentDeleteDialog from '../../libs/establishment/components/EstablishmentDeleteDialog.component';
import type {
  Establishment,
  EstablishmentListGroupByAddress as EstablishmentListGroupByAddressType,
} from '../../libs/establishment/types';
import {
  getAvailableEstablishmentList,
  getDisabledEstablishmentList,
  getEstablishmentGroupByAddress,
} from '../../libs/establishment/selectors';
import {
  deleteEstablishment,
  restoreEstablishment as restoreEstablishmentAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '../../libs/establishment/actions';
import { checkCanDeleteEstablishment as canDeleteEstablishmentAPI } from '../../libs/establishment/api';
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import { withBookingNotification } from '../../libs/marketing/selectors';
import themeSelectors from '../../libs/theme/selectors';

type Props = {
  loading: boolean,
  notificationLoading: boolean,
  establishments: Array<Establishment>,
  establishmentsArchived: Array<Establishment>,

  fetchEstablishments: (data: { page_size?: number }) => void,
  startUpdateEstablishment: (data: any) => void,
  goToEstablishment: (id: number) => void,
  establishmentToDelete: ?number,
  setEstablishmentToDelete: (id: ?number) => void,
  deleteEstablishment: (id: number) => void,
  onCreate: () => void,
  restoreEstablishment: (id: number) => void,

  classes: any,
  t: TFunction,
  fetchMarketingNotificationList: (params: any) => void,
  establishmentGroupByAddress: EstablishmentListGroupByAddressType,
};

type State = {
  searchText: string,
  searchResult: Array<Establishment>,
  showDisabled: boolean,
};

const BOOKING_CREATION_NOTIFICATION = 2;

export class EstablishmentList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
  };

  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind: BOOKING_CREATION_NOTIFICATION,
    });
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
    if (
      (this.props.establishments || []).length === 0 &&
      !this.props.loading &&
      (this.props.establishmentsArchived || []).length === 0
    ) {
      return (
        <IsEmptyList
          button={this.props.t('addButton')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('addButton')}
          text={this.props.t('noEstablishement')}
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
              changeSearch={this.changeSearch}
              clearSearch={this.clearSearch}
              items={this.props.establishments}
              placeholder={this.props.t('search')}
              searchFields={['title', 'location.adress']}
              searchResult={this.state.searchResult}
              searchText={this.state.searchText}
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
                <List disablePadding component="nav">
                  {this.state.searchResult.map((e) => (
                    <EstablishmentListItem
                      key={e.id}
                      divider
                      establishment={e}
                      onClick={() => this.props.goToEstablishment(e.id)}
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

        <EstablishmentListGroupByAddress
          establishmentGroupByAddress={this.props.establishmentGroupByAddress}
          onClick={this.props.goToEstablishment}
          onClickDelete={this.props.setEstablishmentToDelete}
          onClickEdit={this.props.startUpdateEstablishment}
        />
        <Paper className={this.props.classes.map}>
          <Map markerClicked={() => {}} markers={this.props.establishments} />
        </Paper>
        {(this.props.establishmentsArchived || []).length ? (
          <div>
            <ButtonBase
              className={this.props.classes.buttonTitle}
              disabled={!(this.props.establishmentsArchived || []).length}
              onClick={() =>
                this.setState((prevState) => ({
                  showDisabled: !prevState.showDisabled,
                }))
              }
            >
              <Typography
                color={
                  (this.props.establishmentsArchived || []).length
                    ? 'default'
                    : 'textSecondary'
                }
                component="h2"
                variant="h5"
              >
                {`${this.props.t('list.section.archived')} (${
                  (this.props.establishmentsArchived || []).length
                })`}
              </Typography>

              {this.state.showDisabled ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ButtonBase>
            <Divider />
            <Collapse
              unmountOnExit
              className={this.props.classes.collapse}
              in={this.state.showDisabled}
            >
              <Paper>
                <List disablePadding component="nav">
                  {this.props.establishmentsArchived.map((e) => (
                    <EstablishmentListItem
                      key={e.id}
                      divider
                      establishment={e}
                      onRestore={() => this.props.restoreEstablishment(e.id)}
                    />
                  ))}
                </List>
              </Paper>
            </Collapse>
          </div>
        ) : null}
        <EstablishmentDeleteDialog
          canDeleteEstablishmentChecker={canDeleteEstablishmentAPI}
          deleteEstablishment={this.props.deleteEstablishment}
          establishmentId={this.props.establishmentToDelete}
          onClose={() => this.props.setEstablishmentToDelete(null)}
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
      marginRight: theme.spacing(1),
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
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  collapse: {
    paddingTop: theme.spacing(2),
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
      notificationLoading: state.marketingNotification.loading,
      establishments: withBookingNotification(getAvailableEstablishmentList)(
        state,
      ),
      establishmentsArchived: getDisabledEstablishmentList(state),
      establishmentGroupByAddress: getEstablishmentGroupByAddress(state),
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      startUpdateEstablishment: (id: number) =>
        push(`/establishment/edit/${id}`),
      goToEstablishment: (id) => push(`/establishment/details/${id}`),
      fetchEstablishments: fetchEstablishmentsAction,
      deleteEstablishment,
      restoreEstablishment: restoreEstablishmentAction,
      fetchMarketingNotificationList,
      onCreate: () => push('/establishment/add'),
    },
  ),
  withHandlers({
    restoreEstablishment:
      ({ restoreEstablishment, fetchEstablishments }) =>
      (id) => {
        restoreEstablishment(id, {
          onSuccess: () => fetchEstablishments(),
        });
      },
  }),
)(EstablishmentList);
