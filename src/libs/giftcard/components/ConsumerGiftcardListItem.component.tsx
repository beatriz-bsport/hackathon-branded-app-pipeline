// @ts-nocheck
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
import EmailIcon from '@material-ui/icons/Email';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import CartIcon from '@material-ui/icons/ShoppingCart';

import Typography from '@material-ui/core/Typography';
import Tooltip from '#components/Tooltip.component';
import { Giftcard, ConsumerGiftcard, GiftcardTemplate } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Member } from '../../member/types';

type SenderProps = {
  giftcard: Giftcard | GiftcardTemplate;
  consumerGiftcard: ConsumerGiftcard;
  onClick: (consumerGiftcardId: number, memberId: number) => void;
  selected?: boolean;
  memberSender?: Member;
  showMember?: boolean;
  disableItemIfNoMember?: boolean;
};

const GiftcardSender = (props: SenderProps) => {
  const classes = useStyles();
  const { t } = useTranslation('member');
  return (
    <ListItem
      selected={props.selected}
      button={!!props.onClick}
      onClick={
        props.onClick &&
        props.consumerGiftcard?.id &&
        props.memberSender?.id &&
        (() =>
          props.onClick(props.consumerGiftcard?.id, props.memberSender?.id))
      }
      disabled={
        props.disableItemIfNoMember &&
        (!props.consumerGiftcard?.id || !props.memberSender?.id)
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
            {props.showMember ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography>
                  {`${
                    props.memberSender && props.memberSender.name
                      ? props.memberSender.name
                      : '-'
                  }`}
                </Typography>
                {props.memberSender && props.memberSender.archived && (
                  <Typography variant="caption" color="secondary">
                    {`${'\u00A0'}(${t('archived')})`}
                  </Typography>
                )}
              </div>
            ) : (
              <span>{props.giftcard?.name}</span>
            )}
          </div>
        }
        secondary={`${getCurrencyDisplayWithPrice(
          props.consumerGiftcard.price_bought,
        )} - ${moment(props.consumerGiftcard.date_created).format('L')}`}
      />
    </ListItem>
  );
};

type ReceiverProps = {
  giftcard: Giftcard | GiftcardTemplate;
  consumerGiftcard: ConsumerGiftcard;
  onClick: (consumerGiftcardId: number, memberId: number) => void;
  selected?: boolean;
  memberReceiver?: Member;
  showMember?: boolean;
  onClickSendInvitation?: () => void;
  sharedFromFranchisor?: boolean;
  disableItemIfNoMember?: boolean;
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
          props.consumerGiftcard.consumed_amount_gifted >=
          props.consumerGiftcard.price_bought
            ? classes.errorText
            : classes.primaryText
        }
      >
        {`${(
          parseFloat(props.consumerGiftcard.price_bought) -
          parseFloat(props.consumerGiftcard.consumed_amount_gifted)
        ).toFixed(2)}
        /${getCurrencyDisplayWithPrice(props.consumerGiftcard.price_bought)}`}
      </span>
      {!!props.giftcard.expiration_days && (
        <span>
          {` - ${t('consumerGiftcard.expiresOn', {
            d: moment(props.consumerGiftcard.date_activated)
              .add(props.giftcard.expiration_days, 'days')
              .format('L'),
          })}`}
        </span>
      )}
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
        props.consumerGiftcard?.id &&
        props.memberReceiver?.id &&
        (() =>
          props.onClick(props.consumerGiftcard?.id, props.memberReceiver?.id))
      }
      disabled={
        props.disableItemIfNoMember &&
        (!props.consumerGiftcard?.id || !props.memberReceiver?.id)
      }
    >
      {!!props.showMember && !!props.consumerGiftcard.dst_member && (
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
              {props.showMember ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{`${receiverName || '-'}`}</Typography>
                  {props.memberReceiver && props.memberReceiver.archived && (
                    <Typography variant="caption" color="secondary">
                      {`${'\u00A0'}(${t('member:archived')})`}
                    </Typography>
                  )}
                </div>
              ) : (
                props.consumerGiftcard.giftcard_recipients
                  .map((gr) => gr.email_sent_to)
                  .join(', ') || ''
              )}
            </span>
          </div>
        }
        secondary={status}
      />
      {!!props.sharedFromFranchisor && (
        <div className={classes.infoIcon}>
          <Tooltip title={t('giftcardTemplate.sharedCard')}>
            <InfoIcon color="action" />
          </Tooltip>
        </div>
      )}
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
  rightComponent: (selected_: boolean) => any;
  reverseArrow: boolean;
  selected: boolean;
} & StyleProps;

type StyleProps = {
  reverted: boolean;
  divider: boolean;
};

const useContainerStyles = makeStyles(() => ({
  container: (props: StyleProps) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: props?.reverted ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
    borderBottom: props?.divider ? '1px solid #DEDEDE' : '',
  }),
}));

const Container = (props: ContainerProps) => {
  const { reverted, divider } = props;
  const classes = useContainerStyles({ reverted, divider });
  return (
    <div className={classes.container}>
      {props.leftComponent(props.selected)}
      {props.reverseArrow ? (
        <ArrowBackIcon style={{ color: 'gray' }} />
      ) : (
        <ArrowForwardIcon style={{ color: 'gray' }} />
      )}
      {props.rightComponent(props.selected)}
    </div>
  );
};

type Props = {
  giftcard: Giftcard | GiftcardTemplate;
  consumerGiftcard: ConsumerGiftcard;
  memberSender?: Member;
  memberReceiver?: Member;
  showAsRecipient?: boolean;
  showSender?: boolean;
  showReceiver?: boolean;
  onClickSender?: (consumerGiftcardId: number, memberId: number) => void;
  onClickReceiver?: (consumerGiftcardId: number, memberId: number) => void;
  onClickSendInvitation?: () => void;
  selected?: boolean;
  divider?: boolean;
  disabled?: boolean;
  sharedFromFranchisor?: boolean;
  disableItemIfNoMember?: boolean;
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
    sharedFromFranchisor,
    disableItemIfNoMember,
  } = props;

  if (!giftcard) return null;

  const reverted = consumerGiftcard.reverted;

  const sender = (selected_: boolean) => (
    <GiftcardSender
      consumerGiftcard={consumerGiftcard}
      selected={selected_}
      memberSender={memberSender}
      giftcard={giftcard}
      showMember={showSender}
      onClick={onClickSender}
      disableItemIfNoMember={disableItemIfNoMember}
    />
  );
  const receiver = (selected_: boolean) => (
    <GiftcardReceiver
      selected={selected_}
      consumerGiftcard={consumerGiftcard}
      memberReceiver={memberReceiver}
      giftcard={giftcard}
      showMember={showReceiver}
      onClick={onClickReceiver}
      onClickSendInvitation={onClickSendInvitation}
      sharedFromFranchisor={sharedFromFranchisor}
      disableItemIfNoMember={disableItemIfNoMember}
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
  infoIcon: {
    margin: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
  },
}));

export default ConsumerGiftcardListItem;
