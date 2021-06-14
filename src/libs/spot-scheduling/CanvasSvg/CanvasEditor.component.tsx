import React from 'react';

import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import { isEqual } from 'lodash';

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
import { AssetForBlueprint, RoomBlueprint } from '../types';
import { OptionCallback } from '../../../state/types';

type UndoRedoState = {
  elements: CanvasElement<any>[];
  strokeColor?: string;
  fillColor?: string;
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
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithUndoRedo<UndoRedoState>;

type State = {
  selectedTool: CanvasSelectableToolsEnum;
  name: string;
  showImageDialog: boolean;
  showGrid: boolean;
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
    };
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.onKeyDown);
    this.setInitialState();
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedRoomBlueprint !== this.props.selectedRoomBlueprint) {
      this.setInitialState();
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
      res = !!this.tool.onCancel();
    }
    res && this.setState({ selectedTool: CANVAS_SELECTABLE_TOOLS.pointer });
  };

  onChangeTool = (_selectedTool: CanvasSelectableToolsEnum) => {
    Object.values(CanvasSelectableToolStrategy).forEach((tool) => {
      if (tool.onCancel) {
        tool.onCancel();
      }
    });

    let selectedTool = _selectedTool;
    if (this.state.selectedTool === _selectedTool) {
      selectedTool = CANVAS_SELECTABLE_TOOLS.pointer;
    }

    this.setState({ selectedTool });
  };

  onClickSave = () => {
    if (this.props.onSave) {
      const roomBlueprint = {
        id: this.props.selectedRoomBlueprint.id,
        name: this.state.name,
        canvas: {
          elements: this.props.current.elements,
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

  hasBlueprintChanged = () => {
    let old_elements = [];
    if (this.props.selectedRoomBlueprint.canvas?.elements?.asMutable) {
      old_elements = this.props.selectedRoomBlueprint.canvas?.elements?.asMutable();
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
    const { classes } = this.props;

    return (
      <div className={classes.container}>
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
              fillColor={this.props.current.fillColor}
              onElementsChange={(elements: CanvasElement<any>[]) =>
                this.props.setStateWithHistory({ elements })
              }
              getAsset={this.getAsset}
              onSelectElement={this.props.onSelectElement}
              disabledEdit={this.props.disableEdit}
              showGrid={this.state.showGrid && !this.props.disableEdit}
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
              fillColor={this.props.current.fillColor}
              onStrokeColorChange={(strokeColor) =>
                this.props.setStateWithHistory({
                  strokeColor: strokeColor || 'transparent',
                })
              }
              onFillColorChange={(fillColor) =>
                this.props.setStateWithHistory({
                  fillColor: fillColor || 'transparent',
                })
              }
              onClickUploadImage={() =>
                this.setState({ showImageDialog: true })
              }
              showGrid={this.state.showGrid}
              onChangeGridVisibility={(showGrid) => this.setState({ showGrid })}
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

const styles = () => ({
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
    height: window.innerHeight - 64,
    width: 320,
    position: 'relative',
    overflow: 'hidden',
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withUndoRedoState({
    elements: [],
    strokeColor: 'black',
    fillColor: undefined,
  }),
)(CanvasEditorComponent);
