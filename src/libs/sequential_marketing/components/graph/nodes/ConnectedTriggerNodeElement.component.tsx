import React from 'react';
import chroma from 'chroma-js';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

import ButtonBase from '@material-ui/core/ButtonBase';
import GroupIcon from '@material-ui/icons/Group';

import ToolTip from '#components/Tooltip.component';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { TriggerIcon } from '#libs/sequential_marketing/components/helpers/utils';

import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

export type ConnectedTriggerNodeProps = {
  connectedTrigger: ConnectedTrigger;
  onClick: () => void;
};

export const ConnectedTriggerNodeElement: React.FC<
  ConnectedTriggerNodeProps
> = ({ connectedTrigger, onClick }) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const hasFilterSmartList = !!connectedTrigger?.filtering_config?.smartlist_pk;
  return (
    <>
      <ToolTip title={t('cadence.triggers.trigger')}>
        <ButtonBase onClick={onClick}>
          <div
            className={classes.card}
            id={`card_element${connectedTrigger?.trigger_config?.uuid}`}
          >
            <div className={classes.losange}>
              <div className={classes.centerAbsolute}>
                <div className={classNames(classes.customPulse)}>
                  <div className={classes.icon}>
                    <CustomMuiIcon
                      MuiIcon={TriggerIcon({
                        connected_trigger_config: connectedTrigger,
                      })}
                      defaultBackGround
                      MuiIconProps={{ color: 'primary', fontSize: 'small' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {hasFilterSmartList && (
              <div className={classes.groupIconContainer}>
                <GroupIcon fontSize="small" className={classes.groupIcon} />
              </div>
            )}
          </div>
        </ButtonBase>
      </ToolTip>
    </>
  );
};

export default React.memo(ConnectedTriggerNodeElement);

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    padding: theme.spacing(1),
    position: 'relative',
  },
  customPulse: {
    borderRadius: '100%',
    animationName: `$customPulse`,
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    boxShadow: `0 0 0 0 ${theme.palette.primary.main}`,
  },
  icon: {
    display: 'flex',
    justyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  losange: {
    backgroundColor: '#12166B1A',
    transform: 'rotate(45deg)',
    height: '40px',
    width: '40px',
    position: 'relative',
    borderRadius: theme.spacing(0.5),
    border: `solid ${theme.palette.primary.main}`,
    borderWidth: '2px',
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%) rotate(-45deg)',
  },
  groupIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, 100%)',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    height: '20px',
    width: '20px',
    borderRadius: '100%',
    zIndex: 100,
  },
  groupIcon: {
    padding: theme.spacing(0.5),
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
      boxShadow: `0 0 0 0 ${theme.palette.primary.main}`,
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 8px ${chroma(theme.palette.primary.main).alpha(0)}`,
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${chroma(theme.palette.primary.main).alpha(0)}`,
    },
  },
}));
