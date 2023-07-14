import React from 'react';
import { Theme, makeStyles, useTheme } from '@material-ui/core';
import AdjustIcon from '@material-ui/icons/Adjust';
import { SpotType } from '../types';
import {
  PREDEFINED_CUSTOMIZATION,
  PERSONALIZED_CUSTOMIZATION,
} from '../component/SpotCreator/CanvasSpotCreatorForm.component';

type Props = {
  spotType: SpotType;
  size: number;
  taken: boolean;
};

export const CanvasSpotIcon = (props: Props) => {
  const { spotType, size, taken } = props;
  const classes = useStyles();
  const theme = useTheme();

  let fill = spotType.fill_color || 'white';
  let stroke = spotType.stroke_color || 'black';
  if (taken) {
    fill = theme.palette.grey[400];
    stroke = theme.palette.grey[600];
  }

  return (
    <div className={classes.itemContainer}>
      {!spotType ? (
        <svg height={size} width={size}>
          <AdjustIcon width={size / 2} x={size / 4} />
        </svg>
      ) : (
        <svg height={size} width={size}>
          {((spotType.shape === 'circular' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION) ||
            spotType.id === -1) && (
            <circle
              cx={size / 2}
              cy={size / 2}
              fill={fill}
              r={size / 4}
              stroke={stroke}
              strokeWidth="2"
            />
          )}
          {spotType.shape === 'rectangle' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION && (
              <rect
                fill={fill}
                height={size / 2}
                stroke={stroke}
                strokeWidth={2}
                width={(3 * size) / 4}
                x={size / 8}
                y={size / 4}
              />
            )}
          {spotType.shape === 'square' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION && (
              <rect
                fill={fill}
                height={size / 2}
                stroke={stroke}
                strokeWidth={2}
                width={size / 2}
                x={size / 4}
                y={size / 4}
              />
            )}
          {spotType.shape === 'triangle' &&
            spotType.customization === PREDEFINED_CUSTOMIZATION && (
              <polygon
                fill={fill}
                points={`${size / 2},${size / 4} ${size / 4},${
                  (size * 3) / 4
                } ${(size * 3) / 4},${(size * 3) / 4}`}
                stroke={stroke}
              />
            )}
          {spotType.customization === PERSONALIZED_CUSTOMIZATION && (
            <image
              height={size / 2}
              href={taken ? spotType.taken_image : spotType.free_image}
              width={size / 2}
              x={size / 4}
              y={size / 4}
            />
          )}
        </svg>
      )}
    </div>
  );
};

CanvasSpotIcon.defaultProps = { taken: false };

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
