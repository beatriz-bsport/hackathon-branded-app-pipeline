import React from 'react';
import classNames from 'classnames';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';

import ToolTip from '#components/Tooltip.component';

import type { SmartList } from '#libs/smart-list/types';
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';

import { ELEMENT_WIDTH } from '../hooks/utils';

export type StepNodeElementProps = {
  step: CadenceStep<number, number, StepConnectedTriggerConfig<SmartList>>;
  onCardClick: () => void;
  handleSelectStepForSubscription: () => void;
  onDelete: () => void;
};

export const StepNodeElement: React.FC<StepNodeElementProps> = ({
  step,
  handleSelectStepForSubscription,
  onCardClick,
  onDelete,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <>
      <div className={classes.buttonTopRight}>
        <ToolTip title={t('cadence.graph.nodeElement.deleteStep')}>
          <IconButton
            onClick={onDelete}
            classes={{ root: classes.overrideIconButton }}
            size="small"
            color="default"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ToolTip>
      </div>
      <ButtonBase onClick={onCardClick}>
        <div className={classes.card} id={`card_element${step?.id}`}>
          <div className={classes.cardHeader}>
            <div className={classes.flexIconAndText}>
              <CallSplitIcon className={classNames(classes.stepIcon)} />
              <div>
                <Typography variant="subtitle2">{step?.name}</Typography>
              </div>
            </div>
          </div>
        </div>
      </ButtonBase>

      <ToolTip title={t('cadence.graph.nodeElement.addElement')}>
        <div className={classes.bottomActions}>
          <IconButton onClick={handleSelectStepForSubscription} size="small">
            <AddCircleIcon fontSize="small" />
          </IconButton>
        </div>
      </ToolTip>
    </>
  );
};

export default StepNodeElement;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: 'relative',
    width: `${ELEMENT_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    boxShadow: '0px 4px 8px 0px #00000014',
    '&:hover': {
      overflow: 'visible',
      boxShadow: '4px 16px 32px 4px #00000014',
    },
  },
  cardHeader: {
    display: 'flex',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  stepIcon: {
    transform: 'rotate(180deg)',
  },
  flexIconAndText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottomActions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTopRight: {
    position: 'absolute',
    zIndex: 2000,
    top: 0,
    right: 0,
    transform: 'translate(50%,-50%)',
    '-ms-transform': 'translate(50%,-50%)',
  },
  overrideIconButton: {
    boxShadow: '0px 4px 8px 0px #00000014',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: '4px 16px 32px 4px #00000014',
    },
  },
}));
