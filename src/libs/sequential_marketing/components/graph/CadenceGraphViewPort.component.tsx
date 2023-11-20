import React from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';
import classNames from 'classnames';
import {
  useViewport,
  MiniMap,
  Controls,
  ControlButton,
} from 'react-flow-renderer';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import MapIcon from '@material-ui/icons/Map';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';

import Config from '../../../../config';

import './styles.css';

import CadenceOutputCollapse from '#libs/sequential_marketing/components/graph/nodes/outputs/CadenceOutputCollapse.component';
import CadenceOutput from '#libs/sequential_marketing/components/graph/nodes/outputs/CadenceOutput.component';
import OutputWonTriggerBubble from '#libs/sequential_marketing/components/graph/bubbles/OutputWonTriggerBubble.component';
import OutputLostTriggerBubble from '#libs/sequential_marketing/components/graph/bubbles/OutputLostTriggerBubble.component';
import {
  DestinationStatus,
  InitialConfigurationStep,
} from '#libs/sequential_marketing/constants';

import type {
  ConnectedTrigger,
  CadenceInitialConfiguration,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

const nbsp = `\u00A0`;
type Props = {
  active: boolean;
  creationMode: boolean;
  displayDisabledTriggers: boolean;
  editMode: boolean;
  isFirstOutputConfiguration: boolean;
  loseTriggers: ConnectedTrigger[];
  winTriggers: ConnectedTrigger[];
  smartlists: Immutable.ImmutableArray<SmartList>;
  initialConfiguration: CadenceInitialConfiguration;
  getSmartlist: (id: number) => SmartList;
  closeEntryActionBubble: () => void;
  openEntryActionBubble: () => void;
  setCurrentStepConfiguration: (
    currentStepConfiguration: InitialConfigurationStep,
  ) => void;
  setInitialConfig: (data: CadenceInitialConfiguration, save?: boolean) => void;
  switchDisplayDisabledNodes: () => void;
};

const anchorOrigin: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const transformOrigin: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const popoverStyle = {
  style: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: '5px 30px 30px 30px',
    overflow: 'visible',
  },
};

export const CadenceGraphViewPort: React.FC<Props> = ({
  active,
  creationMode,
  displayDisabledTriggers,
  editMode,
  isFirstOutputConfiguration,
  loseTriggers,
  winTriggers,
  smartlists,
  initialConfiguration,
  getSmartlist,
  closeEntryActionBubble,
  openEntryActionBubble,
  setCurrentStepConfiguration,
  setInitialConfig,
  switchDisplayDisabledNodes,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles({ isFirstOutputConfiguration, creationMode });

  const [showMap, setShowMap] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);

  const [anchorWonTriggerBubble, setAnchorWonTriggerBubble] =
    React.useState<HTMLElement | null>(null);
  const [anchorLostTriggerBubble, setAnchorLostTriggerBubble] =
    React.useState<HTMLElement | null>(null);

  const openWonCriteriaBubble = React.useCallback((timeout?: number) => {
    const outputWon = document.getElementById('output_won');
    if (timeout) {
      setTimeout(() => {
        setAnchorWonTriggerBubble(outputWon);
      }, timeout);
    } else {
      setAnchorWonTriggerBubble(outputWon);
    }
  }, []);

  const openLostCriteriaBubble = React.useCallback((timeout?: number) => {
    const outputLost = document.getElementById('output_lost');
    if (timeout) {
      setTimeout(() => {
        setAnchorLostTriggerBubble(outputLost);
      }, timeout);
    } else {
      setAnchorWonTriggerBubble(outputLost);
    }
  }, []);

  const wonConnectedTriggers = React.useMemo(
    () =>
      creationMode
        ? initialConfiguration[InitialConfigurationStep.CADENCE_WIN_STEP]
            .connectedTriggers
        : winTriggers,
    [initialConfiguration, creationMode, winTriggers],
  );

  const lostConnectedTriggers = React.useMemo(
    () =>
      creationMode
        ? initialConfiguration[InitialConfigurationStep.CADENCE_LOSE_STEP]
            .connectedTriggers
        : loseTriggers,
    [initialConfiguration, creationMode, loseTriggers],
  );

  const { x, y, zoom } = useViewport();

  const isDebuggerMode = React.useMemo(
    () => !!Config?.REACT_APP_DEBUGGER_MODE,
    [],
  );

  const switchShowMap = React.useCallback(
    () => setShowMap(!showMap),
    [showMap],
  );

  const submitWonCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      const configuration = !creationMode
        ? {
            [InitialConfigurationStep.CADENCE_WIN_STEP]: {
              connectedTriggers: value,
            },
          }
        : {
            ...initialConfiguration,
            [InitialConfigurationStep.CADENCE_WIN_STEP]: {
              ...initialConfiguration[
                InitialConfigurationStep.CADENCE_WIN_STEP
              ],
              connectedTriggers: value,
            },
          };
      setInitialConfig(configuration);
    },
    [creationMode, initialConfiguration, setInitialConfig],
  );

  const submitLostCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[], save?: boolean) => {
      const configuration = !creationMode
        ? {
            [InitialConfigurationStep.CADENCE_LOSE_STEP]: {
              connectedTriggers: value,
            },
          }
        : {
            ...initialConfiguration,
            [InitialConfigurationStep.CADENCE_LOSE_STEP]: {
              ...initialConfiguration[
                InitialConfigurationStep.CADENCE_LOSE_STEP
              ],
              connectedTriggers: value,
            },
          };
      setInitialConfig(configuration, save);
    },
    [creationMode, initialConfiguration, setInitialConfig],
  );

  // ================= WON CRITERIA BUBBLE ==================
  const handleCloseWonCriteriaBubble = React.useCallback(() => {
    !isFirstOutputConfiguration && setAnchorWonTriggerBubble(null);
  }, [isFirstOutputConfiguration, setAnchorWonTriggerBubble]);

  const handleCancelWonCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      setAnchorWonTriggerBubble(null);
      if (isFirstOutputConfiguration) {
        submitWonCriteriaBubble(value);
        setCurrentStepConfiguration(
          InitialConfigurationStep.CADENCE_ENTRY_STEP,
        );
        openEntryActionBubble();
      }
    },
    [
      isFirstOutputConfiguration,
      openEntryActionBubble,
      setCurrentStepConfiguration,
      submitWonCriteriaBubble,
    ],
  );

  const handleConfirmWonCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      submitWonCriteriaBubble(value);
      setAnchorWonTriggerBubble(null);
      if (isFirstOutputConfiguration) {
        openLostCriteriaBubble(200);
        setCurrentStepConfiguration(InitialConfigurationStep.CADENCE_LOSE_STEP);
      }
    },
    [
      isFirstOutputConfiguration,
      openLostCriteriaBubble,
      setCurrentStepConfiguration,
      submitWonCriteriaBubble,
    ],
  );

  React.useEffect(() => {
    closeEntryActionBubble();
    isFirstOutputConfiguration && openWonCriteriaBubble(200);
  }, [
    isFirstOutputConfiguration,
    closeEntryActionBubble,
    openWonCriteriaBubble,
  ]);
  // ========================================================

  // ================= LOST CRITERIA BUBBLE =================
  const handleCloseLostCriteriaBubble = React.useCallback(() => {
    !isFirstOutputConfiguration && setAnchorLostTriggerBubble(null);
  }, [isFirstOutputConfiguration]);

  const handleCancelLostCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      setAnchorLostTriggerBubble(null);
      if (isFirstOutputConfiguration) {
        openWonCriteriaBubble(200);
        submitLostCriteriaBubble(value);
        setCurrentStepConfiguration(InitialConfigurationStep.CADENCE_WIN_STEP);
      }
    },
    [
      isFirstOutputConfiguration,
      openWonCriteriaBubble,
      setCurrentStepConfiguration,
      submitLostCriteriaBubble,
    ],
  );

  const handleConfirmLostCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      submitLostCriteriaBubble(value, true);
      setAnchorLostTriggerBubble(null);
      isFirstOutputConfiguration && setCurrentStepConfiguration(null);
    },
    [
      isFirstOutputConfiguration,
      setCurrentStepConfiguration,
      submitLostCriteriaBubble,
    ],
  );
  // ========================================================

  return (
    <>
      <div className={classes.container}>
        <div className={classes.viewportInfo}>
          <Typography variant="caption">
            {`x${nbsp}:${nbsp}${x.toFixed(2)}`}
          </Typography>
          <Typography variant="caption">
            {`y${nbsp}:${nbsp}${y.toFixed(2)}`}
          </Typography>
          <Typography variant="caption">
            {`zoom${nbsp}:${nbsp}${(parseFloat(zoom.toFixed(2)) * 100).toFixed(
              0,
            )}${nbsp}%`}
          </Typography>
        </div>
        {active && (
          <div className={classes.topAlert}>
            <Alert className={classes.alert} severity="info">
              {t('audience.graph.alert.audienceIsActive')}
            </Alert>
          </div>
        )}
        {!creationMode && !editMode && !active && (
          <div className={classes.topAlert}>
            <Alert className={classes.alert} severity="info">
              {t('audience.graph.alert.switchToEditMode')}
            </Alert>
          </div>
        )}

        <div className={classes.outputSection}>
          <CadenceOutputCollapse isOpen={creationMode}>
            <div id="output_won">
              <CadenceOutput
                disabled={creationMode && !anchorWonTriggerBubble}
                forceSelection={!!anchorWonTriggerBubble}
                getSmartlist={getSmartlist}
                onCardClick={openWonCriteriaBubble}
                status={DestinationStatus.WIN}
                triggerList={wonConnectedTriggers}
              />
            </div>
            <div id="output_lost">
              <CadenceOutput
                disabled={creationMode && !anchorLostTriggerBubble}
                forceSelection={!!anchorLostTriggerBubble}
                getSmartlist={getSmartlist}
                onCardClick={openLostCriteriaBubble}
                status={DestinationStatus.FAIL}
                triggerList={lostConnectedTriggers}
              />
            </div>
          </CadenceOutputCollapse>
        </div>
      </div>

      {showMap && <MiniMap />}

      <Controls
        className={classNames('collapsable', 'react-flow__controls', {
          collapsed,
          'react-flow__controls__forward': !creationMode,
        })}
      >
        <ControlButton
          onClick={switchShowMap}
          title={
            showMap
              ? t('cadence.graph.tools.hideMap')
              : t('cadence.graph.tools.showMap')
          }
        >
          <MapIcon fontSize="small" />
        </ControlButton>

        {isDebuggerMode && (
          <ControlButton
            onClick={switchDisplayDisabledNodes}
            title={
              displayDisabledTriggers
                ? t('cadence.graph.tools.hideDisabledTriggers')
                : t('cadence.graph.tools.showDisabledTriggers')
            }
          >
            {displayDisabledTriggers ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </ControlButton>
        )}
      </Controls>
      <div
        className={classNames('react-flow__controls_bottom_fab', {
          'react-flow__controls__forward': !creationMode,
        })}
      >
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ExpandLessIcon fontSize="small" />
          )}
        </IconButton>
      </div>

      <Popover
        anchorEl={anchorWonTriggerBubble}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseWonCriteriaBubble}
        open={!!anchorWonTriggerBubble}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <OutputWonTriggerBubble
          connectedTriggers={wonConnectedTriggers}
          isInitial={isFirstOutputConfiguration}
          onCancel={handleCancelWonCriteriaBubble}
          onConfirm={handleConfirmWonCriteriaBubble}
          smartlists={smartlists}
        />
      </Popover>

      <Popover
        anchorEl={anchorLostTriggerBubble}
        anchorOrigin={anchorOrigin}
        onClose={handleCloseLostCriteriaBubble}
        open={!!anchorLostTriggerBubble}
        PaperProps={popoverStyle}
        transformOrigin={transformOrigin}
      >
        <OutputLostTriggerBubble
          connectedTriggers={lostConnectedTriggers}
          isInitial={isFirstOutputConfiguration}
          onCancel={handleCancelLostCriteriaBubble}
          onConfirm={handleConfirmLostCriteriaBubble}
          smartlists={smartlists}
        />
      </Popover>
    </>
  );
};

type StylesProps = Pick<Props, 'isFirstOutputConfiguration' | 'creationMode'>;

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  container: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    zIndex: ({ isFirstOutputConfiguration, creationMode }) => {
      if (isFirstOutputConfiguration) return 900;
      if (creationMode) return 500;
      return 800;
    },
    position: 'absolute',
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  viewportInfo: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.secondary,
    width: 'auto',
  },
  outputSection: {
    display: 'flex',
    padding: theme.spacing(2),
  },
  topAlert: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  noHover: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconNos: {
    color: 'rgba(0, 0, 0, 0.3)',
  },
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(CadenceGraphViewPort);
