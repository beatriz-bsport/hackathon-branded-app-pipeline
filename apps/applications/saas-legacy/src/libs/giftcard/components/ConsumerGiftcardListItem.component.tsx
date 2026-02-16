import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import GiftIcon from '@material-ui/icons/Redeem';
import { DateTime } from 'luxon';
import EmailIcon from '@material-ui/icons/Email';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Typography from '@material-ui/core/Typography';

import Tooltip from '#src/components/Tooltip.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type {
  Giftcard,
  ConsumerGiftcard,
  GiftcardTemplate,
} from '#src/libs/giftcard/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import type { Member } from '#src/libs/member/types';
import CompanyChip from '#src/components/franchise/CompanyChip.component';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

type SenderProps = {
  sourceFranchiseCompany: FranchiseCompany;
  consumerGiftcard: ConsumerGiftcard;
  giftcard: Giftcard | GiftcardTemplate;
  disableItemIfNoMember?: boolean;
  memberSender?: Member;
  selected?: boolean;
  showMember?: boolean;
  onClick: (consumerGiftcardId: number, memberId: number) => void;
};

const GiftcardSender: React.FC<SenderProps> = React.memo(
  ({
    sourceFranchiseCompany,
    consumerGiftcard,
    giftcard,
    disableItemIfNoMember,
    memberSender,
    selected,
    showMember,
    onClick,
  }) => {
    const classes = useStyles();
    const { t } = useTranslation('member');

    const handleOnClickSender = React.useCallback(
      () =>
        isClickable &&
        onClick(
          consumerGiftcard.id,
          sourceFranchiseCompany ? memberSender.user_id : memberSender.id,
        ),
      [
        consumerGiftcard.id,
        // @ts-expect-error
        isClickable,
        memberSender?.id,
        memberSender?.user_id,
        onClick,
        sourceFranchiseCompany,
      ],
    );

    const isClickable = useMemo(
      () => !!onClick && consumerGiftcard?.id && memberSender?.id,
      [consumerGiftcard?.id, memberSender?.id, onClick],
    );

    const priceAndDateCreatedDisplay = useMemo(
      () =>
        `${getCurrencyDisplayWithPrice(
          consumerGiftcard.price_bought,
        )} - ${DateTime.fromISO(consumerGiftcard.date_created).toLocaleString(
          DateTime.DATE_SHORT,
        )}`,
      [consumerGiftcard.price_bought, consumerGiftcard.date_created],
    );

    return (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <ListItem
            // @ts-expect-error
            button={isClickable && hasMemberProfileAccessPermission}
            disabled={
              disableItemIfNoMember &&
              (!consumerGiftcard?.id || !memberSender?.id)
            }
            onClick={
              isClickable && hasMemberProfileAccessPermission
                ? handleOnClickSender
                : null
            }
            selected={selected}
          >
            {!!showMember && (
              <ListItemAvatar>
                <Avatar alt="member" src={memberSender?.photo} />
              </ListItemAvatar>
            )}
            <ListItemText
              primary={
                <div className={classes.row}>
                  <CartIcon className={classes.icon} fontSize="small" />
                  {showMember ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>
                        {`${
                          memberSender && memberSender.name
                            ? memberSender.name
                            : '-'
                        }`}
                      </Typography>
                      {memberSender && memberSender.archived && (
                        <Typography color="secondary" variant="caption">
                          {`${'\u00A0'}(${t('archived')})`}
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <span>{giftcard?.name}</span>
                  )}
                </div>
              }
              secondary={
                <>
                  <Typography variant="body2">
                    {consumerGiftcard.incremental_identifier}
                  </Typography>
                  <Typography variant="body2">
                    {priceAndDateCreatedDisplay}
                  </Typography>
                </>
              }
            />
            <CompanyChip company={sourceFranchiseCompany} />
          </ListItem>
        )}
      </ObjectLevelPermissionProvider>
    );
  },
);

type ReceiverProps = {
  consumerGiftcard: ConsumerGiftcard;
  disableItemIfNoMember?: boolean;
  memberReceiver?: Member;
  selected?: boolean;
  sharedFromFranchisor?: boolean;
  sourceFranchiseCompany?: FranchiseCompany;
  showMember?: boolean;
  onClick: (consumerGiftcardId: number, memberId: number) => void;
  onClickSendInvitation?: () => void;
  /** See details for a printable giftcard */
  onClickSeeDetails?: () => void;
};

const GiftcardReceiver: React.FC<ReceiverProps> = React.memo(
  ({
    consumerGiftcard,
    disableItemIfNoMember,
    memberReceiver,
    selected,
    sharedFromFranchisor,
    sourceFranchiseCompany,
    showMember,
    onClick,
    onClickSendInvitation,
    onClickSeeDetails,
  }) => {
    const { t } = useTranslation('giftcard');
    const classes = useStyles();

    const isPrintableGiftcard =
      consumerGiftcard.kind === ConsumerGiftcardKind.PRINTABLE;

    const receiverName = useMemo(() => {
      if (consumerGiftcard.kind === ConsumerGiftcardKind.PRINTABLE) {
        return consumerGiftcard.message_is_for;
      }
      return consumerGiftcard.dst_member
        ? memberReceiver?.name
        : t('consumerGiftcard.notAttributedYet');
    }, [
      consumerGiftcard?.dst_member,
      consumerGiftcard?.kind,
      consumerGiftcard?.message_is_for,
      memberReceiver?.name,
      t,
    ]);

    const handleSeeDetails = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation?.();
        onClickSeeDetails();
      },
      [onClickSeeDetails],
    );

    const status = consumerGiftcard.dst_member ? (
      <span>
        <span
          className={
            consumerGiftcard.consumed_amount_gifted >=
            consumerGiftcard.price_bought
              ? classes.errorText
              : classes.primaryText
          }
        >
          {`${(
            parseFloat(consumerGiftcard.price_bought) -
            parseFloat(consumerGiftcard.consumed_amount_gifted)
          ).toFixed(2)}
        /${getCurrencyDisplayWithPrice(consumerGiftcard.price_bought)}`}
        </span>
        {!!consumerGiftcard.expiration_date && (
          <span>
            {` - ${t('consumerGiftcard.expiresOn', {
              d: DateTime.fromISO(
                consumerGiftcard.expiration_date,
              ).toLocaleString(DateTime.DATE_SHORT),
            })}`}
          </span>
        )}
      </span>
    ) : (
      t(
        consumerGiftcard.invitation_sent
          ? 'consumerGiftcard.invitedOn'
          : 'consumerGiftcard.willInviteOn',
        {
          d: DateTime.fromISO(
            consumerGiftcard.planned_date_send,
          ).toLocaleString(DateTime.DATE_SHORT),
        },
      )
    );

    const handleOnClickReceiver = React.useCallback(
      () =>
        isClickable &&
        onClick(
          consumerGiftcard.id,
          sourceFranchiseCompany ? memberReceiver.user_id : memberReceiver.id,
        ),

      [
        consumerGiftcard?.id,
        // @ts-expect-error
        isClickable,
        sourceFranchiseCompany,
        memberReceiver?.id,
        memberReceiver?.user_id,
        onClick,
      ],
    );

    const isClickable = useMemo(
      () => !!onClick && consumerGiftcard?.id && memberReceiver?.id,
      [consumerGiftcard?.id, memberReceiver?.id, onClick],
    );

    return (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <ListItem
            // @ts-expect-error
            button={isClickable && hasMemberProfileAccessPermission}
            disabled={
              disableItemIfNoMember &&
              (!consumerGiftcard?.id || !memberReceiver?.id)
            }
            onClick={
              isClickable && hasMemberProfileAccessPermission
                ? handleOnClickReceiver
                : null
            }
            selected={selected}
          >
            {((!!showMember && !!consumerGiftcard.dst_member) ||
              isPrintableGiftcard) && (
              <ListItemAvatar>
                <Avatar alt="member" src={memberReceiver?.photo} />
              </ListItemAvatar>
            )}
            <ListItemText
              hidden={!isPrintableGiftcard}
              primary={
                <div className={classes.row}>
                  {consumerGiftcard.message_is_for}
                </div>
              }
              secondary={t('consumerGiftcard.invitedOn', {
                d: DateTime.fromISO(
                  consumerGiftcard.planned_date_send,
                ).toLocaleString(DateTime.DATE_SHORT),
              })}
            />
            <ListItemText
              hidden={isPrintableGiftcard}
              primary={
                <div className={classes.row}>
                  {showMember ? (
                    <GiftIcon className={classes.icon} fontSize="small" />
                  ) : (
                    <EmailIcon className={classes.icon} fontSize="small" />
                  )}
                  <span>
                    {showMember ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>{`${receiverName || '-'}`}</Typography>
                        {memberReceiver && memberReceiver.archived && (
                          <Typography color="secondary" variant="caption">
                            {`${'\u00A0'}(${t('member:archived')})`}
                          </Typography>
                        )}
                      </div>
                    ) : (
                      consumerGiftcard.giftcard_recipients
                        .map((gr) => gr.email_sent_to)
                        .join(', ') || ''
                    )}
                  </span>
                </div>
              }
              secondary={status}
            />
            {!!sharedFromFranchisor && (
              <div className={classes.infoIcon}>
                <Tooltip title={t('giftcardTemplate.sharedCard')}>
                  <InfoIcon color="action" />
                </Tooltip>
              </div>
            )}
            {!!onClickSendInvitation &&
              !consumerGiftcard?.reverted &&
              consumerGiftcard.kind === ConsumerGiftcardKind.DIGITAL && (
                <Tooltip title={t('consumerGiftcard.sendTo')}>
                  <IconButton color="primary" onClick={onClickSendInvitation}>
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              )}
            {!!onClickSeeDetails &&
              consumerGiftcard.kind === ConsumerGiftcardKind.PRINTABLE && (
                <Tooltip title={t('consumerGiftcard.seeDetails')}>
                  <IconButton onClick={handleSeeDetails}>
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
              )}
          </ListItem>
        )}
      </ObjectLevelPermissionProvider>
    );
  },
);

type ContainerProps = {
  reverseArrow: boolean;
  selected: boolean;
  leftComponent: (selected: boolean) => any;
  rightComponent: (selected_: boolean) => any;
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

const Container: React.FC<ContainerProps> = React.memo(
  ({
    divider,
    reverseArrow,
    reverted,
    selected,
    leftComponent,
    rightComponent,
  }) => {
    const classes = useContainerStyles({ reverted, divider });
    return (
      <div className={classes.container}>
        {leftComponent(selected)}
        {reverseArrow ? (
          <ArrowBackIcon style={{ color: 'gray' }} />
        ) : (
          <ArrowForwardIcon style={{ color: 'gray' }} />
        )}
        {rightComponent(selected)}
      </div>
    );
  },
);

type Props = {
  giftcard: Giftcard | GiftcardTemplate;
  consumerGiftcard: ConsumerGiftcard;
  sourceFranchiseCompany?: FranchiseCompany;
  memberSender?: Member;
  memberReceiver?: Member;
  showAsRecipient?: boolean;
  showSender?: boolean;
  showReceiver?: boolean;
  onClickSender?: (consumerGiftcardId: number, memberId: number) => void;
  onClickReceiver?: (consumerGiftcardId: number, memberId: number) => void;
  onClickSendInvitation?: () => void;
  /** See details for a printable giftcard */
  onClickSeeDetails?: () => void;
  selected?: boolean;
  divider?: boolean;
  sharedFromFranchisor?: boolean;
  disableItemIfNoMember?: boolean;
};

const ConsumerGiftcardListItem: React.FC<Props> = ({
  giftcard,
  sourceFranchiseCompany,
  consumerGiftcard,
  memberSender,
  memberReceiver,
  showAsRecipient,
  showSender,
  showReceiver,
  onClickSender,
  onClickReceiver,
  onClickSendInvitation,
  onClickSeeDetails,
  selected,
  divider,
  sharedFromFranchisor,
  disableItemIfNoMember,
}) => {
  if (!giftcard) return null;

  const reverted = consumerGiftcard.reverted;

  const sender = (selected_: boolean) => (
    <GiftcardSender
      consumerGiftcard={consumerGiftcard}
      disableItemIfNoMember={disableItemIfNoMember}
      giftcard={giftcard}
      memberSender={memberSender}
      onClick={onClickSender}
      selected={selected_}
      showMember={showSender}
      sourceFranchiseCompany={sourceFranchiseCompany}
    />
  );
  const receiver = (selected_: boolean) => (
    <GiftcardReceiver
      consumerGiftcard={consumerGiftcard}
      disableItemIfNoMember={disableItemIfNoMember}
      memberReceiver={memberReceiver}
      onClick={onClickReceiver}
      onClickSeeDetails={onClickSeeDetails}
      onClickSendInvitation={onClickSendInvitation}
      selected={selected_}
      sharedFromFranchisor={sharedFromFranchisor}
      showMember={showReceiver}
      sourceFranchiseCompany={sourceFranchiseCompany}
    />
  );

  return (
    <Container
      divider={divider}
      leftComponent={showAsRecipient ? receiver : sender}
      reverseArrow={showAsRecipient}
      reverted={reverted}
      rightComponent={showAsRecipient ? sender : receiver}
      selected={selected}
    />
  );
};

const useStyles = makeStyles((theme) => ({
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

export default React.memo(ConsumerGiftcardListItem);
