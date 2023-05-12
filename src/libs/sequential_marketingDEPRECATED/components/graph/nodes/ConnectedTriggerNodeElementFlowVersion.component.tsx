// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/styles/makeStyles';

import { Handle, Position } from 'react-flow-renderer';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import HiddenHandle from '#libs/sequential_marketingDEPRECATED/components/graph/handles/HiddenHandle.component';
import ToolTip from '#components/Tooltip.component';

import type { SmartList } from '#libs/smart-list/types';
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketingDEPRECATED/types';

import ConnectedTriggerNodeElement from './ConnectedTriggerNodeElement.component';

type FlowVersionProps = {
  data: {
    step: CadenceStep<number, number, StepConnectedTriggerConfig<SmartList>>;
    trigger: StepConnectedTriggerConfig<SmartList>;
    onCardClick: () => void;
    onDelete: () => void;
    faker?: boolean;
    disabled?: boolean;
    resetFaker: () => void;
  };
};

export const ConnectedTriggerNodeElementFlowVersion: React.FC<
  FlowVersionProps
> = ({ data }) => {
  const classes = useFlowStyles();
  const { t } = useTranslation('marketing');

  return (
    <>
      <HiddenHandle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={{ background: '#555' }}
      />
      {(data.faker || data.disabled) && (
        <div className={classes.disabledOverLay} />
      )}

      {data.faker ? (
        <div className={classes.buttonTopRightFaker}>
          <ToolTip title={t('cadence.graph.nodeElement.cancelOnGoingCreation')}>
            <IconButton
              onClick={() => data.resetFaker()}
              classes={{ root: classes.overrideIconButton }}
              size="small"
              color="default"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ToolTip>
        </div>
      ) : (
        <div className={classes.buttonTopRightDelete}>
          <ToolTip title={t('cadence.graph.nodeElement.deleteTrigger')}>
            <IconButton
              onClick={data.onDelete}
              classes={{ root: classes.overrideIconButton }}
              size="small"
              color="default"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ToolTip>
        </div>
      )}
      <ConnectedTriggerNodeElement
        connectedTrigger={data.trigger}
        isFaker={data.faker}
        onClick={data.onCardClick}
      />
      {!data.faker && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#555' }}
          isConnectable={false}
        />
      )}
    </>
  );
};

export default ConnectedTriggerNodeElementFlowVersion;

const useFlowStyles = makeStyles(() => ({
  disabledOverLay: {
    backgroundColor: 'rgba(255, 255, 255, .5)',
    backdropFilter: 'blur(0.5px)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '50%',
    left: '50%',
    zIndex: 1000,
    transform: 'translate(-50%,-50%)',
    '-ms-transform': 'translate(-50%,-50%)',
  },
  buttonTopRightFaker: {
    position: 'absolute',
    zIndex: 2000,
    top: 0,
    right: 0,
    transform: 'translate(50%,-50%)',
    '-ms-transform': 'translate(50%,-50%)',
  },
  buttonTopRightDelete: {
    position: 'absolute',
    zIndex: 2000,
    top: '15%',
    right: '15%',
    transform: 'translate(50%,-50%)',
    '-ms-transform': 'translate(50%,-50%)',
  },
  overrideIconButton: {
    backgroundColor: 'rgba(255, 255, 255, .7)',
    boxShadow: '0px 4px 8px 0px #00000014',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: '4px 16px 32px 4px #00000014',
    },
  },
}));
