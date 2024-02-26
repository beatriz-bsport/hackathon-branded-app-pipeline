import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import Divider from '@material-ui/core/Divider';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import InfoIcon from '@material-ui/icons/Info';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

import { getCreditFactor } from '#libs/theme/selectors';
import {
  getPassDate,
  getSpecificIncompatibilitiesReasons,
} from '#libs/private-service/utils';
import ConsumerPrivatePassIncompatibilitiesReasons from './ConsumerPrivatePassIncompatibilitiesReasons.component';
import RedButton from '#components/button/RedButton.component';

import type { OptionCallback } from '../../../../state/types';
import type { PrivateConsumerPass } from '#libs/private-service/types';
import type { Member } from '#libs/member/types';

type Props = {
  button?: Node;
  disabled?: boolean;
  divider?: boolean;
  incompatibilitiesReasons: { [cpp_id: number]: number[] };
  isNonCompatible: boolean;
  private_consumer_pass: PrivateConsumerPass<Member>;
  privateSlotId: number;
  selected?: boolean;
  showMember?: boolean;
  showUniversalWarning?: boolean;
  width: Breakpoint;
  fetchIncompatibilitiesReasonsBySlotByConsumerPass: (
    pcp_id: number,
    slot_id: number,
    options: OptionCallback,
  ) => void;
  goToPrivatePass: () => void;
  onBook?: (options: OptionCallback) => void;
  onClick?: () => void;
  onUpdateCredit?: (
    id: number,
    credits: -1 | 1,
    options: OptionCallback,
  ) => void;
};

export const PrivateConsumerPassBookerListItem: React.FC<Props> = ({
  button,
  disabled,
  divider,
  incompatibilitiesReasons,
  isNonCompatible,
  private_consumer_pass,
  privateSlotId,
  selected,
  showMember,
  showUniversalWarning,
  width,
  fetchIncompatibilitiesReasonsBySlotByConsumerPass,
  goToPrivatePass,
  onBook,
  onClick,
  onUpdateCredit,
}) => {
  const { t } = useTranslation(['privateService', 'paymentPack']);
  const classes = useStyles();

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

  const [consumerPassHasBeenHovered, setConsumerPassHasBeenHovered] =
    useState(false);
  const [showIncompatibilities, setShowIncompatibilities] = useState(false);
  const [incompatibilitiesAreLoading, setIncompatibilitiesAreLoading] =
    useState(true);

  const handleInfoIncompatibilitesHovering = React.useCallback(() => {
    if (consumerPassHasBeenHovered) {
      setShowIncompatibilities(true);
      return;
    }
    fetchIncompatibilitiesReasonsBySlotByConsumerPass(
      private_consumer_pass.id,
      privateSlotId,
      {
        onSuccess: () => setIncompatibilitiesAreLoading(false),
        onError: () => setIncompatibilitiesAreLoading(false),
      },
    );
    setShowIncompatibilities(true);
    setConsumerPassHasBeenHovered(true);
  }, [
    consumerPassHasBeenHovered,
    fetchIncompatibilitiesReasonsBySlotByConsumerPass,
    privateSlotId,
    private_consumer_pass.id,
  ]);

  const handleInfoIncompatibilitesLeaving = React.useCallback(() => {
    setShowIncompatibilities(false);
  }, []);

  const addCredit = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event?.stopPropagation();
      setCreditProcessing(true);
      onUpdateCredit(private_consumer_pass.id, 1, {
        onSuccess: () => setCreditProcessing(false),
        onError: () => setCreditProcessing(false),
      });
    },
    [onUpdateCredit, private_consumer_pass.id],
  );

  const removeCredit = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event?.stopPropagation();
      setCreditProcessing(true);
      onUpdateCredit(private_consumer_pass.id, -1, {
        onSuccess: () => setCreditProcessing(false),
        onError: () => setCreditProcessing(false),
      });
    },
    [onUpdateCredit, private_consumer_pass.id],
  );

  const handleBook = React.useCallback(() => {
    setProcessing(true);
    onBook?.({
      onSuccess: () => setProcessing(false),
      onError: () => setProcessing(false),
    });
  }, [onBook]);

  const renderMemberName = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography>
        {`${
          (private_consumer_pass.member && private_consumer_pass.member.name) ||
          ' - '
        }`}
      </Typography>
      {private_consumer_pass.member &&
        private_consumer_pass.member.archived && (
          <Typography color="secondary" variant="caption">
            {`${'\u00A0'}(${t('member:archived')})`}
          </Typography>
        )}
    </div>
  );

  const renderButton = () => {
    if (processing) {
      return <CircularProgress />;
    }

    const isMobile = isWidthDown('sm', width);
    const closeMobileIncompatibilities = isMobile
      ? handleInfoIncompatibilitesLeaving
      : null;

    if (isNonCompatible) {
      const specificIncompatibilitiesReasons =
        getSpecificIncompatibilitiesReasons(
          incompatibilitiesReasons,
          privateSlotId,
          private_consumer_pass?.id,
        );

      return (
        <div>
          <div className={classes.buttonsContainer}>
            {isMobile ? (
              <IconButton onClick={handleInfoIncompatibilitesHovering}>
                <InfoIcon />
              </IconButton>
            ) : (
              <InfoIcon
                onMouseEnter={handleInfoIncompatibilitesHovering}
                onMouseLeave={handleInfoIncompatibilitesLeaving}
              />
            )}

            <IconButton color="secondary" onClick={goToPrivatePass}>
              <ArrowForwardIcon />
            </IconButton>
          </div>
          {showIncompatibilities &&
            (incompatibilitiesAreLoading ? (
              <div className={classes.container}>
                <CircularProgress />
              </div>
            ) : (
              <div className={classes.tooltipContainer}>
                <ConsumerPrivatePassIncompatibilitiesReasons
                  closeMobileIncompatibilities={closeMobileIncompatibilities}
                  extraStartingDate={private_consumer_pass.date_bought}
                  reasons={specificIncompatibilitiesReasons ?? []}
                />
              </div>
            ))}
        </div>
      );
    }

    if (onBook) {
      return (
        <Button color="primary" onClick={handleBook} variant="outlined">
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
      !onUpdateCredit ||
      private_consumer_pass.dst_private_consumer_pass.length
    ) {
      return null;
    }
    if (creditProcessing) {
      return <CircularProgress />;
    }

    if (private_consumer_pass.private_consumer_pass_source) {
      return (
        <Chip
          color="primary"
          label={t(
            'paymentPack:paymentPackTemplateInstance.consumerPaymentPackSharedFromOtherFranchisee',
          )}
        />
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton
          color="primary"
          disabled={private_consumer_pass.used_credits === 0}
          onClick={addCredit}
        >
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton
          color="secondary"
          disabled={
            private_consumer_pass.used_credits >=
            private_consumer_pass.private_pass?.credits
          }
          onClick={removeCredit}
        >
          <ExposureNeg1Icon />
        </IconButton>
      </div>
    );
  };
  return (
    <>
      <ListItem
        dense
        button={!!onClick as any}
        className={
          private_consumer_pass.reverted ||
          private_consumer_pass.disabled ||
          isNonCompatible
            ? classes.disabled
            : null
        }
        disabled={!!disabled}
        divider={!!divider}
        onClick={onClick}
        selected={!!selected}
      >
        {showMember &&
          private_consumer_pass &&
          private_consumer_pass.member && (
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
                  credits: private_pass.credits / getCreditFactor(),
                  current_credits:
                    (private_pass.credits -
                      private_consumer_pass.used_credits) /
                    getCreditFactor(),
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
            color="textSecondary"
            style={{ paddingLeft: 16 }}
            variant="caption"
          >
            ${isOwnerOfShares ? t('consumerPass.isOwnerOfShares') : ''}
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
      {showUniversalWarning && isUniversal && (
        <React.Fragment>
          <Typography
            color="error"
            style={{ paddingLeft: 16 }}
            variant="caption"
          >
            {t('consumerPass.warningShareUniversal')}
          </Typography>
          <Divider />
        </React.Fragment>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  disabled: {
    backgroundColor: '#FFF0EF',
  },
  container: {
    width: '150px',
    height: '150px',
    position: 'absolute',
    backgroundColor: 'white',
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    zIndex: 1500,
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipContainer: {
    position: 'absolute',
    right: 0,
    zIndex: 1500,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    maxWidth: '340px',
    height: 'auto',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.shadows[1],
  },
}));

export default withWidth()(React.memo(PrivateConsumerPassBookerListItem));
