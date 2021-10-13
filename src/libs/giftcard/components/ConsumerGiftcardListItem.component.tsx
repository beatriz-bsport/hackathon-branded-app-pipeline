import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import GiftIcon from '@material-ui/icons/Redeem';
import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/Email';
import IconButton from '@material-ui/core/IconButton';
import CartIcon from '@material-ui/icons/ShoppingCart';

import { Giftcard, ConsumerGiftcard } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Member } from '../../member/types';

type SenderProps = {
  giftcard: Giftcard;
  consumerGiftcard: ConsumerGiftcard;
  onClick: (
    consumerGiftcardId: number,
    giftcardId: number,
    memberId: number,
  ) => void;
  selected?: boolean;
  memberSender?: Member;
  showMember?: boolean;
};

const GiftcardSender = (props: SenderProps) => {
  const classes = useStyles();

  return (
    <ListItem
      selected={props.selected}
      button={!!props.onClick}
      onClick={
        props.onClick &&
        (() =>
          props.onClick(
            props.consumerGiftcard?.id,
            props.giftcard?.id,
            props.memberSender?.id,
          ))
      }
    >
      {!!props.showMember && (
        <ListItemAvatar>
          <Avatar alt="member" src={props.memberSender?.photo} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={
          <div className={classes.row}>
            <CartIcon className={classes.icon} fontSize="small" />
            <span>
              {props.showMember
                ? props.memberSender?.name || ' - '
                : props.giftcard?.name || ''}
            </span>
          </div>
        }
        secondary={`${getCurrencyDisplayWithPrice(
          props.giftcard.price,
        )} - ${moment(props.consumerGiftcard.date_created).format('L')}`}
      />
    </ListItem>
  );
};

type ReceiverProps = {
  giftcard: Giftcard;
  consumerGiftcard: ConsumerGiftcard;
  onClick: (
    consumerGiftcardId: number,
    giftcardId: number,
    memberId: number,
  ) => void;
  selected?: boolean;
  memberReceiver?: Member;
  showMember?: boolean;
  onClickSendInvitation?: () => void;
};

const GiftcardReceiver = (props: ReceiverProps) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();

  const receiverName = props.consumerGiftcard.dst_member
    ? props.memberReceiver?.name
    : t('consumerGiftcard.notAttributedYet');

  const status = props.consumerGiftcard.dst_member ? (
    <span>
      <span
        className={
          props.consumerGiftcard.consumed_amount_gifted >= props.giftcard.price
            ? classes.errorText
            : classes.primaryText
        }
      >
        {`${(
          props.giftcard.price - props.consumerGiftcard.consumed_amount_gifted
        ).toFixed(2)}
        /${getCurrencyDisplayWithPrice(props.giftcard.price)}`}
      </span>
      <span>
        {` - ${t('consumerGiftcard.expiresOn', {
          d: moment(props.consumerGiftcard.date_activated)
            .add(props.giftcard.expiration_days, 'days')
            .format('L'),
        })}`}
      </span>
    </span>
  ) : (
    t(
      props.consumerGiftcard.invitation_sent
        ? 'consumerGiftcard.invitedOn'
        : 'consumerGiftcard.willInviteOn',
      {
        d: moment(props.consumerGiftcard.planned_date_send).format('L'),
      },
    )
  );

  return (
    <ListItem
      button={!!props.onClick}
      selected={props.selected}
      onClick={
        props.onClick &&
        (() =>
          props.onClick(
            props.consumerGiftcard?.id,
            props.giftcard?.id,
            props.memberReceiver?.id,
          ))
      }
    >
      {!!props.showMember && !!props.consumerGiftcard.est_member && (
        <ListItemAvatar>
          <Avatar alt="member" src={props.memberReceiver?.photo} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={
          <div className={classes.row}>
            {props.showMember ? (
              <GiftIcon className={classes.icon} fontSize="small" />
            ) : (
              <EmailIcon className={classes.icon} fontSize="small" />
            )}
            <span>
              {props.showMember
                ? receiverName
                : props.consumerGiftcard.giftcard_recipients
                    .map((gr) => gr.email_sent_to)
                    .join(', ') || ''}
            </span>
          </div>
        }
        secondary={status}
      />
      {!!props.onClickSendInvitation && !props.consumerGiftcard?.reverted && (
        <Tooltip title={t('consumerGiftcard.sendTo')}>
          <IconButton color="primary" onClick={props.onClickSendInvitation}>
            <EmailIcon />
          </IconButton>
        </Tooltip>
      )}
    </ListItem>
  );
};

type ContainerProps = {
  leftComponent: (selected: boolean) => any;
  rightComponent: () => any;
  reverseArrow: boolean;
  selected: boolean;
};

const Container = (props: ContainerProps) => {
  const classes = useStyles(props);
  return (
    <div className={classes.container}>
      {props.leftComponent(props.selected)}
      {props.reverseArrow ? (
        <ArrowBackIcon style={{ color: 'gray' }} />
      ) : (
        <ArrowForwardIcon style={{ color: 'gray' }} />
      )}
      {props.rightComponent()}
    </div>
  );
};

type Props = {
  giftcard: Giftcard;
  consumerGiftcard: ConsumerGiftcard;
  memberSender?: Member;
  memberReceiver?: Member;
  showAsRecipient?: boolean;
  showSender?: boolean;
  showReceiver?: boolean;
  onClickSender: (
    consumerGiftcardId: number,
    giftcardId: number,
    memberId: number,
  ) => void;
  onClickReceiver: (
    consumerGiftcardId: number,
    giftcardId: number,
    memberId: number,
  ) => void;
  onClickSendInvitation?: () => void;
  selected?: boolean;
  divider?: boolean;
};

const ConsumerGiftcardListItem = React.memo((props: Props) => {
  const {
    giftcard,
    consumerGiftcard,
    memberSender,
    memberReceiver,
    showAsRecipient,
    showSender,
    showReceiver,
    onClickSender,
    onClickReceiver,
    onClickSendInvitation,
    selected,
    divider,
  } = props;

  if (!giftcard) return null;

  const reverted = consumerGiftcard.reverted;

  const sender = (selected_: boolean) => (
    <GiftcardSender
      consumerGiftcard={consumerGiftcard}
      memberReceiver={memberReceiver}
      selected={selected_}
      memberSender={memberSender}
      giftcard={giftcard}
      showMember={showSender}
      onClick={onClickSender}
    />
  );
  const receiver = (selected_: boolean) => (
    <GiftcardReceiver
      selected={selected_}
      consumerGiftcard={consumerGiftcard}
      memberReceiver={memberReceiver}
      memberSender={memberSender}
      giftcard={giftcard}
      showMember={showReceiver}
      onClick={onClickReceiver}
      onClickSendInvitation={onClickSendInvitation}
    />
  );

  return (
    <Container
      reverted={reverted}
      selected={selected}
      divider={divider}
      reverseArrow={showAsRecipient}
      leftComponent={showAsRecipient ? receiver : sender}
      rightComponent={showAsRecipient ? sender : receiver}
    />
  );
});

const useStyles = makeStyles((theme: Theme) => ({
  container: (props) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: props.reverted ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
    borderBottom: props.divider ? '1px solid #DEDEDE' : '',
  }),
  row: {
    display: 'flex',
    flexDirection: 'row',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  icon: {
    color: 'gray',
  },
  errorText: {
    color: theme.palette.error.main,
  },
  primaryText: {
    color: theme.palette.primary.main,
  },
}));

export default ConsumerGiftcardListItem;
