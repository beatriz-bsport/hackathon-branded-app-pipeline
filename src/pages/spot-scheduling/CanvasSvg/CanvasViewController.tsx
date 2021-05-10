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
} from './tools/CanvasStrategy';
import CanvasScreenComponent from './tools/Screen/CanvasScreen.component';
import CanvasTeacherComponent from './tools/Teacher/CanvasTeacher.component';

interface OwnProps {
  elements: CanvasElement<any>[];
  selectedTool: CanvasSelectableToolsEnum;
  strokeColor?: string;
  fillColor?: string;
  onElementsChange: (elements: CanvasElement<any>[]) => void;
  selectedElement?: CanvasElement<any>;
  onChangeSelectedElement: (element: CanvasElement<any>) => void;
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class CanvasViewController extends React.PureComponent<Props> {
  cursorId = `canvas-cursor-${Date.now()}`;

  constructor(props: Props) {
    super(props);

    CanvasScreenComponent.label = props.t('toolsMenu.screen');
    CanvasTeacherComponent.label = props.t('toolsMenu.teacher');
  }

  get tool() {
    if (!this.props.selectedTool) {
      return undefined;
    }

    return CanvasSelectableToolStrategy[this.props.selectedTool];
  }

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

  onSvgMouseMove = (x: number, y: number, mouseEvent: any) => {
    const cursor = document.getElementById(this.cursorId);
    if (cursor) {
      cursor.style.position = 'absolute';
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.zIndex = '9999';
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
      cursor.style.zIndex = '-1';
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
    if (this.tool && this.tool.onClickElement) {
      const elements = this.tool.onClickElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
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
      });
      elements && this.props.onElementsChange(elements);
    }
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

        return <DraftComponent key={tool.draftId} id={tool.draftId} />;
      }

      if (elementOrDraft.element) {
        const { element } = elementOrDraft;
        const Component = CanvasComponentClasses[elementOrDraft.element.type];

        if (Component) {
          return (
            <Component
              key={element.id}
              id={element.id}
              onMouseOver={(evt: any) => this.onMouseOverElement(evt, element)}
              onClick={(evt: any) => this.onMouseClickElement(evt, element)}
              onMouseOut={(evt: any) => this.onMouseOutElement(evt, element)}
              onMouseDown={(evt: any) => this.onMouseDownElement(evt, element)}
              onMouseUp={(evt: any) => this.onMouseUpElement(evt, element)}
              {...element.data}
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
        className={clx(classes.container, {
          [classes.crosshairCursor]: this.tool && this.tool.renderCursor,
        })}
      >
        <CanvasSvg
          onClick={this.onSvgClick}
          onMouseMove={this.onSvgMouseMove}
          onMouseOut={this.onSvgMouseOut}
        >
          {this.renderElements()}
        </CanvasSvg>

        <div className={classes.cursor} id={this.cursorId}>
          {this.renderCursor()}
        </div>
      </div>
    );
  }
}

const styles = () => ({
  container: {
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
});

export default compose(
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasViewController);
