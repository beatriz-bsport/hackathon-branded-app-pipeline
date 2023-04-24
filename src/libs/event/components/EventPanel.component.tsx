// @ts-nocheck
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { compose, withHandlers } from 'recompose';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OptionCallback } from '../../../state/types';
import {
  EventListParams,
  SubscriptionEvent,
  SubscriptionEventSpec,
} from '../types';
import EventListItem from './EventListItem.component';
import PaginatedListBase from '#components/PaginatedListBase.component';

type OwnProps = {
  fetchEventList: (params: EventListParams, options?: OptionCallback) => void;
  eventSpec: SubscriptionEventSpec;
  loading: boolean;
  page: number;
  onEventClick?: (id: number) => void;
  eventList: Array<SubscriptionEvent>;
  extraFetchParams?: any;
};

type WithHandlerType = {
  fetchEventPage: (page: number, eventTypeList?: Array<string>) => void;
};

type Props = OwnProps & WithTranslation & WithStyles & WithHandlerType;

type State = {
  actionFilterList: Array<string>;
  openFilters?: HTMLElement;
};

export class SubscriptionEventPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      actionFilterList: [],
      openFilters: null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.extraFetchParams?.object_id !==
      this.props.extraFetchParams?.object_id
    ) {
      this.fetchEventPageFiltered(1);
    }
  }

  updateFilters = (actionFilterList: Array<string>) => {
    this.setState({
      actionFilterList,
    });
    this.props.fetchEventPage(1, actionFilterList);
  };

  fetchEventPageFiltered = (page: number) => {
    this.props.fetchEventPage(page, this.state.actionFilterList || null);
  };

  render() {
    return (
      <div>
        <div className={this.props.classes.row}>
          <Typography variant="subtitle">
            {this.props.t('list.title.latestEvents')}
          </Typography>
          <IconButton
            onClick={(ev) => this.setState({ openFilters: ev.currentTarget })}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={this.state.openFilters}
            open={Boolean(this.state.openFilters)}
            onClose={() => this.setState({ openFilters: null })}
          >
            {Object.keys(this.props.eventSpec)
              .filter((e) => !this.state.actionFilterList.includes(e))
              .map((e) => (
                <MenuItem
                  key={e}
                  dense
                  onClick={() =>
                    this.updateFilters([...this.state.actionFilterList, e])
                  }
                >
                  <ListItemIcon>{this.props.eventSpec[e].icon}</ListItemIcon>
                  <Typography variant="inherit">
                    {this.props.t(this.props.eventSpec[e].i18nText)}
                  </Typography>
                </MenuItem>
              ))}
          </Menu>
        </div>
        {this.state.actionFilterList.length ? (
          <div>
            <Divider />
            <div className={this.props.classes.actionFilterList}>
              {this.state.actionFilterList.map((e) => (
                <Chip
                  icon={this.props.eventSpec[e].icon}
                  label={this.props.t(this.props.eventSpec[e].i18nText)}
                  key={e}
                  onDelete={() =>
                    this.updateFilters(
                      this.state.actionFilterList.filter((e_) => e !== e_),
                    )
                  }
                  variant="outlined"
                  size="small"
                />
              ))}
            </div>
          </div>
        ) : null}
        <Divider />
        <PaginatedListBase
          itemPerPage={10}
          nbItems={0}
          unknownNbItems
          loading={this.props.loading}
          listProps={{ dense: true, disablePadding: true }}
          items={this.props.eventList}
          page={this.props.page}
          onPageRequested={this.fetchEventPageFiltered}
          renderItem={(event: SubscriptionEvent) => (
            <EventListItem
              event={event}
              eventSpec={this.props.eventSpec}
              key={`${event.date}:${event.identifier}`}
              onEventClick={this.props.onEventClick}
            />
          )}
        />
      </div>
    );
  }
}

const styles: any = (theme: Theme) => ({
  row: {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionFilterList: {
    flexWrap: 'wrap',
    backgroundColor: '#F8F8F8',
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: '100%',
    '& > *': {
      margin: theme.spacing(1) / 2,
    },
  },
});

export default compose<any, OwnProps>(
  withTranslation(['event']),
  withStyles(styles),
  withHandlers({
    fetchEventPage:
      ({ fetchEventList, eventSpec, extraFetchParams }) =>
      (page: number, eventTypeList?: Array<string>) =>
        fetchEventList({
          page,
          page_size: 10,
          event_types: eventTypeList || Object.keys(eventSpec),
          ...(extraFetchParams || {}),
        }),
  }),
)(SubscriptionEventPanel);
