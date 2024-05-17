// @ts-nocheck
import CanvasAbstractTool, {
  CanvasSvgMouseParamsI,
  CanvasElementMouseParamI,
  CanvasElement,
} from '../BaseClasses/Base.tool';
import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasControllerStrategy,
} from '../CanvasStrategy';
import { ElementDOMController } from '../BaseClasses/Base.controller';
import { SVG_WORK_SIZE } from '../../CanvasSvg';

type SelectedElement = {
  downX: number;
  downY: number;
  elementDownX: number;
  elementDownY: number;
  controller: ElementDOMController<any>;
  element: CanvasElement<any>;
  elementDownH: number;
  elementDownW: number;
};

export default class CanvasResizerTool extends CanvasAbstractTool<null> {
  type = CANVAS_SELECTABLE_TOOLS.resizer;

  selectedElement: SelectedElement = null;

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { mouseEvent } = params;
    if (mouseEvent.target.nodeName.toLowerCase() === 'svg') {
      this.selectedElement = null;
    }
  };

  onMove = (params: CanvasSvgMouseParamsI) => {
    const { x, y } = params;

    if (this.selectedElement && this.selectedElement.controller) {
      if (x < 0 || x > SVG_WORK_SIZE) {
        this.selectedElement.controller.setDimension(
          this.selectedElement.elementDownX,
          this.selectedElement.elementDownY,
        );
        return undefined;
      }
      if (y < 0 || y > SVG_WORK_SIZE) {
        this.selectedElement.controller.setDimension(
          this.selectedElement.elementDownX,
          this.selectedElement.elementDownY,
        );
        return undefined;
      }
    }

    this.resizeElement(x, y);
    return undefined;
  };

  onMouseOut = () => {
    if (this.selectedElement && this.selectedElement.controller) {
      this.selectedElement.controller.blur();

      this.selectedElement.controller.setDimension(
        this.selectedElement.elementDownW,
        this.selectedElement.elementDownH,
      );

      this.selectedElement = null;
    }
  };

  onCancel = () => {
    if (this.selectedElement) {
      this.selectedElement.controller.setDimension(
        this.selectedElement.elementDownW,
        this.selectedElement.elementDownH,
      );
    }
  };

  onMouseDownElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement, mouseEvent, svgId } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    if (!controller.compatibleWithResize) {
      return;
    }
    const { x, y } = this.getMousePosition(svgId, mouseEvent);
    const position = controller.select(clickedElement.id).getPosition();
    const dimensions = controller.select(clickedElement.id).getDimensions();

    this.selectedElement = {
      downX: x,
      downY: y,
      elementDownX: position.x,
      elementDownY: position.y,
      controller,
      element: clickedElement,
      elementDownH: dimensions.height,
      elementDownW: dimensions.width,
    };
  };

  onMouseUpElement = (params: CanvasElementMouseParamI) => {
    const { elements, svgId, mouseEvent } = params;
    if (!this.selectedElement?.controller?.compatibleWithResize) {
      return undefined;
    }
    const { x, y } = this.getMousePosition(svgId, mouseEvent);

    if (this.selectedElement && this.selectedElement.controller) {
      if (x < 0 || x > SVG_WORK_SIZE) {
        this.selectedElement.controller.setPosition(
          this.selectedElement.elementDownX,
          this.selectedElement.elementDownY,
        );
        this.selectedElement = null;
        return undefined;
      }
      if (y < 0 || y > SVG_WORK_SIZE) {
        this.selectedElement.controller.setPosition(
          this.selectedElement.elementDownX,
          this.selectedElement.elementDownY,
        );
        this.selectedElement = null;
        return undefined;
      }
    }

    const newElements = this.onDragDone(elements);
    return newElements;
  };

  onMouseOverElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;

    /**
     * If there is already an element selected do nothing
     */
    if (this.selectedElement) {
      return;
    }

    const controller = CanvasControllerStrategy[clickedElement.type];
    if (!controller?.compatibleWithResize) {
      return;
    }
    controller && controller.select(clickedElement.id).focus();
  };

  onMouseOutElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;

    /**
     * If there is already an element selected do nothing
     */
    if (this.selectedElement) {
      return;
    }

    const controller = CanvasControllerStrategy[clickedElement.type];
    if (!controller?.compatibleWithResize) {
      return;
    }
    controller && controller.select(clickedElement.id).blur();
  };

  private getMousePosition = (svgId: string, evt: any) => {
    const svg = document.getElementById(svgId);
    // @ts-expect-error
    const CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  };

  private resizeElement = (x: number, y: number) => {
    if (!this.selectedElement) {
      return;
    }

    const vector = {
      x: x - this.selectedElement.downX,
      y: y - this.selectedElement.downY,
    };

    const elementDimensions = {
      width: this.selectedElement.elementDownW + vector.x,
      height: this.selectedElement.elementDownH + vector.y,
    };

    this.selectedElement.controller.setDimension(
      elementDimensions.width,
      elementDimensions.height,
    );
  };

  private onDragDone = (elements: CanvasElement<any>[]) => {
    if (this.selectedElement) {
      const { element, controller } = this.selectedElement;

      controller.blur();

      const updateElement = {
        ...element,
        data: {
          ...element.data,
          ...controller.getProps(),
        },
      };
      const index = elements.findIndex((el) => el.id === updateElement.id);
      const _elements = [...elements];
      if (index > -1) {
        _elements[index] = updateElement;
      }

      this.selectedElement = null;
      return _elements;
    }
    this.selectedElement = null;
    return null;
  };
}
