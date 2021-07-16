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
import { Theme } from '@material-ui/core/styles';
import { BookingOptionWithActivity } from '../../booking/types';
import { MaterialStyleType } from '../../../utils/types';

interface OwnProps {
  bookingOption: BookingOptionWithActivity;
  onClick: () => void;
  onClickRegister: (bookingOption: BookingOptionWithActivity) => void;
  onClickDiscard: (bookingOption: BookingOptionWithActivity) => void;
  selectedBookingOption?: BookingOptionWithActivity;
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class BookingOptionItem extends React.PureComponent<Props> {
  render() {
    const { classes, t, bookingOption, selectedBookingOption } = this.props;

    return (
      <ListItem
        divider
        onClick={this.props.onClick}
        selected={selectedBookingOption?.id === bookingOption.id}
      >
        <ListItemText
          primary={bookingOption.offer.activity.name}
          secondary={moment(bookingOption.offer.date_start).format('LLL')}
        />
        <div>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              this.props.onClickRegister(this.props.bookingOption);
            }}
          >
            {t('member.addToBook')}
          </Button>

          <IconButton
            className={classes.marginLeft}
            onClick={(e) => {
              e.stopPropagation();
              this.props.onClickDiscard(this.props.bookingOption);
            }}
          >
            <CancelIcon />
          </IconButton>
        </div>
      </ListItem>
    );
  }
}

const styles = (theme: Theme) => ({
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['waitingList']),
)(BookingOptionItem);
