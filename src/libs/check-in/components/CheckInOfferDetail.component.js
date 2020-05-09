// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { Member } from '../../member/types';

import CheckInOfferSummaryPanel from './CheckInOfferSummaryPanel.component';
import CheckInBookingItem from './CheckInBookingItem.component';
import BarcodeLiveReader from '../../../components/BarcodeLiveReader.component';

const MEMBER_LIST_REFRESH_DURATION = 1000 * 60 * 2;

type Props = {
  offer: Object,
  classes: Object,
  t: TFunction,
  goBack: () => void,
  members: Array<Member>,
  confirmBookingAttendance: (bookingId: number) => void,
  onAddMember: () => void,
  bookingLoading: boolean,
  refreshData: () => void,
  barcodeMode: boolean,
  setBarcodeMode: (boolean) => void,
  showLiveStream: boolean,
  onBarcodeDetected: (string) => void,
};

export class CheckInOffer extends Component<Props> {
  interval: any;

  componentDidMount() {
    this.interval = setInterval(
      this.props.refreshData,
      MEMBER_LIST_REFRESH_DURATION,
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  previousPage = () => {
    clearInterval(this.interval);
    this.props.goBack();
  };

  render() {
    if (!this.props.offer) {
      return <CircularProgress />;
    }
    const { members, t } = this.props;
    return (
      <div className={this.props.classes.root}>
        <div
          className={classNames([
            this.props.classes.panelContainer,
            this.props.classes.offerSummary,
          ])}
        >
          <CheckInOfferSummaryPanel
            offer={this.props.offer}
            goBack={this.previousPage}
          />
        </div>
        <div
          className={classNames([
            this.props.classes.panelContainer,
            this.props.classes.memberList,
          ])}
        >
          <div className={this.props.classes.row}>
            <Switch
              checked={this.props.barcodeMode}
              onChange={(ev) => this.props.setBarcodeMode(ev.target.checked)}
            />
            <Typography>
              {this.props.t('offerDetail.activateBarcode')}
            </Typography>
          </div>
          {this.props.barcodeMode ? (
            <div>
              {this.props.showLiveStream ? (
                <BarcodeLiveReader onDetected={this.props.onBarcodeDetected} />
              ) : null}
            </div>
          ) : (
            <div>
              <List disablePadding>
                {this.props.bookingLoading ? (
                  <LinearProgress />
                ) : (
                  <ListItem
                    button
                    disabled={this.props.offer.is_full}
                    onClick={this.props.onAddMember}
                    className={this.props.classes.registerListItem}
                  >
                    <ListItemAvatar>
                      <AddIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        this.props.offer.is_full
                          ? t('offerDetail.isFull')
                          : t('offerDetail.register')
                      }
                    />
                  </ListItem>
                )}
                {(members || []).map((member) => (
                  <CheckInBookingItem
                    member={member}
                    key={member.booking.id}
                    confirmAttendance={() =>
                      this.props.confirmBookingAttendance(member.booking.id)
                    }
                  />
                ))}
              </List>
              {(members || []).length === 0 && !this.props.bookingLoading ? (
                <Typography variant="body2" color="textSecondary">
                  {t('offerDetail.emptyList')}
                </Typography>
              ) : null}
            </div>
          )}
        </div>
        <Button
          variant="extendedFab"
          color="secondary"
          className={this.props.classes.backButton}
          onClick={this.previousPage}
        >
          <ChevronLeftIcon className={this.props.classes.leftIcon} />
          {t('offerDetail.backToOfferList')}
        </Button>
        <Button
          onClick={this.props.onAddMember}
          color="primary"
          variant="extendedFab"
          disabled={this.props.offer.is_full}
          className={this.props.classes.registerButton}
        >
          <PersonAddIcon className={this.props.classes.leftIcon} />
          {this.props.offer.is_full
            ? t('offerDetail.isFull')
            : t('offerDetail.register')}
        </Button>
      </div>
    );
  }
}

const style = (theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(12),
  },
  panelContainer: {
    padding: theme.spacing(2),
    height: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  registerButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  backButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  memberList: {
    width: '60%',
  },
  offerSummary: {
    width: '40%',
    borderRight: `1px solid ${theme.palette.grey[200]}`,
  },
  registerListItem: {
    marginBottom: theme.spacing(1) / 3,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default compose(
  withNamespaces(['selfCheckIn']),
  withStyles(style),
  withState('barcodeMode', 'setBarcodeMode', false),
)(CheckInOffer);
