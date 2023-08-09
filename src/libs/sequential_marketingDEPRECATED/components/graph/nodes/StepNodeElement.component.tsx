import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';

import ToolTip from '#components/Tooltip.component';
import DottedCallSplitIcon from '#components/icons/DottedCallSplitIcon.component';
import type { SmartList } from '#libs/smart-list/types';
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketingDEPRECATED/types';

import { ELEMENT_WIDTH, ELEMENT_MAX_WIDTH } from '../hooks/utils';

export type StepNodeElementProps = {
  step: CadenceStep<number, number, StepConnectedTriggerConfig<SmartList>>;
  cadenceEditMode: boolean;
  onCardClick: () => void;
  handleSelectStepForSubscription: () => void;
  onDelete: () => void;
};

export const StepNodeElement: React.FC<StepNodeElementProps> = ({
  step,
  cadenceEditMode,
  handleSelectStepForSubscription,
  onCardClick,
  onDelete,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <div className={classes.element}>
      {cadenceEditMode && (
        <div className={classes.buttonTopRight}>
          <ToolTip title={t('cadence.graph.nodeElement.deleteStep')}>
            <IconButton
              classes={{ root: classes.overrideIconButton }}
              color="default"
              onClick={onDelete}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ToolTip>
        </div>
      )}
      <ButtonBase onClick={onCardClick}>
        <div className={classes.card} id={`card_element${step?.id}`}>
          <div className={classes.flexIconAndText}>
            <DottedCallSplitIcon fontSize="small" />
            <div className={classes.text}>
              <Typography variant="subtitle2">{step?.name}</Typography>
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
    </div>
  );
};

export default StepNodeElement;

const useStyles = makeStyles((theme: Theme) => ({
  element: {
    marginTop: 13,
  },
  card: {
    position: 'relative',
    minWidth: `${ELEMENT_WIDTH}px`,
    maxWidth: `${ELEMENT_MAX_WIDTH}px`,
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
    padding: theme.spacing(1),
  },
  flexIconAndText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    gap: theme.spacing(1),
  },
  text: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'left',
  },
  bottomActions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
  buttonTopRight: {
    position: 'absolute',
    zIndex: 2000,
    top: 13,
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
