import React from 'react';

import classNames from 'classnames';

import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

import ButtonBase from '@material-ui/core/ButtonBase';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';

import ToolTip from '#components/Tooltip.component';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { TriggerIcon } from '#libs/sequential_marketing/icons/utils';

import type { SmartList } from '#libs/smart-list/types';
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';

export type ConnectedTriggerNodeProps = {
  connectedTrigger: CadenceStep<
    number,
    number,
    StepConnectedTriggerConfig<SmartList>
  >;
  onClick: () => void;
};

export const ConnectedTriggerNodeElement: React.FC<
  ConnectedTriggerNodeProps
> = ({ connectedTrigger, onClick }) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  return (
    <>
      <ToolTip title={t('cadence.triggers.trigger')}>
        <ButtonBase onClick={onClick}>
          <div
            className={classes.card}
            id={`card_element${connectedTrigger?.id}`}
          >
            <div className={classes.flexIconAndText}>
              <div className={classes.losange}>
                <div className={classes.centerAbsolute}>
                  <OfflineBoltIcon
                    className={classNames(
                      classes.blueIcon,
                      classes.customPulse,
                    )}
                  />
                </div>
              </div>
            </div>
            <div className={classes.triggerIcon}>
              <CustomMuiIcon
                MuiIcon={TriggerIcon({
                  connected_trigger_config: connectedTrigger,
                })}
                defaultBackGround
                MuiIconProps={{ color: 'primary', fontSize: 'small' }}
              />
            </div>
          </div>
        </ButtonBase>
      </ToolTip>
    </>
  );
};

export default ConnectedTriggerNodeElement;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    padding: theme.spacing(1),
    position: 'relative',
  },
  customPulse: {
    borderRadius: '50%',
    animationName: `$customPulse`,
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    boxShadow: '0 0 0 0 rgba(18, 22, 107, 1)',
  },
  blueIcon: {
    color: 'rgba(18, 22, 107, 1)',
  },
  losange: {
    backgroundColor: '#12166B1A',
    transform: 'rotate(45deg)',
    height: '40px',
    width: '40px',
    position: 'relative',
    borderRadius: theme.spacing(0.5),
  },
  flexIconAndText: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%) rotate(-45deg)',
  },
  triggerIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%,-50%)',
    '-ms-transform': 'translate(50%,-50%)',
  },
  '@keyframes customPulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: '0 0 0 0 rgba(18, 22, 107, 1)',
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 8px rgba(18, 22, 107, 0)',
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: '0 0 0 0 rgba(18, 22, 107, 0)',
    },
  },
}));
