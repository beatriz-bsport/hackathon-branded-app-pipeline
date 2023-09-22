// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Paper, Theme } from '@material-ui/core';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import { BookingOptionWithActivity } from '../../booking/types';
import { MaterialStyleType } from '../../../utils/types';
import BookingOptionItem from './BookingOptionItem.component';
import type { OfferStatusWaitingListPosition } from '#libs/offer/types';

type OwnProps = {
  onClick: (bookingOption: BookingOptionWithActivity) => void;
  onClickRegister: (bookingOption: BookingOptionWithActivity) => void;
  onClickDiscard: (bookingOption: BookingOptionWithActivity) => void;
  items: Array<BookingOptionWithActivity>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  selectedBookingOption?: BookingOptionWithActivity;
  displayWaitingListPosition: boolean;
  offerStatusWaitingListPositionById: {
    [key: number]: OfferStatusWaitingListPosition;
  };
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const PaginatedBookingOptionList = (props: Props) => {
  return (
    <Paper className={props.classes.waitingListContainer}>
      <div className={props.classes.waitingListTitle}>
        <Typography variant="caption">
          {props.t('waitingList:member.listTitle')}
        </Typography>
      </div>

      <PaginatedListBase
        itemPerPage={props.itemPerPage}
        items={props.items}
        listProps={{ disablePadding: 'true', dense: 'true' }}
        loading={props.loading}
        nbItems={props.nbItems}
        onPageRequested={(page: number, pageSize: number) =>
          props.onPageRequested(page, pageSize)
        }
        page={props.page}
        renderEmpty={() => (
          <div className={props.classes.emptyContainer}>
            <Typography color="textSecondary" variant="caption">
              {props.t('member.empty')}
            </Typography>
          </div>
        )}
        renderItem={(bookingOption: BookingOptionWithActivity) => (
          <BookingOptionItem
            bookingOption={bookingOption}
            displayWaitingListPosition={props.displayWaitingListPosition}
            onClick={() => props.onClick(bookingOption)}
            onClickDiscard={() => props.onClickDiscard(bookingOption)}
            onClickRegister={() => props.onClickRegister(bookingOption)}
            selectedBookingOption={props.selectedBookingOption}
            waitingListPosition={
              props.offerStatusWaitingListPositionById?.[bookingOption.offer.id]
                ?.waiting_list_position
            }
          />
        )}
      />
    </Paper>
  );
};

const styles = (theme: Theme) => ({
  emptyContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'solid',
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
  waitingListContainer: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  waitingListTitle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'solid',
    padding: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['waitingList']),
  withStyles(styles),
)(PaginatedBookingOptionList);
