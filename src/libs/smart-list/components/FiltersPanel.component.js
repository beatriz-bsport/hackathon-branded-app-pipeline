// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Menu from '@material-ui/core/Menu';
import { compose } from 'recompose';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import FilterListIcon from '@material-ui/icons/FilterList';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  // HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  HAS_BOOKED_META_ACTIVITY_FILTER_IDENTIFIER,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
} from '@bsport/common/lib/master-data/smart-list';

import FilterCard from './FilterListItem.component';

const filtersList = [
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  // HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  HAS_BOOKED_META_ACTIVITY_FILTER_IDENTIFIER,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
];

type Props = {
  classes: any,
  t: TFunction,
  filters: Array<Filter>,
  payment_packs: Array<PaymentPack>,
  meta_activities: Array<any>,
  updateFilter: (
    smartListId: number,
    filterNameId: number,
    data: any,
    filterId: number,
    callback: (id: number) => void,
  ) => void,
  deleteFilter: (
    filterNameId: number,
    filterId: number,
    smartListId: number,
    callback: (id: number) => void,
  ) => void,
  createFilter: (
    filterNameId: number,
    filter: any,
    smartListId: number,
    callback: (id: number) => void,
  ) => void,
  onRequestEmail: () => void,
};

export class FiltersPanel extends Component<Props> {
  state = {
    new_filter: null,
    displayFilters: true,
    displayAddFilter: false,
  };

  handleFilterChange = (filter) => {
    this.setState({
      new_filter: {
        filter_identifier: filter.target.value,
      },
    });
    this.setState((previousState) => ({
      displayAddFilter: !previousState.displayAddFilter,
    }));
  };

  cancelFilter = () => {
    this.setState({ new_filter: null });
  };

  createFilter = (filterNameId, data) => {
    this.setState({ new_filter: null, displayFilters: true });
    this.props.createFilter(filterNameId, data);
  };

  render() {
    const { classes, t, filters } = this.props;
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <ListItem
            className={classes.menu}
            button
            divider
            onClick={() =>
              this.setState((previousState) => ({
                displayFilters: !previousState.displayFilters,
              }))
            }
          >
            <ListItemText
              primary={`${t('filters.active_filters')} (${filters.length})`}
            />
            {this.state.displayFilters ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </ListItem>
        </div>
        <Collapse in={this.state.displayFilters}>
          <Paper>
            <List
              component="nav"
              disablePadding
              className={classes.filterPanel}
            >
              {filters.map((filter) => (
                <FilterCard
                  key={filter.id}
                  filter={filter}
                  onClickEdit={this.props.updateFilter}
                  onClickDelete={this.props.deleteFilter}
                  payment_packs={this.props.payment_packs}
                  meta_activities={this.props.meta_activities}
                />
              ))}
              {this.state.new_filter ? (
                <FilterCard
                  filter={this.state.new_filter}
                  onClickDelete={this.cancelFilter}
                  payment_packs={this.props.payment_packs}
                  meta_activities={this.props.meta_activities}
                  new
                  onClickCreate={this.createFilter}
                />
              ) : null}
            </List>
          </Paper>
        </Collapse>
        <div className={classes.buttonsRow}>
          <Button
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.stopPropagation();
              this.setState({ anchorEl: event.currentTarget });
              this.setState((previousState) => ({
                displayAddFilter: !previousState.displayAddFilter,
              }));
            }}
            color="primary"
            variant="contained"
            className={classes.actionButton}
            disabled={this.state.new_filter}
          >
            <FilterListIcon className={this.props.classes.leftIcon} />
            Ajouter un filtre
          </Button>
          <Button
            onClick={this.props.onRequestEmail}
            color="secondary"
            variant="contained"
            className={classes.actionButton}
          >
            <SendIcon className={this.props.classes.leftIcon} />
            Envoyer un email
          </Button>
          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.displayAddFilter}
            onClose={() =>
              this.setState((previousState) => ({
                displayAddFilter: !previousState.displayAddFilter,
              }))
            }
          >
            {filtersList.map((key) => (
              <MenuItem
                onClick={(ev) => this.handleFilterChange(ev)}
                key={key}
                value={key}
              >
                {t(`filters.${key}.name`)}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  textField: {
    marginTop: theme.spacing.unit * 2,
  },
  filterPanel: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  filterSelect: {
    marginLeft: theme.spacing.unit,
  },
  actionButton: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['smartList']),
)(FiltersPanel);
