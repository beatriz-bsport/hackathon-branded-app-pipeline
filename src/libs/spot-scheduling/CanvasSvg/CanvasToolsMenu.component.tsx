import {
  ButtonBase,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import clx from 'classnames';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CreateIcon from '@material-ui/icons/Create';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import AddIcon from '@material-ui/icons/Add';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import UndoIcon from '@material-ui/icons/Undo';
import InputAdornment from '@material-ui/core/InputAdornment';

import HeightIcon from '@material-ui/icons/Height';
import RedoIcon from '@material-ui/icons/Redo';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import ColorInput from '../../../components/input/ColorInput.component';
import { MaterialStyleType } from '../../../utils/types';
import { DEFAULT_SPOT_TYPE_ID } from '../utils';
import EraserIcon from './tools/Eraser/Eraser.icon';
import CanvasSpotToolMenu from './CanvasSpotToolMenu.component';

import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasSelectableToolsEnum,
} from './tools/CanvasStrategy';
import PointerIcon from './tools/Pointer/Pointer.icon';
import HandIcon from './tools/Hand/Hand.icon';
import { SpotType } from '../types';

type OwnProps = {
  selectedTool: CanvasSelectableToolsEnum;
  onSelectTool: (tool: CanvasSelectableToolsEnum, spotId?: number) => void;
  onClickUndo: () => void;
  onClickRedo: () => void;
  strokeColor: string;
  fillColor: string;
  wallStrokeColor: string;
  wallFillColor: string;
  onStrokeColorChange: (color: string) => void;
  onwallStrokeColorChange: (color: string) => void;
  onwallFillColorChange: (color: string) => void;
  onClickUploadImage: () => void;
  showGrid: boolean;
  onChangeGridVisibility: (value: boolean) => void;
  onHeightCoachChange: (coefficient: string) => void;
  coachHeight: number;
  openSpotCreationForm: () => void;
  onDeleteSpot: () => void;
  spotTypes: SpotType[];
  openDeleteModal: () => void;
  openSpotUpdateForm: (spotType: SpotType) => void;
  onDeleteSpotType: (spotType: SpotType) => void;
  spotTypeIdSelected?: number;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class CanvasToolsMenu extends React.PureComponent<Props> {
  render() {
    const sortSpots = (a, b) => b.id - a.id;
    const { classes, t } = this.props;
    const copySpotTypes = [...(this.props.spotTypes || [])];

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

        <Grid spacing={4}>
          <Grid item xs={9}>
            <Typography className={classes.customItemContainer}>
              {t('toolsMenu.customStroke')}
            </Typography>
            <ColorInput
              color={this.props.wallStrokeColor}
              onChange={this.props.onwallStrokeColorChange}
              transparentColorAvailable
            />
          </Grid>

          <Grid item xs={9}>
            <Typography className={classes.customItemContainer}>
              {t('toolsMenu.customFill')}
            </Typography>
            <ColorInput
              color={this.props.wallFillColor}
              onChange={this.props.onwallFillColorChange}
              transparentColorAvailable
            />
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
          {copySpotTypes.sort(sortSpots).map((spotType) => {
            if (spotType.id === DEFAULT_SPOT_TYPE_ID)
              return (
                <Grid item xs={4}>
                  <CanvasSpotToolMenu
                    openSpotUpdateForm={() => {
                      this.props.openSpotCreationForm(true);
                    }}
                    selected={
                      this.props.selectedTool ===
                        CANVAS_SELECTABLE_TOOLS.spot &&
                      this.props.spotTypeIdSelected === DEFAULT_SPOT_TYPE_ID
                    }
                    onSelectTool={() =>
                      this.props.onSelectTool(
                        CANVAS_SELECTABLE_TOOLS.spot,
                        DEFAULT_SPOT_TYPE_ID,
                      )
                    }
                    default
                  />
                </Grid>
              );
            return (
              <Grid item xs={4}>
                <CanvasSpotToolMenu
                  spotType={spotType}
                  onDeleteSpot={this.props.openDeleteModal}
                  openSpotUpdateForm={this.props.openSpotUpdateForm}
                  selected={
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.spot &&
                    this.props.spotTypeIdSelected === spotType.id
                  }
                  onSelectTool={() => {
                    this.props.onSelectTool(
                      CANVAS_SELECTABLE_TOOLS.spot,
                      spotType.id,
                    );
                  }}
                  onDeleteSpotType={this.props.onDeleteSpotType}
                />
              </Grid>
            );
          })}
          <Grid item xs={4} className={classes.addSpotContainer}>
            <Tooltip title={t('toolsMenu.addSpotType')}>
              <ButtonBase
                onClick={() => {
                  this.props.openSpotCreationForm(false);
                }}
                className={classes.addSpotButton}
              >
                <AddIcon />
              </ButtonBase>
            </Tooltip>
          </Grid>
        </Grid>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('toolsMenu.teacher')}
        </Typography>
        <Grid container spacing={4} className={classes.sectionContainer}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.teacher,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.teacher);
                }}
              >
                <AccessibilityIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.teacher')}</Typography>
            </div>
          </Grid>
          <Grid item xs={5}>
            <div>
              <Typography variant="body2" className={classes.teacherHeight}>
                Taille
              </Typography>
              <TextField
                defaultValue={1}
                value={this.props.coachHeight}
                error={this.props.coachHeight <= 0}
                helperText={
                  this.props.coachHeight <= 0 && t('toolsMenu.helperText')
                }
                type="number"
                onChange={(ev) =>
                  this.props.onHeightCoachChange(ev.target.value)
                }
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <HeightIcon />
                    </InputAdornment>
                  ),
                }}
              />
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
        <Grid item xs={9}>
          <Typography className={classes.customItemContainer}>
            {t('toolsMenu.customFill')}
          </Typography>
          <ColorInput
            color={this.props.strokeColor}
            onChange={this.props.onStrokeColorChange}
            transparentColorAvailable
          />
        </Grid>
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
  spot: {
    padding: theme.spacing(2),
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
  createIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: theme.palette.primary.main,
    color: 'white',
    right: -15,
    top: -15,
  },
  deleteIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'red',
    color: 'white',
    right: 50,
    top: -15,
  },
  itemSelected: {
    backgroundColor: '#EEE',
    borderColor: 'black',
  },
  customItemContainer: {
    marginTop: theme.spacing(2),
    opacity: '35%',
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
  teacherHeight: {
    color: '#626262',
    opacity: '35%',
  },
  addSpotContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  addSpotButton: {
    width: 45,
    height: 45,
    '&:hover': {
      backgroundColor: '#E8E8E8',
      borderRadius: theme.spacing(3),
    },
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasToolsMenu);
