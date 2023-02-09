import React from 'react';
import { useTranslation } from 'react-i18next';

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
import type { Theme } from '@material-ui/core/styles';

import Config from '../../../../config';

type Props = {
  displayDisabledTriggers: boolean;
  switchDisplayDisabledNodes: () => void;
};

export const CadenceGraphViewPort: React.FC<Props> = ({
  displayDisabledTriggers,
  switchDisplayDisabledNodes,
}) => {
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
          <Typography variant="caption">{`x : ${x.toFixed(2)}`}</Typography>
          <Typography variant="caption">{`y : ${y.toFixed(2)}`}</Typography>
          <Typography variant="caption">
            {`zoom : ${(zoom.toFixed(2) * 100).toFixed(0)} %`}
          </Typography>
        </div>
      </div>

      {showMap && <MiniMap />}
      <Controls>
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
  },
  viewportInfo: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.secondary,
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
}));

export default CadenceGraphViewPort;
