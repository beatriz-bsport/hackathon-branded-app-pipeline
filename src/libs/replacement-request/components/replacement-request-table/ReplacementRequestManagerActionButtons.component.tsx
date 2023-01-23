import React, { useCallback } from 'react';
import classnames from 'classnames';

import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import ArrowForward from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { alpha } from '@material-ui/core';

import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import Tooltip from '#components/Tooltip.component';

type Props = {
  replacementRequest: ReplacementRequest<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    number,
    Level
  >;
  handleRefuseAction: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  handleReplaceButton: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  isMobile?: boolean;
};

export const ReplacementRequestManagerActionButtons: React.FC<Props> = ({
  replacementRequest,
  handleRefuseAction,
  handleReplaceButton,
  isMobile,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('replacement');

  const refuseButton = useCallback(
    () => handleRefuseAction(replacementRequest),
    [handleRefuseAction, replacementRequest],
  );
  const replaceButton = useCallback(
    () => handleReplaceButton(replacementRequest),
    [handleReplaceButton, replacementRequest],
  );

  return (
    <div className={classes.buttonAlign}>
      {!replacementRequest?.offer?.available && (
        <Tooltip title={t('tooltip.offerCancelled')}>
          <div
            className={classnames(
              classes.warningIcon,
              classes.managerActionButton,
              classes.paddings,
            )}
          >
            <ReportProblemOutlinedIcon
              fontSize={isMobile ? 'small' : 'medium'}
            />
          </div>
        </Tooltip>
      )}
      <Tooltip title={t('tooltip.seeAnswers')}>
        <IconButton
          size="small"
          classes={{
            root: classnames(
              classes.warningButton,
              classes.managerActionButton,
            ),
          }}
          onClick={replaceButton}
        >
          <ArrowForward fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </Tooltip>
      <IconButton
        size="small"
        classes={{
          root: classnames(classes.errorButton, classes.managerActionButton),
        }}
        onClick={refuseButton}
      >
        <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  managerActionButton: {
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
    border: '1px solid',
    borderRadius: theme.spacing(0.5),
    '&:last-child': {
      marginRight: 0,
    },
  },
  warningButton: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
    },
  },
  paddings: {
    padding: theme.spacing(0.5),
  },
  warningIcon: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
  },
  errorButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
  },
  buttonAlign: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

export default ReplacementRequestManagerActionButtons;
