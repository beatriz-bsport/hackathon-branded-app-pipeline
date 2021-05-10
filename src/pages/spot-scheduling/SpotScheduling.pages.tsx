import { withStyles } from '@material-ui/styles';
import React from 'react';
import { compose } from 'recompose';

import { MaterialStyleType } from '../../utils/types';
import CanvasToolsMenu from './CanvasSvg/CanvasToolsMenu.component';
import { CanvasElement } from './CanvasSvg/tools/BaseClasses/Base.tool';
import withUndoRedoState, {
  WithUndoRedo,
} from '../../hocs/undo-redo-state.hoc';
import CanvasViewController from './CanvasSvg/CanvasViewController';
import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasSelectableToolsEnum,
  CanvasSelectableToolStrategy,
} from './CanvasSvg/tools/CanvasStrategy';

type UndoRedoState = {
  elements: CanvasElement<any>[];
  strokeColor?: string;
  fillColor?: string;
};

type Props = MaterialStyleType<ReturnType<typeof styles>> &
  WithUndoRedo<UndoRedoState>;

type State = {
  selectedTool: CanvasSelectableToolsEnum;
};

class SpotSchedulingPages extends React.PureComponent<Props, State> {
  state: State = {
    selectedTool: CANVAS_SELECTABLE_TOOLS.pointer,
  };

  get tool() {
    return CanvasSelectableToolStrategy[this.state.selectedTool];
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.onKeyDown);
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

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <CanvasViewController
          elements={this.props.current.elements}
          selectedTool={this.state.selectedTool}
          strokeColor={this.props.current.strokeColor}
          fillColor={this.props.current.fillColor}
          onElementsChange={(elements: CanvasElement<any>[]) =>
            this.props.setStateWithHistory({ elements })
          }
        />

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
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  svgContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
});

export default compose(
  // @ts-ignore
  withStyles(styles),
  withUndoRedoState({
    elements: [],
    strokeColor: 'black',
    fillColor: undefined,
  }),
)(SpotSchedulingPages);
