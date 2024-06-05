import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import makeStyles from '@material-ui/core/styles/makeStyles';

import ReplacementRequestStatusChip from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestStatusChip.component';
import { ReplacementRequestStatus } from '#src/libs/replacement-request/constants';

type Props = {
  anchorEl: HTMLElement;
  handleStatusPopoverOpen: (event: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
};

export const ReplacementRequestStatusPopover: React.FC<Props> = ({
  anchorEl,
  handleStatusPopoverOpen,
  open,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  return (
    <Popover
      disableRestoreFocus
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      classes={{ paper: classes.popoverPaper }}
      className={classes.popover}
      id="mouse-over-popover"
      onClose={handleStatusPopoverOpen}
      open={open}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Typography>{t('replacementStatus.description.description')}</Typography>
      <div className={classes.description}>
        <ReplacementRequestStatusChip
          floatChip
          replacementRequestStatus={
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS
          }
        />
        <Typography className={classes.statusDescription}>
          {t(
            'replacementStatus.description.approvedButNoReplacementPropositions',
          )}
        </Typography>
      </div>
      <div className={classes.description}>
        <ReplacementRequestStatusChip
          floatChip
          replacementRequestStatus={
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS
          }
        />
        <Typography className={classes.statusDescription}>
          {t(
            'replacementStatus.description.approvedWithReplacementPropositions',
          )}
        </Typography>
      </div>
      <div className={classes.description}>
        <ReplacementRequestStatusChip
          floatChip
          replacementRequestStatus={
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_DISPLAYED_AS_CANCELLED_BECAUSE_OFFER_IS_CANCELLED
          }
        />
        <Typography className={classes.statusDescription}>
          {t('replacementStatus.description.offerCancelled')}
        </Typography>
      </div>
    </Popover>
  );
};

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverPaper: {
    padding: theme.spacing(2),
    maxWidth: '20%',
  },
  description: {
    marginTop: theme.spacing(1),
  },
  statusDescription: {
    lineHeight: 1.75,
  },
}));

export default ReplacementRequestStatusPopover;
