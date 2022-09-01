import React from 'react';
import { ButtonBase, Theme, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import AdjustIcon from '@material-ui/icons/Adjust';
import clx from 'classnames';
import { SpotType } from '../types';
import { CanvasSelectableToolsEnum } from './tools/CanvasStrategy';
import {
  PREDEFINED_CUSTOMIZATION,
  PERSONALIZED_CUSTOMIZATION,
} from '../component/SpotCreator/CanvasSpotCreatorForm.component';

type Props = {
  onSelectTool: (tool: CanvasSelectableToolsEnum, spotId?: number) => void;
  onDeleteSpot: () => void;
  spotType: SpotType;
  openSpotUpdateForm: (spotType: SpotType) => void;
  onDeleteSpotType: (spotType: SpotType) => void;
  classes: any;
  selected: boolean;
};

const TOOL_WIDTH = 71;

export const CanvasSpotToolMenu = (props: Props) => {
  const { t } = useTranslation('spotScheduling');
  const {
    spotType,
    classes,
    openSpotUpdateForm,
    onDeleteSpot,
    selected,
    onSelectTool,
  } = props;

  return (
    <div className={classes.itemContainer}>
      <ButtonBase
        className={clx({
          [classes.spot]: true,
          [classes.itemSelected]: selected,
        })}
        onClick={onSelectTool}
      >
        {!spotType ? (
          <svg width={TOOL_WIDTH} height={TOOL_WIDTH}>
            <AdjustIcon x={TOOL_WIDTH / 4} width={TOOL_WIDTH / 2} />
          </svg>
        ) : (
          <svg width={TOOL_WIDTH} height={TOOL_WIDTH}>
            {spotType?.shape === 'circular' &&
              spotType.customization === PREDEFINED_CUSTOMIZATION && (
                <circle
                  cx={TOOL_WIDTH / 2}
                  cy={TOOL_WIDTH / 2}
                  r={TOOL_WIDTH / 4}
                  fill={spotType?.fill_color || 'white'}
                  stroke={spotType?.stroke_color || 'black'}
                  strokeWidth="2"
                />
              )}
            {spotType?.shape === 'rectangle' &&
              spotType.customization === PREDEFINED_CUSTOMIZATION && (
                <rect
                  x={TOOL_WIDTH / 8}
                  y={TOOL_WIDTH / 4}
                  width={(3 * TOOL_WIDTH) / 4}
                  height={TOOL_WIDTH / 2}
                  stroke={spotType?.stroke_color || 'black'}
                  fill={spotType?.fill_color || 'white'}
                  strokeWidth={2}
                />
              )}
            {spotType?.shape === 'square' &&
              spotType.customization === PREDEFINED_CUSTOMIZATION && (
                <rect
                  x={TOOL_WIDTH / 4}
                  y={TOOL_WIDTH / 4}
                  width={TOOL_WIDTH / 2}
                  height={TOOL_WIDTH / 2}
                  stroke={spotType?.stroke_color || 'black'}
                  fill={spotType?.fill_color || 'white'}
                  strokeWidth={2}
                />
              )}
            {spotType?.shape === 'triangle' &&
              spotType.customization === PREDEFINED_CUSTOMIZATION && (
                <polygon
                  points={`${TOOL_WIDTH / 2},${TOOL_WIDTH / 4} ${
                    TOOL_WIDTH / 4
                  },${(TOOL_WIDTH * 3) / 4} ${(TOOL_WIDTH * 3) / 4},${
                    (TOOL_WIDTH * 3) / 4
                  }`}
                  stroke={spotType?.stroke_color || 'black'}
                  fill={spotType?.fill_color || 'white'}
                />
              )}
            {spotType.customization === PERSONALIZED_CUSTOMIZATION && (
              <image
                x={TOOL_WIDTH / 4}
                y={TOOL_WIDTH / 4}
                href={spotType.free_image}
                width={TOOL_WIDTH / 2}
                height={TOOL_WIDTH / 2}
              />
            )}
          </svg>
        )}
        {openSpotUpdateForm && (
          <div className={classes.createIconContainer}>
            <CreateIcon
              className={classes.createIcon}
              onClick={(ev) => {
                ev.preventDefault();
                openSpotUpdateForm(spotType);
                ev.stopPropagation();
              }}
            />
          </div>
        )}
        {onDeleteSpot && (
          <div className={classes.deleteIconContainer}>
            <DeleteIcon
              className={classes.deleteIcon}
              onClick={(ev) => {
                ev.preventDefault();
                props.onDeleteSpotType(spotType);
                ev.stopPropagation();
              }}
            />
          </div>
        )}
      </ButtonBase>
      <Typography> {spotType?.name || t('toolsMenu.spot')}</Typography>
    </div>
  );
};

const styles = (theme: Theme) => ({
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
});

export default withStyles(styles)(CanvasSpotToolMenu);
