import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import InfoIcon from '@material-ui/icons/Info';

import { ReplacementDisplays } from '#src/libs/replacement-request/constants';
import ReplacementRequestStatusPopover from './ReplacementRequestStatusPopover.component';

type Props = {
  enableMultiLocalization: boolean;
  replacementDisplay: ReplacementDisplays;
};

export const ActivitiesToReplaceTable: React.FC<Props> = ({
  enableMultiLocalization,
  replacementDisplay,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleStatusPopoverOpen = () => {
    setIsOpen(true);
    setAnchorEl(divRef.current);
  };

  const handleStatusPopoverClose = () => {
    setIsOpen(false);
  };

  const headersSpecificToDisplay = useMemo(() => {
    switch (replacementDisplay) {
      case ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR:
        return (
          <TableCell>
            <Typography align="left" className={classes.weight500}>
              {t('header.action')}
            </Typography>
          </TableCell>
        );

      case ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING:
        return (
          <>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.reason')}
              </Typography>
            </TableCell>
            <TableCell>
              <div ref={divRef} className={classes.statusHeader}>
                <Typography align="left" className={classes.weight500}>
                  {t('header.status')}{' '}
                </Typography>
                <div
                  aria-haspopup="true"
                  aria-owns={anchorEl ? 'mouse-over-popover' : undefined}
                  className={classes.iconInfoDiv}
                  onMouseEnter={handleStatusPopoverOpen}
                  onMouseLeave={handleStatusPopoverClose}
                >
                  <InfoIcon className={classes.iconInfo} />
                </div>
                <ReplacementRequestStatusPopover
                  anchorEl={anchorEl}
                  handleStatusPopoverOpen={handleStatusPopoverOpen}
                  open={isOpen}
                />
              </div>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.action')}
              </Typography>
            </TableCell>
          </>
        );

      case ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_TEACHER_FOUND:
        return (
          <>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.reason')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.teacher')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.teacher_override')}
              </Typography>
            </TableCell>
          </>
        );

      case ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE:
        return (
          <>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.teacher')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.closing_date')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.availability')}
              </Typography>
            </TableCell>
          </>
        );

      case ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS:
        return (
          <>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.teacher')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.request')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.closing_date')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.registrations')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.action')}
              </Typography>
            </TableCell>
          </>
        );

      case ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_HISTORY:
        return (
          <>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.teacher')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.teacher_override')}
              </Typography>
            </TableCell>
          </>
        );

      case ReplacementDisplays.REPLACEMENT_DISPLAY_CONFIRM:
        return (
          <TableCell>
            <Typography align="left" className={classes.weight500}>
              {t('header.action')}
            </Typography>
          </TableCell>
        );

      default:
        return null;
    }
  }, [replacementDisplay, anchorEl, classes, isOpen, t]);

  return (
    <TableHead>
      <TableRow>
        {[
          ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS,
          ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE,
        ].includes(replacementDisplay) ? (
          <TableCell>
            <Typography align="left" className={classes.weight500}>
              {t('header.class')}
            </Typography>
          </TableCell>
        ) : (
          <>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.date')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography align="left" className={classes.weight500}>
                {t('header.name')}
              </Typography>
            </TableCell>
          </>
        )}
        <TableCell>
          <Typography align="left" className={classes.weight500}>
            {t('header.level')}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography align="left" className={classes.weight500}>
            {t('header.location')}
          </Typography>
        </TableCell>
        {enableMultiLocalization && (
          <TableCell>
            <Typography align="left" className={classes.weight500}>
              {t('header.establishment_group')}
            </Typography>
          </TableCell>
        )}

        {headersSpecificToDisplay}
      </TableRow>
    </TableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  iconInfo: {
    color: theme.palette.grey[500],
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  weight500: { fontWeight: 500 },
  statusHeader: { display: 'flex', alignItems: 'center' },
  iconInfoDiv: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default ActivitiesToReplaceTable;
