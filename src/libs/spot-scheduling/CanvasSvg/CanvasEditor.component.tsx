import React from 'react';

import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { withTheme } from '@storybook/theming';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import { CompanyTheme, Theme } from '#src/libs/theme/types';
import { DeepPartial, MaterialStyleType } from '../../../utils/types';
import CanvasToolsMenu from './CanvasToolsMenu.component';
import { CanvasElement } from './tools/BaseClasses/Base.tool';
import withUndoRedoState, {
  WithUndoRedo,
} from '../../../hocs/undo-redo-state.hoc';
import CanvasViewController from './CanvasViewController';
import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasSelectableToolsEnum,
  CanvasSelectableToolStrategy,
} from './tools/CanvasStrategy';
import SpotImageUploadDialog from './SpotImageUploadDialog.component';
import CanvasToolbar from './CanvasToolbar.component';
import { AssetForBlueprint, RoomBlueprint, SpotType } from '../types';
import { OptionCallback } from '../../../state/types';
import CanvasEditorCssForm from './CanvasEditorCssForm.component';

type UndoRedoState = {
  elements: CanvasElement<any>[];
  strokeColor?: string;
  fillColor?: string;
  wallStrokeColor?: string;
  wallFillColor?: string;
};

type OwnProps = {
  blueprints: RoomBlueprint[];
  selectedRoomBlueprint: RoomBlueprint | null;

  onSave?: (blueprint: DeepPartial<RoomBlueprint>) => void;
  onExit?: () => void;
  selectedTool?: CanvasSelectableToolsEnum | null;

  disableEdit?: boolean;
  onUpdateImages?: (
    images: { spot_free: any; spot_taken: any },
    options: OptionCallback,
  ) => void;
  assets: { [identifier: string]: AssetForBlueprint };
  onSelectElement?: (element: CanvasElement<any>) => void;
  coach?: any;
  openSpotCreationForm?: (defaultSpot: boolean) => void;
  selectingSpot: boolean;
  spotToSelect?: SpotType;
  spotTypes: SpotType[];
  openSpotUpdateForm?: (spotType: SpotType) => void;
  openDeleteModal?: () => void;
  openSpiviDialog?: () => void;
  isBoutiqueDisplay: boolean;
  fetchSpotForBlueprint: (data: { company: number }) => void;
  isMobile: boolean;
  onMouseOverSpot?: (spot: CanvasElement<any>) => void;
  openAssetUploader?: () => void;
  companyTheme?: CompanyTheme;
  coachDisplay?: MarketPlaceCoachDisplay;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithUndoRedo<UndoRedoState>;

type State = {
  selectedTool: CanvasSelectableToolsEnum;
  spotTypeId: number;
  name: string;
  showImageDialog: boolean;
  showGrid: boolean;
  coachHeight: number;
  spiviBoxId: number;
};

class CanvasEditorComponent extends React.PureComponent<Props, State> {
  get tool() {
    // @ts-expect-error
    return CanvasSelectableToolStrategy[this.state.selectedTool];
  }

  containerRef = React.createRef<HTMLDivElement>();

  dialogContainerRef = React.createRef<HTMLDivElement>();

  get elements() {
    return this.props.disableEdit
      ? this.props.selectedRoomBlueprint.canvas.elements
      : this.props.current.elements;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      name: props.selectedRoomBlueprint.name,
      selectedTool:
        props.selectedTool !== undefined
          ? props.selectedTool
          : CANVAS_SELECTABLE_TOOLS.pointer,
      showImageDialog: false,
      showGrid: false,
      coachHeight: this.props.selectedRoomBlueprint.canvas.coachHeight || 1,
      spiviBoxId: this.props.selectedRoomBlueprint?.spivi_box_id,
      // @ts-expect-error
      openCanvasCssForm: false,
    };
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.onKeyDown);
    this.setInitialState();
    this.props.fetchSpotForBlueprint &&
      this.props.fetchSpotForBlueprint({
        company: this.props.selectedRoomBlueprint.company,
      });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedRoomBlueprint !== this.props.selectedRoomBlueprint) {
      this.setInitialState();
    }
    if (prevProps.spotToSelect !== this.props.spotToSelect) {
      this.props.selectedTool &&
        this.props.spotToSelect &&
        // @ts-expect-error
        this.onChangeTool('spot', this.props.spotToSelect);
    }
  }

  setInitialState = () => {
    let elements: CanvasElement<any>[] = [];
    if (this.props.selectedRoomBlueprint?.canvas?.elements) {
      elements = this.props.selectedRoomBlueprint.canvas.elements;
    }
    this.props.setInitialState({
      elements,
      strokeColor: 'black',
      fillColor: undefined,
      wallStrokeColor: 'black',
      wallFillColor: undefined,
    });
  };

  onKeyDown = (e: any) => {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      e.preventDefault();
      this.toolCancel();
    }
  };

  toolCancel = () => {
    let res = true;
    if (this.tool && this.tool.onCancel) {
      res = !!this.tool.onCancel(this.state.spotTypeId);
    }
    res && this.setState({ selectedTool: CANVAS_SELECTABLE_TOOLS.pointer });
  };

  onChangeTool = (
    _selectedTool: CanvasSelectableToolsEnum,
    spotTypeId?: number,
  ) => {
    Object.values(CanvasSelectableToolStrategy).forEach((tool) => {
      if (tool.onCancel) {
        tool.onCancel(this.state.spotTypeId);
      }
    });

    let selectedTool = _selectedTool;
    if (
      this.state.selectedTool === _selectedTool &&
      this.state.spotTypeId === spotTypeId
    ) {
      selectedTool = CANVAS_SELECTABLE_TOOLS.pointer;
    }

    this.setState({ selectedTool, spotTypeId });
  };

  onChangeToolToResizer = () => {
    this.onChangeTool(CANVAS_SELECTABLE_TOOLS.resizer);
  };

  onHeightCoachChange = (coefficient: string) => {
    // @ts-expect-error
    this.setState({ coachHeight: coefficient });
  };

  // @ts-expect-error
  onSpiviBoxIdChange = (ev) => {
    this.setState({ spiviBoxId: ev.target.value });
  };

  onClickSave = () => {
    if (this.props.onSave) {
      const roomBlueprint = {
        id: this.props.selectedRoomBlueprint.id,
        name: this.state.name,
        canvas: {
          elements: this.props.current.elements,
          coachHeight: this.state.coachHeight,
        },
        spivi_box_id: this.state.spiviBoxId || null,
      };

      this.props.onSave(roomBlueprint);
    }
  };

  updateSpotImages = async (
    images: { spot_free: any; spot_taken: any },
    options: any,
  ) => {
    if (this.props.onUpdateImages) {
      await this.props.onUpdateImages(images, options);
    }
    this.setState({ showImageDialog: false });
  };

  getAsset = (identifier: string) => {
    if (this.props.assets) {
      return this.props.assets[identifier];
    }
    return undefined;
  };

  onChangeBlueprint = (blueprint: RoomBlueprint) => {
    this.props.setStateWithHistory({
      elements: blueprint.canvas?.elements || [],
    });
  };

  // @ts-expect-error
  deleteSpotType = (spotType) => {
    this.onClickSave();
    // @ts-expect-error
    this.props.onDeleteSpotType(spotType);
    this.toolCancel();
  };

  hasBlueprintChanged = () => {
    let old_elements = [];
    // @ts-expect-error
    if (this.props.selectedRoomBlueprint.canvas?.elements?.asMutable) {
      old_elements =
        // @ts-expect-error
        this.props.selectedRoomBlueprint.canvas?.elements?.asMutable();
    } else {
      old_elements = this.props.selectedRoomBlueprint.canvas?.elements;
    }

    let current_elements = [];

    // @ts-expect-error
    if (this.props.current.elements.asMutable) {
      // @ts-expect-error
      current_elements = this.props.current.elements.asMutable();
    } else {
      current_elements = this.props.current.elements;
    }

    const elementChanged = !isEqual(old_elements, current_elements);
    const nameChanged =
      this.props.selectedRoomBlueprint.name !== this.state.name;

    return nameChanged || elementChanged;
  };

  handleOpenCanvasCssForm = () => {
    // @ts-expect-error
    this.setState({ openCanvasCssForm: true });
  };

  handleCloseCanvasCssForm = () => {
    // @ts-expect-error
    this.setState({ openCanvasCssForm: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        className={classNames(classes.container, {
          [classes.containerIsMobile]: this.props.isMobile,
          // In order to have a bigger conainer to zoom in we do not use this container on mobile adding extra padding
          [classes.containerSelecting]:
            this.props.selectingSpot && !this.props.isMobile,
          [classes.containerSelectingIsNotMobile]:
            this.props.selectingSpot &&
            !this.props.isMobile &&
            !this.props.isBoutiqueDisplay,
          [classes.containerSelectingIsisBoutiqueDisplay]:
            this.props.isBoutiqueDisplay,
        })}
      >
        <div className={classes.toolbarCanvasContainer}>
          {!this.props.disableEdit && !this.props.isBoutiqueDisplay && (
            <CanvasToolbar
              blueprints={this.props.blueprints}
// @ts-expect-error
              disableSave={!this.hasBlueprintChanged()}
              onChangeBlueprint={this.onChangeBlueprint}
              onClickExit={this.props.onExit}
              onClickSave={this.onClickSave}
              onTitleChange={(name) => this.setState({ name })}
              openSpiviDialog={this.props.openSpiviDialog}
              selectedRoomBlueprint={this.props.selectedRoomBlueprint}
              title={this.state.name}
            />
          )}

          <div ref={this.containerRef} className={classes.canvasContainer}>
            <CanvasViewController
              coach={this.props.coach}
              coachDisplay={this.props.coachDisplay}
              coachHeight={this.state.coachHeight}
              containerRef={this.containerRef}
              disabledEdit={this.props.disableEdit}
              elements={this.elements}
              fillColor={this.props.current.fillColor}
              // @ts-expect-error
              getAsset={this.getAsset}
              isBoutiqueDisplay={this.props.isBoutiqueDisplay}
              isMobile={this.props.isMobile}
              onChangeToolToResizer={this.onChangeToolToResizer}
              onElementsChange={(elements: CanvasElement<any>[]) =>
                this.props.setStateWithHistory({ elements })
              }
              onMouseOverSpot={this.props.onMouseOverSpot}
              onSelectElement={this.props.onSelectElement}
              selectedTool={this.state.selectedTool}
              selectingSpot={this.props.selectingSpot}
              showGrid={this.state.showGrid && !this.props.disableEdit}
              spotTypeId={this.state.spotTypeId}
              spotTypes={this.props.spotTypes}
              strokeColor={this.props.current.strokeColor}
              wallFillColor={this.props.current.wallFillColor}
              wallStrokeColor={this.props.current.wallStrokeColor}
            />
          </div>
        </div>

        {!this.props.disableEdit && !this.props.isBoutiqueDisplay && (
          <div className={classes.toolMenuContainer}>
            <CanvasToolsMenu
              coachHeight={this.state.coachHeight}
              companyTheme={this.props.companyTheme}
              fillColor={this.props.current.fillColor}
              onChangeGridVisibility={(showGrid) => this.setState({ showGrid })}
              onClickRedo={this.props.redo}
              onClickUndo={this.props.undo}
              onClickUploadImage={() =>
                this.setState({ showImageDialog: true })
              }
              onDeleteSpotType={this.deleteSpotType}
              onHeightCoachChange={this.onHeightCoachChange}
              onSelectTool={this.onChangeTool}
              onSpiviBoxIdChange={this.onSpiviBoxIdChange}
              onStrokeColorChange={(fillColor) => {
                this.props.setStateWithHistory({
                  strokeColor: fillColor || 'transparent',
                });
              }}
              onwallFillColorChange={(fillColor) =>
                this.props.setStateWithHistory({
                  wallFillColor: fillColor || 'transparent',
                })
              }
              onwallStrokeColorChange={(strokeColor) =>
                this.props.setStateWithHistory({
                  wallStrokeColor: strokeColor || 'transparent',
                })
              }
              openAssetUploader={this.props.openAssetUploader}
              openDeleteModal={this.props.openDeleteModal}
              openPreviewDialog={this.handleOpenCanvasCssForm}
              // @ts-expect-error
              openSpotCreationForm={(defaultSpot: boolean) => {
                this.onClickSave();
                this.props.openSpotCreationForm?.(defaultSpot);
              }}
              openSpotUpdateForm={(spotType: SpotType) => {
                this.onClickSave();
                this.props.openSpotUpdateForm?.(spotType);
              }}
              selectedTool={this.state.selectedTool}
              showGrid={this.state.showGrid}
              spiviBoxId={this.state.spiviBoxId}
              spotTypeIdSelected={this.state.spotTypeId}
              spotTypes={this.props.spotTypes}
              strokeColor={this.props.current.strokeColor}
              wallFillColor={this.props.current.wallFillColor}
              wallStrokeColor={this.props.current.wallStrokeColor}
            />
          </div>
        )}

        {!this.props.disableEdit && !this.props.isBoutiqueDisplay && (
          <>
            <SpotImageUploadDialog
              onClose={() => this.setState({ showImageDialog: false })}
              onSubmit={this.updateSpotImages}
              open={this.state.showImageDialog}
            />
            <CanvasEditorCssForm
              coach={this.props.coach}
              coachDisplay={this.props.coachDisplay}
              coachHeight={this.state.coachHeight}
              elements={this.elements}
              // @ts-expect-error
              getAsset={this.getAsset}
              isMobile={this.props.isMobile}
              onClose={this.handleCloseCanvasCssForm}
              // @ts-expect-error
              open={this.state.openCanvasCssForm}
              roomBluePrint={this.props.selectedRoomBlueprint}
              spotTypes={this.props.spotTypes}
            />
          </>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    zIndex: 1,
    margin: 0,
  },
  containerIsMobile: {
    border: 'none',
  },
  containerSelectingIsNotMobile: {
    minHeight: '100vh',
  },
  containerSelectingIsisBoutiqueDisplay: {
    border: 'none',
  },
  containerSelecting: {
    // @ts-expect-error
    paddingRight: theme.spacing(3),
    // @ts-expect-error
    paddingLeft: theme.spacing(3),
    backgroundColor: 'white',
  },
  toolbarCanvasContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  canvasContainer: {
    display: 'flex',
    flex: 1,
    // @ts-expect-error
    paddingBottom: theme.spacing(3),
    // @ts-expect-error
    paddingTop: theme.spacing(3),
    overflow: 'hidden',
  },
  toolMenuContainer: {
    width: 320,
    position: 'relative',
    overflow: 'hidden',
  },
  previewDialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
});

export default compose<any, OwnProps>(
  withTheme,
  // @ts-expect-error
  withStyles(styles),
  withUndoRedoState({
    elements: [],
    strokeColor: 'black',
    fillColor: undefined,
    wallStrokeColor: 'black',
    wallFillColor: undefined,
  }),
)(CanvasEditorComponent);
