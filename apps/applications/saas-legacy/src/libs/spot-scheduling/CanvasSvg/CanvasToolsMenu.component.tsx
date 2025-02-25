import {
  ButtonBase,
  Button,
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
import clsx from 'clsx';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CreateIcon from '@material-ui/icons/Create';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import AddIcon from '@material-ui/icons/Add';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import UndoIcon from '@material-ui/icons/Undo';
import InputAdornment from '@material-ui/core/InputAdornment';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import HeightIcon from '@material-ui/icons/Height';
import RedoIcon from '@material-ui/icons/Redo';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CodeIcon from '@material-ui/icons/Code';
import BuildIcon from '@material-ui/icons/Build';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PollIcon from '@material-ui/icons/Poll';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import { UPSELL_IDENTIFIER_SPIVI } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { FeatureList } from '#src/libs/company/types';
import { CompanyTheme } from '#src/libs/theme/types';
import EraserIcon from './tools/Eraser/Eraser.icon';
import ColorInput from '../../../components/input/ColorInput.component';
import { MaterialStyleType } from '../../../utils/types';
import { DEFAULT_SPOT_TYPE_ID } from '../utils';
import CanvasSpotToolMenu from './CanvasSpotToolMenu.component';

import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasSelectableToolsEnum,
} from './tools/CanvasStrategy';
import PointerIcon from './tools/Pointer/Pointer.icon';
import HandIcon from './tools/Hand/Hand.icon';
import { SpotType } from '../types';

import Config from '../../../config';
type OwnProps = {
  selectedTool: CanvasSelectableToolsEnum;
  onSelectTool: (tool: CanvasSelectableToolsEnum, spotId?: number) => void;
  onClickUndo: () => void;
  onClickRedo: () => void;
  strokeColor: string;
  wallStrokeColor: string;
  wallFillColor: string;
  onStrokeColorChange: (color: string) => void;
  onwallStrokeColorChange: (color: string) => void;
  onwallFillColorChange: (color: string) => void;
  showGrid: boolean;
  onChangeGridVisibility: (value: boolean) => void;
  onHeightCoachChange: (coefficient: string) => void;
  coachHeight: number;
  openSpotCreationForm: () => void;
  spotTypes: SpotType[];
  openDeleteModal: () => void;
  openSpotUpdateForm: (spotType: SpotType) => void;
  onDeleteSpotType: (spotType: SpotType) => void;
  spotTypeIdSelected?: number;
  spiviBoxId: number;
  onSpiviBoxIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openAssetUploader: () => void;
  openPreviewDialog: () => void;
  companyTheme: CompanyTheme;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class CanvasToolsMenu extends React.PureComponent<Props> {
  handleClickResizerTool = () =>
    this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.resizer);

  handleClickCssTool = () => {
    this.props.openPreviewDialog();
    this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.pointer);
  };

  render() {
    // @ts-expect-error
    const sortSpots = (a, b) => b.id - a.id;
    const { classes, t } = this.props;
    const copySpotTypes = [...(this.props.spotTypes ?? [])];

    return (
      <div className={classes.toolsMenuContainer}>
        <Typography variant="h5">{t('toolsMenu.title')}</Typography>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.edition')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={4}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
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
                className={clsx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.resizer,
                })}
                onClick={this.handleClickResizerTool}
              >
                <AspectRatioIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.resize')}</Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
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
                className={clsx({
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
                className={clsx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.copier,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.copier);
                }}
              >
                <FileCopyIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.copier')}</Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
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
        </Grid>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.editionAdvanced')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={4}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
                  [classes.item]: true,
                  [classes.itemSelected]:
                    this.props.selectedTool ===
                    CANVAS_SELECTABLE_TOOLS.beautifier,
                })}
                onClick={() => {
                  this.props.onSelectTool(CANVAS_SELECTABLE_TOOLS.beautifier);
                }}
              >
                <BuildIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.advancedTool')}</Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={classes.item}
                onClick={this.handleClickCssTool}
              >
                <CodeIcon fontSize="large" />
              </ButtonBase>
              <Typography> {t('toolsMenu.cssEditor')}</Typography>
            </div>
          </Grid>
        </Grid>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.editionHistory')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={4}>
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
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.walls')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={4}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
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
                className={clsx({
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
              transparentColorAvailable
              color={this.props.wallStrokeColor}
              onChange={this.props.onwallStrokeColorChange}
            />
          </Grid>

          <Grid item xs={9}>
            <Typography className={classes.customItemContainer}>
              {t('toolsMenu.customFill')}
            </Typography>
            <ColorInput
              transparentColorAvailable
              color={this.props.wallFillColor}
              onChange={this.props.onwallFillColorChange}
            />
          </Grid>
        </Grid>
        <div className={classes.otherOptions}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.showGrid}
                color="primary"
                onChange={(e) =>
                  this.props.onChangeGridVisibility(e.target.checked)
                }
              />
            }
            label={t('toolsMenu.showGrid')}
          />
        </div>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.place')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={4}>
          {copySpotTypes.sort(sortSpots).map((spotType) => {
            if (spotType.id === DEFAULT_SPOT_TYPE_ID)
              return (
                <Grid item xs={4}>
                  <CanvasSpotToolMenu
                    default
                    onSelectTool={() =>
                      this.props.onSelectTool(
                        CANVAS_SELECTABLE_TOOLS.spot,
                        DEFAULT_SPOT_TYPE_ID,
                      )
                    }
                    openSpotUpdateForm={() => {
                      // @ts-expect-error
                      this.props.openSpotCreationForm(true);
                    }}
                    selected={
                      this.props.selectedTool ===
                        CANVAS_SELECTABLE_TOOLS.spot &&
                      this.props.spotTypeIdSelected === DEFAULT_SPOT_TYPE_ID
                    }
                  />
                </Grid>
              );
            return (
              <Grid item xs={4}>
                <CanvasSpotToolMenu
                  onDeleteSpot={this.props.openDeleteModal}
                  onDeleteSpotType={this.props.onDeleteSpotType}
                  onSelectTool={() => {
                    this.props.onSelectTool(
                      CANVAS_SELECTABLE_TOOLS.spot,
                      spotType.id,
                    );
                  }}
                  openSpotUpdateForm={this.props.openSpotUpdateForm}
                  selected={
                    this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.spot &&
                    this.props.spotTypeIdSelected === spotType.id
                  }
                  spotType={spotType}
                />
              </Grid>
            );
          })}
          <Grid item className={classes.addSpotContainer} xs={4}>
            <Tooltip title={t('toolsMenu.addSpotType')}>
              <ButtonBase
                className={classes.addSpotButton}
                onClick={() => {
                  // @ts-expect-error
                  this.props.openSpotCreationForm(false);
                }}
              >
                <AddIcon />
              </ButtonBase>
            </Tooltip>
          </Grid>
        </Grid>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.teacher')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={4}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
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
              <Typography className={classes.teacherHeight} variant="body2">
                Taille
              </Typography>
              <TextField
                defaultValue={1}
                error={this.props.coachHeight <= 0}
                helperText={
                  this.props.coachHeight <= 0 && t('toolsMenu.helperText')
                }
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <HeightIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(ev) =>
                  this.props.onHeightCoachChange(ev.target.value)
                }
                type="number"
                value={this.props.coachHeight}
              />
            </div>
          </Grid>
        </Grid>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.elements')}
        </Typography>
        <Grid container className={classes.sectionContainer} spacing={3}>
          <Grid item xs={4}>
            <div className={classes.itemContainer}>
              <ButtonBase
                className={clsx({
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
                className={clsx({
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
        <Typography className={classes.sectionTitle} variant="h6">
          {t('toolsMenu.sections.assets')}
        </Typography>
        <Button onClick={this.props.openAssetUploader}>
          <OpenInNewIcon />
          <Typography> {t('toolsMenu.openAssetModal')}</Typography>
        </Button>
        <Grid item xs={9}>
          <Typography className={classes.customItemContainer}>
            {t('toolsMenu.customFill')}
          </Typography>
          <ColorInput
            transparentColorAvailable
            color={this.props.strokeColor}
            onChange={this.props.onStrokeColorChange}
          />
        </Grid>
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <div>
              <Typography className={classes.sectionTitle} variant="h6">
                {t('toolsMenu.sections.spivi')}
              </Typography>
              <TextField
                disabled={!hasUpsell(featureList, UPSELL_IDENTIFIER_SPIVI)}
                helperText={t('toolsMenu.requiredForSpivi')}
                label={t('toolsMenu.boxId')}
                onChange={this.props.onSpiviBoxIdChange}
                type="number"
                value={this.props.spiviBoxId}
              />
            </div>
          )}
        </FeatureListProvider>
        {(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
          !!this.props.companyTheme?.has_partnership) && (
          <>
            <Typography className={classes.sectionTitle} variant="h6">
              {t('toolsMenu.sections.marketplaces')}
            </Typography>

            <Grid container className={classes.sectionContainer} spacing={4}>
              <Grid item xs={12}>
                <div className={classes.itemContainer}>
                  <ButtonBase
                    className={clsx({
                      [classes.item]: true,
                      [classes.itemSelected]:
                        this.props.selectedTool ===
                        CANVAS_SELECTABLE_TOOLS.preferential_bsport_spot_tool,
                    })}
                    onClick={() => {
                      this.props.onSelectTool(
                        CANVAS_SELECTABLE_TOOLS.preferential_bsport_spot_tool,
                      );
                    }}
                  >
                    <PollIcon fontSize="large" />
                  </ButtonBase>
                  <Typography>
                    {t('toolsMenu.bsportPreferentialSpots')}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </>
        )}
        <div className={classes.spacer} />
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
  spacer: {
    paddingTop: 100,
  },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasToolsMenu);
