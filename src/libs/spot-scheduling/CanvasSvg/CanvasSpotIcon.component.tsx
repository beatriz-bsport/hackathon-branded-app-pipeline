import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import AdjustIcon from '@material-ui/icons/Adjust';
import { SpotType } from '../types';
import {
  PREDEFINED_CUSTOMIZATION,
  PERSONALIZED_CUSTOMIZATION,
} from '../component/SpotCreator/CanvasSpotCreatorForm.component';

type Props = {
  spotType: SpotType;
};

const TOOL_WIDTH = 71;

export const CanvasSpotIcon = (props: Props) => {
  const { spotType } = props;
  const classes = useStyles();

  return (
    <div className={classes.itemContainer}>
      {!spotType ? (
        <svg height={TOOL_WIDTH} width={TOOL_WIDTH}>
          <AdjustIcon width={TOOL_WIDTH / 2} x={TOOL_WIDTH / 4} />
        </svg>
      ) : (
        <svg height={TOOL_WIDTH} width={TOOL_WIDTH}>
          {((spotType.shape === 'circular' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION) ||
            spotType.id === -1) && (
            <circle
              cx={TOOL_WIDTH / 2}
              cy={TOOL_WIDTH / 2}
              fill={spotType.fill_color || 'white'}
              r={TOOL_WIDTH / 4}
              stroke={spotType.stroke_color || 'black'}
              strokeWidth="2"
            />
          )}
          {spotType.shape === 'rectangle' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION && (
              <rect
                fill={spotType.fill_color || 'white'}
                height={TOOL_WIDTH / 2}
                stroke={spotType.stroke_color || 'black'}
                strokeWidth={2}
                width={(3 * TOOL_WIDTH) / 4}
                x={TOOL_WIDTH / 8}
                y={TOOL_WIDTH / 4}
              />
            )}
          {spotType.shape === 'square' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION && (
              <rect
                fill={spotType.fill_color || 'white'}
                height={TOOL_WIDTH / 2}
                stroke={spotType.stroke_color || 'black'}
                strokeWidth={2}
                width={TOOL_WIDTH / 2}
                x={TOOL_WIDTH / 4}
                y={TOOL_WIDTH / 4}
              />
            )}
          {spotType.shape === 'triangle' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION && (
              <polygon
                fill={spotType.fill_color || 'white'}
                points={`${TOOL_WIDTH / 2},${TOOL_WIDTH / 4} ${
                  TOOL_WIDTH / 4
                },${(TOOL_WIDTH * 3) / 4} ${(TOOL_WIDTH * 3) / 4},${
                  (TOOL_WIDTH * 3) / 4
                }`}
                stroke={spotType.stroke_color || 'black'}
              />
            )}
          {spotType.customization === PERSONALIZED_CUSTOMIZATION && (
            <image
              height={TOOL_WIDTH / 2}
              href={spotType.free_image}
              width={TOOL_WIDTH / 2}
              x={TOOL_WIDTH / 4}
              y={TOOL_WIDTH / 4}
            />
          )}
        </svg>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#EEE',
    borderColor: 'black',
  },
  spot: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 3,
    borderColor: '#AAA',
    color: '#626262',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIconContainer: {
    display: 'flex',
    width: '28px',
    height: '28px',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    borderRadius: '50%',
    right: -10,
    top: -14,
  },
  createIcon: {
    width: 22,
    height: 22,
    color: 'white',
  },
  deleteIcon: {
    width: 22,
    height: 22,
    color: 'white',
  },
  deleteIconContainer: {
    display: 'flex',
    width: '28px',
    height: '28px',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    position: 'absolute',
    borderRadius: '50%',
    left: -10,
    top: -14,
  },
}));

export default CanvasSpotIcon;
