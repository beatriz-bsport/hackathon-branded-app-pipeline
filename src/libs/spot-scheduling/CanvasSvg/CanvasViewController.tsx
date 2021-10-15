import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import clx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

import CanvasSvg from './CanvasSvg';
import { CanvasElement } from './tools/BaseClasses/Base.tool';
import { MaterialStyleType } from '../../../utils/types';
import {
  CanvasComponentClasses,
  CanvasSelectableToolStrategy,
  CanvasSelectableToolsEnum,
  CANVAS_SELECTABLE_TOOLS,
} from './tools/CanvasStrategy';
import CanvasScreenComponent from './tools/Screen/CanvasScreen.component';
import CanvasTeacherComponent from './tools/Teacher/CanvasTeacher.component';
import CanvasZoomButtons from './CanvasZoomButtons.component';

interface OwnProps {
  elements: CanvasElement<any>[];
  selectedTool: CanvasSelectableToolsEnum;
  strokeColor?: string;
  fillColor?: string;
  onElementsChange: (elements: CanvasElement<any>[]) => void;
  selectedElement?: CanvasElement<any>;
  onChangeSelectedElement: (element: CanvasElement<any>) => void;
  getAsset: (identifier: string) => string;
  onSelectElement: (element: CanvasElement<any>) => void;
  disabledEdit?: boolean;
  showGrid: boolean;
  coach?: any;
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class CanvasViewController extends React.PureComponent<Props> {
  cursorId = `canvas-cursor-${Date.now()}`;

  svgId = '';

  svgFunction: {
    centerSvg: (params: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    }) => void | null;
    zoomIn: () => void;
    zoomOut: () => void;
  } = {};

  constructor(props: Props) {
    super(props);

    CanvasScreenComponent.label = props.t('toolsMenu.screen');
    CanvasTeacherComponent.label = props.t('toolsMenu.teacher');

    this.state = {
      isUnsafeZone: false,
    };
  }

  get tool() {
    if (!this.props.selectedTool) {
      return undefined;
    }

    return CanvasSelectableToolStrategy[this.props.selectedTool];
  }

  componentDidMount() {
    this.centerAccordingToElementBoundaries();
  }

  centerAccordingToElementBoundaries = () => {
    if (
      this.svgFunction.centerSvg &&
      this.props.elements &&
      this.props.elements.length
    ) {
      let minX = 4000;
      let minY = 4000;
      let maxX = 0;
      let maxY = 0;

      this.props.elements.forEach((element) => {
        const tool = CanvasSelectableToolStrategy[element.type];
        if (tool?.getBoundaries) {
          const boundaries = tool.getBoundaries(element);
          if (boundaries.minX < minX) {
            minX = boundaries.minX;
          }
          if (boundaries.minY < minY) {
            minY = boundaries.minY;
          }
          if (boundaries.maxX > maxX) {
            maxX = boundaries.maxX;
          }
          if (boundaries.maxY > maxY) {
            maxY = boundaries.maxY;
          }
        }
      });

      this.svgFunction.centerSvg({
        minX,
        minY,
        maxX,
        maxY,
      });
    }
  };

  zoomIn = () => {
    this.svgFunction.zoomIn && this.svgFunction.zoomIn();
  };

  zoomOut = () => {
    this.svgFunction.zoomOut && this.svgFunction.zoomOut();
  };

  onSvgClick = (x: number, y: number, mouseEvent: any) => {
    if (this.tool && this.tool.onClick) {
      const elements = this.tool.onClick({
        x,
        y,
        elements: this.props.elements,
        settings: {
          fillColor: this.props.fillColor,
          strokeColor: this.props.strokeColor,
        },
        mouseEvent,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onSvgMouseMove = (
    x: number,
    y: number,
    absoluteX: number,
    absoluteY: number,
    mouseEvent: any,
  ) => {
    const cursor = document.getElementById(this.cursorId);
    if (cursor) {
      cursor.style.position = 'absolute';
      cursor.style.left = `${absoluteX}px`;
      cursor.style.top = `${absoluteY}px`;
      cursor.style.zIndex = '9999';
      cursor.style.visibility = 'visible';
    }

    if (this.tool && this.tool.onMove) {
      const elements = this.tool.onMove({
        x,
        y,
        elements: this.props.elements,
        settings: {
          fillColor: this.props.fillColor,
          strokeColor: this.props.strokeColor,
        },
        mouseEvent,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onSvgMouseOut = (mouseEvent: any) => {
    const cursor = document.getElementById(this.cursorId);
    if (cursor) {
      cursor.style.visibility = 'hidden';
    }

    if (this.tool && this.tool.onMouseOut) {
      this.tool.onMouseOut({
        x: 0,
        y: 0,
        elements: this.props.elements,
        settings: {
          fillColor: this.props.fillColor,
          strokeColor: this.props.strokeColor,
        },
        mouseEvent,
      });
    }
  };

  onMouseClickElement = (
    mouseEvent: any,
    clickedElement: CanvasElement<any>,
  ) => {
    if (this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.spot_selector) {
      this.props.onSelectElement(clickedElement);
      return;
    }

    if (this.tool && this.tool.onClickElement) {
      const elements = this.tool.onClickElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseOverElement = (
    mouseEvent: any,
    clickedElement: CanvasElement<any>,
  ) => {
    if (this.tool && this.tool.onMouseOverElement) {
      const elements = this.tool.onMouseOverElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseOutElement = (mouseEvent: any, clickedElement: CanvasElement<any>) => {
    if (this.tool && this.tool.onMouseOutElement) {
      const elements = this.tool.onMouseOutElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseDownElement = (
    mouseEvent: any,
    clickedElement: CanvasElement<any>,
  ) => {
    if (this.tool && this.tool.onMouseDownElement) {
      const elements = this.tool.onMouseDownElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseUpElement = (mouseEvent: any, clickedElement: CanvasElement<any>) => {
    if (this.tool && this.tool.onMouseUpElement) {
      const elements = this.tool.onMouseUpElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onSvgId = (svgId: string) => {
    this.svgId = svgId;
  };

  registerSvgFunctions = (params: any) => {
    this.svgFunction = params;
  };

  /**
   * Render elements and draft
   * Define the z-axis order between drawable elements
   */
  renderElements = () => {
    const elementAndDraft: {
      element?: CanvasElement<any>;
      draftType?: any;
    }[] = [];
    this.props.elements.forEach((el) => {
      elementAndDraft.push({ element: el });
    });

    Object.keys(CanvasSelectableToolStrategy).forEach((key) => {
      const Component = CanvasComponentClasses[key];

      if (Component) {
        elementAndDraft.push({ draftType: key });
      }
    });

    const orderedElementsAndDraft = elementAndDraft.sort((a, b) => {
      const A = a.draftType
        ? CanvasComponentClasses[a.draftType]
        : CanvasComponentClasses[a.element.type];
      const B = b.draftType
        ? CanvasComponentClasses[b.draftType]
        : CanvasComponentClasses[b.element.type];

      return A.zIndex - B.zIndex;
    });

    return orderedElementsAndDraft.map((elementOrDraft) => {
      if (elementOrDraft.draftType) {
        const DraftComponent = CanvasComponentClasses[elementOrDraft.draftType];
        // @ts-ignore
        const tool = CanvasSelectableToolStrategy[elementOrDraft.draftType];

        if (this.props.selectedTool !== elementOrDraft.draftType) {
          return null;
        }

        if (this.state.isUnsafeZone) {
          return null;
        }

        return (
          <DraftComponent
            key={tool.draftId}
            id={tool.draftId}
            getAsset={this.props.getAsset}
          />
        );
      }

      if (elementOrDraft.element) {
        const { element } = elementOrDraft;
        const Component = CanvasComponentClasses[elementOrDraft.element.type];

        if (Component) {
          return (
            <Component
              key={element.id}
              id={element.id}
              getAsset={this.props.getAsset}
              onMouseOver={(evt: any) => this.onMouseOverElement(evt, element)}
              onClick={(evt: any) => this.onMouseClickElement(evt, element)}
              onMouseOut={(evt: any) => this.onMouseOutElement(evt, element)}
              onMouseDown={(evt: any) => this.onMouseDownElement(evt, element)}
              onMouseUp={(evt: any) => this.onMouseUpElement(evt, element)}
              {...element.data}
              coach={this.props.coach}
            />
          );
        }
      }
      return null;
    });
  };

  renderCursor = () => {
    if (this.tool && this.tool.renderCursor) {
      return this.tool.renderCursor();
    }
    return null;
  };

  render() {
    const { classes } = this.props;

    return (
      <div
        className={clx(classes.relativeContainer, {
          [classes.noCursor]: this.tool && this.tool.hideNativeCursor,
        })}
      >
        <CanvasSvg
          onClick={this.onSvgClick}
          onMouseMove={this.onSvgMouseMove}
          onMouseOut={this.onSvgMouseOut}
          enablePan={[
            CANVAS_SELECTABLE_TOOLS.hand,
            CANVAS_SELECTABLE_TOOLS.spot_selector,
          ].includes(this.props.selectedTool)}
          onSvgId={this.onSvgId}
          registerFunction={this.registerSvgFunctions}
          showGrid={this.props.showGrid}
          onEnterUnsafeZone={() => this.setState({ isUnsafeZone: true })}
          onLeaveUnsafeZone={() => this.setState({ isUnsafeZone: false })}
        >
          {this.renderElements()}
        </CanvasSvg>

        <div className={classes.cursor} id={this.cursorId}>
          {this.renderCursor()}
        </div>

        <CanvasZoomButtons
          onClickZoomIn={this.zoomIn}
          onClickZoomOut={this.zoomOut}
          onClickCenter={
            this.props.disabledEdit
              ? this.centerAccordingToElementBoundaries
              : undefined
          }
        />
      </div>
    );
  }
}

const styles = () => ({
  relativeContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  crosshairCursor: {
    cursor: 'crosshair',
  },
  cursor: {
    pointerEvents: 'none',
  },
  noCursor: {
    cursor: 'none',
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasViewController);
