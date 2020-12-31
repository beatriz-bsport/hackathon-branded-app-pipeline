// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment-timezone';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import Divider from '@material-ui/core/Divider';

import RedButton from '../../../../components/button/RedButton.component';
import type { PrivateConsumerPass } from '../../types';
import { getExpirationDate } from '../../utils';

type Props = {
  private_consumer_pass: PrivateConsumerPass,
  onClick?: () => void,
  onBook?: () => void,
  t: TFunction,
  classes: Object,
  selected?: boolean,
  divider?: boolean,
  onUpdateCredit?: (id: number, credits: 1, options: OptionCallback) => void,
  creditProcessing: boolean,
  setCreditProcessing: (boolean) => void,
  showMember?: boolean,
  disabled?: boolean,
  button?: Node,
};

export const PrivateConsumerPassBookerListItem = (props: Props) => {
  const { button, private_consumer_pass, showMember, t, classes } = props;
  const { private_pass } = private_consumer_pass;
  const isFromShare =
    private_consumer_pass &&
    (private_consumer_pass.dst_private_consumer_pass &&
      private_consumer_pass.dst_private_consumer_pass.length);
  const isOwnerOfShares =
    private_consumer_pass &&
    (private_consumer_pass.src_private_consumer_pass &&
      private_consumer_pass.src_private_consumer_pass.length);
  const expirationDate = getExpirationDate(private_consumer_pass);
  let { name } = private_pass;
  if (showMember) {
    name =
      (private_consumer_pass.member && private_consumer_pass.member.name) ||
      ' - ';
  }
  const renderButton = () => {
    if (props.creditProcessing) {
      return <CircularProgress />;
    }
    if (private_consumer_pass.dst_private_consumer_pass.length) {
      return null;
    }
    if (props.onBook) {
      return (
        <Button color="primary" variant="outlined" onClick={props.onBook}>
          {t('bookerModule.useCredit')}
        </Button>
      );
    }
    if (private_consumer_pass.reverted) {
      return (
      <RedButton variant="outlined">
        {t('consumerPass.isReverted')}
      </RedButton>);
    }
    if (!props.onUpdateCredit) {
      return null;
    }
    return (
      <div tyle={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton
          color="primary"
          onClick={(ev) => {
            ev.stopPropagation();
            props.setCreditProcessing(true);
            props.onUpdateCredit(private_consumer_pass.id, 1, {
              onSuccess: () => props.setCreditProcessing(false),
              onError: () => props.setCreditProcessing(false),
            });
          }}
        >
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={(ev) => {
            ev.stopPropagation();
            props.setCreditProcessing(true);
            props.onUpdateCredit(private_consumer_pass.id, -1, {
              onSuccess: () => props.setCreditProcessing(false),
              onError: () => props.setCreditProcessing(false),
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
        className={private_consumer_pass.reverted || private_consumer_pass.disabled
          ? classes.disabled
          : null}
      >
        {showMember && private_consumer_pass && private_consumer_pass.member && (
          <ListItemAvatar>
            <Avatar src={private_consumer_pass.member.photo} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={
            <div>
              <Typography>{name}</Typography>
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
                {t('consumerPass.expiresOn', {
                  date: moment(expirationDate).format('LL'),
                })}
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
    </>
  );
};

const styles = () => ({
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
  withState('creditProcessing', 'setCreditProcessing', false),
)(PrivateConsumerPassBookerListItem);
