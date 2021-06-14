import {
  ButtonBase,
  Checkbox,
  FormControlLabel,
  Grid,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import clx from 'classnames';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CreateIcon from '@material-ui/icons/Create';
import AdjustIcon from '@material-ui/icons/Adjust';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import ColorInput from '../../../components/input/ColorInput.component';
import { MaterialStyleType } from '../../../utils/types';
import EraserIcon from './tools/Eraser/Eraser.icon';

import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasSelectableToolsEnum,
} from './tools/CanvasStrategy';
import PointerIcon from './tools/Pointer/Pointer.icon';
import HandIcon from './tools/Hand/Hand.icon';

type OwnProps = {
  selectedTool: CanvasSelectableToolsEnum;
  onSelectTool: (tool: CanvasSelectableToolsEnum) => void;
  onClickUndo: () => void;
  onClickRedo: () => void;
  strokeColor: string;
  fillColor: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onClickUploadImage: () => void;
  showGrid: boolean;
  onChangeGridVisibility: (value: boolean) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class CanvasToolsMenu extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.toolsMenuContainer}>
        <Typography variant="h5">{t('toolsMenu.title')}</Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.edition')}
        </Typography>

        <Grid container spacing={4} className={classes.sectionContainer}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.pointer,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.pointer);
                }}
              >
                <PointerIcon />
              </ButtonBase>
              <Typography> {t('toolsMenu.pointer')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.hand,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.hand);
                }}
              >
                <HandIcon />
              </ButtonBase>
              <Typography> {t('toolsMenu.hand')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool ===
                    CANVAS_SELECTABLE_TOOLS.rotation,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.rotation);
                }}
              >
                <AutorenewIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.rotation')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.eraser,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.eraser);
                }}
              >
                <EraserIcon />
              </ButtonBase>
              <Typography> {t('toolsMenu.eraser')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={classes.item}
                onClick={this.props.onClickUndo}
              >
                <UndoIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.undo')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={classes.item}
                onClick={this.props.onClickRedo}
              >
                <RedoIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.redo')}</Typography>
            </div>
          </Grid>
        </Grid>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.walls')}
        </Typography>
        <Grid container spacing={4} className={classes.sectionContainer}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.line,
                })}
                onClick={() =>
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.line)
                }
              >
                <CreateIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.line')}</Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.rect,
                })}
                onClick={() =>
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.rect)
                }
              >
                <CheckBoxOutlineBlankIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.rect')}</Typography>
            </div>
          </Grid>
        </Grid>

        <div className={classes.otherOptions}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.showGrid}
                onChange={(e) =>
                  this.props.onChangeGridVisibility(e.target.checked)
                }
                color="primary"
              />
            }
            label={t('toolsMenu.showGrid')}
          />
        </div>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.place')}
        </Typography>
        <Grid container spacing={4} className={classes.sectionContainer}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.spot,
                })}
                onClick={() =>
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.spot)
                }
              >
                <AdjustIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.spot')}</Typography>
            </div>
          </Grid>
        </Grid>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.elements')}
        </Typography>
        <Grid container spacing={3} className={classes.sectionContainer}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.teacher,
                })}
                onClick={() =>
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.teacher)
                }
              >
                <AccessibilityIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.teacher')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.screen,
                })}
                onClick={() =>
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.screen)
                }
              >
                <VideoLabelIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.screen')}</Typography>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.door,
                })}
                onClick={() =>
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.door)
                }
              >
                <MeetingRoomIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.door')}</Typography>
            </div>
          </Grid>
        </Grid>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.custom')}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={6}>
            <div className={classes.customItemContainer}>
              <Typography>{t('toolsMenu.customStroke')}</Typography>
              <ColorInput
                color={this.props.strokeColor}
                onChange={this.props.onStrokeColorChange}
                transparentColorAvailable
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className={classes.customItemContainer}>
              <Typography>{t('toolsMenu.customFill')}</Typography>
              <ColorInput
                color={this.props.fillColor}
                onChange={this.props.onFillColorChange}
                transparentColorAvailable
              />
            </div>
          </Grid>
        </Grid>

        <div className={classes.customItemContainer}>
          <Typography>{t('toolsMenu.customIconLabel')}</Typography>
          <ButtonBase
            className={classes.buttonImage}
            onClick={this.props.onClickUploadImage}
          >
            <Typography color="textSecondary">
              {t('toolsMenu.customIconButton')}
            </Typography>
          </ButtonBase>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  toolsMenuContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 320,
    height: '100%',
    borderColor: '#CCC',
    borderStyle: 'solid',
    borderWidth: 0,
    borderLeftWidth: 1,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    backgroundColor: 'white',
    overflowY: 'scroll',
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
  },
  sectionContainer: {
    marginTop: theme.spacing(0),
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    padding: theme.spacing(2),
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 3,
    borderColor: '#AAA',
    color: '#626262',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSelected: {
    backgroundColor: '#EEE',
    borderColor: 'black',
  },
  customItemContainer: {
    marginTop: theme.spacing(2),
  },
  buttonImage: {
    borderRadius: theme.spacing(1),
    border: '1px solid #C1C1C1',
    padding: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    marginTop: theme.spacing(1),
  },
  otherOptions: {
    marginTop: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasToolsMenu);
