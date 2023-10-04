import React from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/styles/withStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import { withTranslation, WithTranslation } from 'react-i18next';
import cls from 'classnames';
import { Theme } from '@material-ui/core/styles';
import { BookingOptionWithActivity } from '../../booking/types';
import { MaterialStyleType } from '../../../utils/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

interface OwnProps {
  bookingOption: BookingOptionWithActivity;
  onClick: () => void;
  onClickRegister: (bookingOption: BookingOptionWithActivity) => void;
  onClickDiscard: (bookingOption: BookingOptionWithActivity) => void;
  selectedBookingOption?: BookingOptionWithActivity;
  displayWaitingListPosition: boolean;
  waitingListPosition: { member_position: number; waiting_list_size: number };
  shouldHideRemoveWaitlistButton?: boolean;
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class BookingOptionItem extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      t,
      bookingOption,
      selectedBookingOption,
      displayWaitingListPosition,
      waitingListPosition,
    } = this.props;

    const expired = moment(bookingOption.offer.date_start).isBefore(moment());

    return (
      <ListItem
        divider
        className={cls({ [classes.expiredItem]: expired })}
        disabled={expired}
        onClick={this.props.onClick}
        selected={selectedBookingOption?.id === bookingOption.id}
      >
        <ListItemText
          primary={bookingOption.offer.activity.name}
          secondary={
            <div>
              <div>
                {formatAsDatetimeAdapted(bookingOption.offer.date_start, 'LLL')}
              </div>
              {displayWaitingListPosition && waitingListPosition && (
                <div>
                  {t('member.waitingListPosition', {
                    position: waitingListPosition.member_position,
                    size: waitingListPosition.waiting_list_size,
                  })}
                </div>
              )}
            </div>
          }
        />

        {!expired && (
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                this.props.onClickRegister(this.props.bookingOption);
              }}
              variant="outlined"
            >
              {t('member.addToBook')}
            </Button>

            {!this.props.shouldHideRemoveWaitlistButton && (
              <IconButton
                className={classes.marginLeft}
                onClick={(event) => {
                  event.stopPropagation();
                  this.props.onClickDiscard(this.props.bookingOption);
                }}
              >
                <CancelIcon />
              </IconButton>
            )}
          </div>
        )}
      </ListItem>
    );
  }
}

const styles = (theme: Theme) => ({
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  expiredItem: {
    backgroundColor: '#F8F8F8',
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['waitingList']),
)(BookingOptionItem);
