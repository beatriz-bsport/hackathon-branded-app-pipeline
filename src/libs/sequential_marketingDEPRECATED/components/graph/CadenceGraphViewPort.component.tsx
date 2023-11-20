// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  useViewport,
  MiniMap,
  Controls,
  ControlButton,
} from 'react-flow-renderer';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';
import MapIcon from '@material-ui/icons/Map';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import type { Theme } from '@material-ui/core/styles';

import Config from '../../../../config';

import './styles.css';

const nbsp = `\u00A0`;
type Props = {
  displayDisabledTriggers: boolean;
  switchDisplayDisabledNodes: () => void;
  active: boolean;
  editMode: boolean;
};

export const CadenceGraphViewPort: React.FC<Props> = ({
  displayDisabledTriggers,
  switchDisplayDisabledNodes,
  active,
  editMode,
}) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const [showMap, setShowMap] = React.useState(false);

  const { x, y, zoom } = useViewport();

  const switchShowMap = () => setShowMap(!showMap);

  const isDebuggerMode = React.useMemo(() => {
    if (Config?.REACT_APP_DEBUGGER_MODE) {
      return true;
    }
    return false;
  }, []);

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
            {`zoom${nbsp}:${nbsp}${(zoom.toFixed(2) * 100).toFixed(0)}${nbsp}%`}
          </Typography>
        </div>
        {active && (
          <div className={classes.topAlert}>
            <Alert className={classes.alert} severity="info">
              {t('audience.graph.alert.audienceIsActive')}
            </Alert>
          </div>
        )}
        {!editMode && !active && (
          <div className={classes.topAlert}>
            <Alert className={classes.alert} severity="info">
              {t('audience.graph.alert.switchToEditMode')}
            </Alert>
          </div>
        )}
      </div>

      {showMap && <MiniMap />}

      <Controls
        className={classNames('collapsable', 'react-flow__controls', {
          collapsed,
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
      <div className="react-flow__controls_bottom_fab">
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ExpandLessIcon fontSize="small" />
          )}
        </IconButton>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    zIndex: 500,
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

export default CadenceGraphViewPort;
