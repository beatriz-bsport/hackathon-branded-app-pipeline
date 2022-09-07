import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import Divider from '@material-ui/core/Divider';

import { OptionCallback } from '../../../../state/types';
import RedButton from '../../../../components/button/RedButton.component';
import type { PrivateConsumerPass } from '../../types';
import { getPassDate } from '../../utils';
import { Member } from '#libs/member/types';

type Props = {
  private_consumer_pass: PrivateConsumerPass<Member>;
  onClick?: () => void;
  onBook?: (options: OptionCallback) => void;
  selected?: boolean;
  divider?: boolean;
  onUpdateCredit?: (
    id: number,
    credits: -1 | 1,
    options: OptionCallback,
  ) => void;
  showMember?: boolean;
  disabled?: boolean;
  button?: Node;
  showUniversalWarning?: boolean;
};

export const PrivateConsumerPassBookerListItem: React.FC<Props> = (props) => {
  const { button, private_consumer_pass, showMember, showUniversalWarning } =
    props;
  const { private_pass } = private_consumer_pass;
  const isFromShare =
    private_consumer_pass &&
    private_consumer_pass.dst_private_consumer_pass &&
    private_consumer_pass.dst_private_consumer_pass.length;
  const isOwnerOfShares =
    private_consumer_pass &&
    private_consumer_pass.src_private_consumer_pass &&
    private_consumer_pass.src_private_consumer_pass.length;

  const isUniversal =
    private_consumer_pass && private_consumer_pass.linked_consumer_payment_pack;
  const [processing, setProcessing] = useState(false);
  const [creditProcessing, setCreditProcessing] = useState(false);

  const { t } = useTranslation('privateService');
  const classes = useStyles();
  const renderMemberName = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography>
        {`${
          (private_consumer_pass.member && private_consumer_pass.member.name) ||
          ' - '
        }`}
      </Typography>
      {private_consumer_pass.member && private_consumer_pass.member.archived && (
        <Typography variant="caption" color="secondary">
          {`${'\u00A0'}(${t('member:archived')})`}
        </Typography>
      )}
    </div>
  );
  const renderButton = () => {
    if (processing) {
      return <CircularProgress />;
    }
    if (props.onBook) {
      return (
        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            setProcessing(true);
            props.onBook({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        >
          {t('bookerModule.useCredit')}
        </Button>
      );
    }
    if (private_consumer_pass.reverted) {
      return (
        <RedButton variant="outlined">{t('consumerPass.isReverted')}</RedButton>
      );
    }
    if (
      !props.onUpdateCredit ||
      props.private_consumer_pass?.private_pass?.template_instance ||
      private_consumer_pass.dst_private_consumer_pass.length
    ) {
      return null;
    }
    if (creditProcessing) {
      return <CircularProgress />;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton
          color="primary"
          onClick={(ev) => {
            ev.stopPropagation();
            setCreditProcessing(true);
            props.onUpdateCredit(private_consumer_pass.id, 1, {
              onSuccess: () => setCreditProcessing(false),
              onError: () => setCreditProcessing(false),
            });
          }}
        >
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={(ev) => {
            ev.stopPropagation();
            setCreditProcessing(true);
            props.onUpdateCredit(private_consumer_pass.id, -1, {
              onSuccess: () => setCreditProcessing(false),
              onError: () => setCreditProcessing(false),
            });
          }}
        >
          <ExposureNeg1Icon />
        </IconButton>
      </div>
    );
  };
  return (
    <>
      <ListItem
        divider={!!props.divider}
        selected={!!props.selected}
        dense
        disabled={!!props.disabled}
        button={!!props.onClick}
        onClick={props.onClick}
        className={
          private_consumer_pass.reverted || private_consumer_pass.disabled
            ? classes.disabled
            : null
        }
      >
        {showMember && private_consumer_pass && private_consumer_pass.member && (
          <ListItemAvatar>
            <Avatar src={private_consumer_pass.member.photo} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={
            <div>
              {!showMember ? (
                <Typography>{private_pass.name}</Typography>
              ) : (
                renderMemberName()
              )}
              <Typography variant="caption">
                {t('consumerPass.current_credits', {
                  credits: private_pass.credits,
                  current_credits:
                    private_pass.credits - private_consumer_pass.used_credits,
                })}
              </Typography>
            </div>
          }
          secondary={
            <div>
              <Typography color="textPrimary" variant="caption">
                {getPassDate(private_consumer_pass)[0]}
              </Typography>
            </div>
          }
        />
        {button || renderButton()}
      </ListItem>
      {isFromShare || isOwnerOfShares ? (
        <React.Fragment>
          <Typography
            style={{ paddingLeft: 16 }}
            variant="caption"
            color="textSecondary"
          >
            {' '}
            {isOwnerOfShares ? t('consumerPass.isOwnerOfShares') : ''}
            {isFromShare && private_consumer_pass.disabled
              ? t('consumerPass.isFromDisabledShare')
              : ''}
            {isFromShare && !private_consumer_pass.disabled
              ? t('consumerPass.isFromShare')
              : ''}
          </Typography>
          <Divider />
        </React.Fragment>
      ) : null}
      {showUniversalWarning && isUniversal ? (
        <React.Fragment>
          <Typography
            style={{ paddingLeft: 16 }}
            variant="caption"
            color="error"
          >
            {t('consumerPass.warningShareUniversal')}
          </Typography>
          <Divider />
        </React.Fragment>
      ) : null}
    </>
  );
};

const useStyles = makeStyles(() => ({
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
}));

export default PrivateConsumerPassBookerListItem;
