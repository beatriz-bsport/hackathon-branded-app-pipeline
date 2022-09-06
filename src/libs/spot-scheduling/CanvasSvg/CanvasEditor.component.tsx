import React from 'react';

import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import isEqual from 'lodash/isEqual';

import classNames from 'classnames';
import { isWidthDown } from '@material-ui/core/withWidth';
import { withTheme } from '@storybook/theming';
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
import { Theme } from '#libs/theme/types';

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
  openSpotCreationForm: (defaultSpot: boolean) => void;
  onCreateSpot: (spot: SpotType) => void;
  selectingSpot: boolean;
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
};

class CanvasEditorComponent extends React.PureComponent<Props, State> {
  get tool() {
    return CanvasSelectableToolStrategy[this.state.selectedTool];
  }

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

  onHeightCoachChange = (coefficient: string) => {
    this.setState({ coachHeight: coefficient });
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

  deleteSpotType = (spotType) => {
    this.onClickSave();
    this.props.onDeleteSpotType(spotType);
    this.toolCancel();
  };

  hasBlueprintChanged = () => {
    let old_elements = [];
    if (this.props.selectedRoomBlueprint.canvas?.elements?.asMutable) {
      old_elements =
        this.props.selectedRoomBlueprint.canvas?.elements?.asMutable();
    } else {
      old_elements = this.props.selectedRoomBlueprint.canvas?.elements;
    }

    let current_elements = [];

    if (this.props.current.elements.asMutable) {
      current_elements = this.props.current.elements.asMutable();
    } else {
      current_elements = this.props.current.elements;
    }

    const elementChanged = !isEqual(old_elements, current_elements);
    const nameChanged =
      this.props.selectedRoomBlueprint.name !== this.state.name;

    return nameChanged || elementChanged;
  };

  render() {
    const { classes, width } = this.props;
    const isMobile = isWidthDown('md', width);

    return (
      <div
        className={classNames(classes.container, {
          [classes.containerIsMobile]: this.props.isMobile,
          [classes.containerSelecting]: this.props.selectingSpot,
          [classes.containerSelectingIsNotMobile]:
            this.props.selectingSpot && !isMobile,
        })}
      >
        <div className={classes.toolbarCanvasContainer}>
          {!this.props.disableEdit && (
            <CanvasToolbar
              title={this.state.name}
              onTitleChange={(name) => this.setState({ name })}
              onClickSave={this.onClickSave}
              onClickExit={this.props.onExit}
              blueprints={this.props.blueprints}
              onChangeBlueprint={this.onChangeBlueprint}
              disableSave={!this.hasBlueprintChanged()}
            />
          )}

          <div className={classes.canvasContainer}>
            <CanvasViewController
              elements={this.elements}
              selectedTool={this.state.selectedTool}
              strokeColor={this.props.current.strokeColor}
              wallStrokeColor={this.props.current.wallStrokeColor}
              fillColor={this.props.current.fillColor}
              wallFillColor={this.props.current.wallFillColor}
              onElementsChange={(elements: CanvasElement<any>[]) =>
                this.props.setStateWithHistory({ elements })
              }
              getAsset={this.getAsset}
              onSelectElement={this.props.onSelectElement}
              disabledEdit={this.props.disableEdit}
              showGrid={this.state.showGrid && !this.props.disableEdit}
              coach={this.props.coach}
              coachHeight={this.state.coachHeight}
              selectingSpot={this.props.selectingSpot}
              spotTypes={this.props.spotTypes}
              spotTypeId={this.state.spotTypeId}
            />
          </div>
        </div>

        {!this.props.disableEdit && (
          <div className={classes.toolMenuContainer}>
            <CanvasToolsMenu
              selectedTool={this.state.selectedTool}
              onSelectTool={this.onChangeTool}
              onClickUndo={this.props.undo}
              onClickRedo={this.props.redo}
              strokeColor={this.props.current.strokeColor}
              wallStrokeColor={this.props.current.wallStrokeColor}
              wallFillColor={this.props.current.wallFillColor}
              fillColor={this.props.current.fillColor}
              onStrokeColorChange={(fillColor) => {
                this.props.setStateWithHistory({
                  strokeColor: fillColor || 'transparent',
                });
              }}
              onwallStrokeColorChange={(strokeColor) =>
                this.props.setStateWithHistory({
                  wallStrokeColor: strokeColor || 'transparent',
                })
              }
              onwallFillColorChange={(fillColor) =>
                this.props.setStateWithHistory({
                  wallFillColor: fillColor || 'transparent',
                })
              }
              onClickUploadImage={() =>
                this.setState({ showImageDialog: true })
              }
              showGrid={this.state.showGrid}
              onChangeGridVisibility={(showGrid) => this.setState({ showGrid })}
              onHeightCoachChange={this.onHeightCoachChange}
              coachHeight={this.state.coachHeight}
              openSpotCreationForm={(defaultSpot: boolean) => {
                this.onClickSave();
                this.props.openSpotCreationForm(defaultSpot);
              }}
              openSpotUpdateForm={() => {
                this.onClickSave();
                this.props.openSpotUpdateForm();
              }}
              openDeleteModal={this.props.openDeleteModal}
              spotTypes={this.props.spotTypes}
              onDeleteSpotType={this.deleteSpotType}
              spotTypeIdSelected={this.state.spotTypeId}
            />
          </div>
        )}

        {!this.props.disableEdit && (
          <SpotImageUploadDialog
            open={this.state.showImageDialog}
            onClose={() => this.setState({ showImageDialog: false })}
            onSubmit={this.updateSpotImages}
          />
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
    borderColor: '#CCC',
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: 'solid',
    margin: 0,
  },
  containerIsMobile: {
    border: 'none',
  },
  containerSelectingIsNotMobile: {
    minHeight: '80vh',
  },
  containerSelecting: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    minHeight: '100vh',
  },
  toolbarCanvasContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  canvasContainer: {
    display: 'flex',
    flex: 1,
    maxHeight: '100%',
    overflow: 'hidden',
  },
  toolMenuContainer: {
    width: 320,
    position: 'relative',
    overflow: 'hidden',
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withTheme,
  withStyles(styles),
  withUndoRedoState({
    elements: [],
    strokeColor: 'black',
    fillColor: undefined,
    wallStrokeColor: 'black',
    wallFillColor: undefined,
  }),
)(CanvasEditorComponent);
