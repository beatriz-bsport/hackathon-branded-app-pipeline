import {
  ButtonBase,
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

type OwnProps = {
  selectedTool: CanvasSelectableToolsEnum;
  onSelectTool: (tool: CanvasSelectableToolsEnum) => void;
  onClickUndo: () => void;
  onClickRedo: () => void;
  strokeColor: string;
  fillColor: string;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
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
          <Grid item xs={3}>
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

          <Grid item xs={3}>
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

          <Grid item xs={3}>
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

          <Grid item xs={3}>
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
        </Grid>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.walls')}
        </Typography>
        <Grid container spacing={4} className={classes.sectionContainer}>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
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

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.sections.place')}
        </Typography>
        <Grid container spacing={4} className={classes.sectionContainer}>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
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

          <Grid item xs={3}>
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

          <Grid item xs={3}>
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

        <div className={classes.colorItemContainer}>
          <Typography>{t('toolsMenu.customStroke')}</Typography>
          <ColorInput
            color={this.props.strokeColor}
            onChange={this.props.onStrokeColorChange}
            transparentColorAvailable={true}
          />
        </div>

        <div className={classes.colorItemContainer}>
          <Typography>{t('toolsMenu.customFill')}</Typography>
          <ColorInput
            color={this.props.fillColor}
            onChange={this.props.onFillColorChange}
            transparentColorAvailable={true}
          />
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  toolsMenuContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    maxHeight: '100%',
    boxShadow: '-5px 0 5px -2px #888',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    backgroundColor: 'white',
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
  colorItemContainer: {
    marginTop: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasToolsMenu);
