// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Menu from '@material-ui/core/Menu';
import { compose } from 'recompose';
import moment from 'moment';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import FilterListIcon from '@material-ui/icons/FilterList';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  PAYMENT_PACK_EXPIRATION_IDENTIFIER,
} from '@bsport/common/lib/master-data/smart-list';

import FilterCard from './FilterListItem.component';

const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

const filtersList = {
  [MEMBER_INFO]: [
    CREDIT_ACCOUNT_FILTER_IDENTIFIER,
    DATE_JOINED_FILTER_IDENTIFIER,
    SENIORITY_FILTER_IDENTIFIER,
    GENDER_FILTER_IDENTIFIER,
    TAG_FILTER_IDENTIFIER,
  ],
  [BOOKING]: [
    LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
    BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
    WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  ],
  [PAYMENT_PACK]: [
    PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER,
    PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
    HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
    PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
    PAYMENT_PACK_EXPIRATION_IDENTIFIER,
  ],
  [BUY]: [EXPENSES_FILTER_IDENTIFIER],
};

const filtersCategory = [MEMBER_INFO, PAYMENT_PACK, BOOKING, BUY];

type Props = {
  classes: any,
  loading: boolean,
  smartList: any,
  t: TFunction,
  filters: Array<Filter>,
  payment_packs: Array<PaymentPack>,
  meta_activities: Array<any>,
  tags: Array<any>,
  tag_groups: Array<any>,
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
  exportMemberTable: () => void,
};

export class FiltersPanel extends Component<Props> {
  state = {
    new_filter: null,
    displayFilters: true,
    displayAddFilter: false,
    displayCategoryFilters: null,
  };

  handleFilterChange = (filter) => {
    this.setState({
      new_filter: {
        filter_identifier: filter,
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
        <div className={classes.buttonsRow}>
          <Button
            onClick={this.props.onRequestEmail}
            color="secondary"
            variant="contained"
            className={classes.actionButton}
          >
            <SendIcon className={this.props.classes.leftIcon} />
            {t('mail.sendMail')}
          </Button>
          <div>
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
              {t('filters.add_filter')}
            </Button>
            <Button
              onClick={async () => {
                const response = await this.props.exportMemberTable();
                const blob = new Blob([response.data], { type: 'xlsx' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('type', 'hidden');
                link.href = url;
                link.download = `${this.props.smartList.name}_${moment().format(
                  'YYYY-MM-DD',
                )}.csv`;
                document.body.appendChild(link);
                link.click();
                link.remove();
              }}
              color="secondary"
              variant="contained"
              className={classes.actionButton}
            >
              <CloudDownloadIcon className={this.props.classes.leftIcon} />
              {t('exportList')}
            </Button>
          </div>

          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.displayAddFilter}
            onClose={() =>
              this.setState((previousState) => ({
                displayAddFilter: !previousState.displayAddFilter,
              }))
            }
          >
            {filtersCategory.map((key) => (
              <div>
                <ListItem
                  className={this.props.classes.menu}
                  onClick={() => {
                    if (this.state.displayCategoryFilters === key) {
                      this.setState({
                        displayCategoryFilters: null,
                      });
                    } else {
                      this.setState({
                        displayCategoryFilters: key,
                      });
                    }
                  }}
                  button
                  key={key}
                  value={key}
                >
                  <ListItemText
                    primary={`${t(`filterCategory.${key}`)} (${
                      filtersList[key].length
                    })`}
                  />
                  {this.state.displayCategoryFilters === key ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  in={this.state.displayCategoryFilters === key}
                  key={`${key}-collapse`}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    disablePadding
                    className={this.props.classes.nestedList}
                  >
                    {filtersList[key].map((filter) => (
                      <ListItem
                        className={this.props.classes.menu}
                        onClick={() => this.handleFilterChange(filter)}
                        key={filter}
                        value={filter}
                        button
                      >
                        <ListItemText primary={t(`filters.${filter}.name`)} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </Menu>
        </div>
        <ButtonBase
          onClick={() =>
            this.setState((previousState) => ({
              displayFilters: !previousState.displayFilters,
            }))
          }
          className={this.props.classes.header}
        >
          {this.props.loading ? (
            <div style={{ display: 'flex' }}>
              <Typography
                variant="h6"
                style={{ marginRight: '10px' }}
                color={this.state.displayFilters ? 'default' : 'textSecondary'}
              >
                {`${t('filters.active_filters')}`}
              </Typography>
              <CircularProgress size="1.5rem" />
            </div>
          ) : (
            <Typography
              variant="h6"
              color={this.state.displayFilters ? 'default' : 'textSecondary'}
            >
              {`${t('filters.active_filters')} (${filters.length})`}
            </Typography>
          )}
          {this.state.displayFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        <Divider className={this.props.classes.divider} />
        <Collapse in={this.state.displayFilters}>
          <Paper>
            <List
              component="nav"
              disablePadding
              className={classes.filterPanel}
            >
              {filters.map((filter) => (
                <FilterCard
                  key={`${filter.id}-${filter.filter_identifier}`}
                  filter={filter}
                  onClickEdit={this.props.updateFilter}
                  onClickDelete={this.props.deleteFilter}
                  payment_packs={this.props.payment_packs}
                  meta_activities={this.props.meta_activities}
                  tag_groups={this.props.tag_groups}
                  tags={this.props.tags}
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
                  tag_groups={this.props.tag_groups}
                  tags={this.props.tags}
                />
              ) : null}
            </List>
          </Paper>
        </Collapse>
      </div>
    );
  }
}

const styles = (theme) => ({
  menu: {
    width: '300px',
  },
  header: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacing.unit * 4,
  },
  divider: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginTop: theme.spacing.unit * 2,
  },
  filterPanel: {
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
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  nestedList: {
    backgroundColor: '#F8F8F8',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['smartList']),
)(FiltersPanel);
