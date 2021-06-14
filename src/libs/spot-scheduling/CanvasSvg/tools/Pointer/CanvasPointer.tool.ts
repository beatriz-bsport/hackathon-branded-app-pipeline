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
};

export default class CanvasPointerTool extends CanvasAbstractTool<null> {
  type = CANVAS_SELECTABLE_TOOLS.pointer;

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
        this.selectedElement.controller.setPosition(
          this.selectedElement.elementDownX,
          this.selectedElement.elementDownY,
        );
        return undefined;
      }
      if (y < 0 || y > SVG_WORK_SIZE) {
        this.selectedElement.controller.setPosition(
          this.selectedElement.elementDownX,
          this.selectedElement.elementDownY,
        );
        return undefined;
      }
    }

    this.moveElement(x, y);
    return undefined;
  };

  onMouseOut = () => {
    if (this.selectedElement && this.selectedElement.controller) {
      this.selectedElement.controller.blur();

      this.selectedElement.controller.setPosition(
        this.selectedElement.elementDownX,
        this.selectedElement.elementDownY,
      );

      this.selectedElement = null;
    }
  };

  onCancel = () => {
    if (this.selectedElement) {
      this.selectedElement.controller.setPosition(
        this.selectedElement.elementDownX,
        this.selectedElement.elementDownY,
      );
    }
  };

  onMouseDownElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement, mouseEvent, svgId } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    const { x, y } = this.getMousePosition(svgId, mouseEvent);
    const position = controller.select(clickedElement.id).getPosition();

    this.selectedElement = {
      downX: x,
      downY: y,
      elementDownX: position.x,
      elementDownY: position.y,
      controller,
      element: clickedElement,
    };
  };

  onMouseUpElement = (params: CanvasElementMouseParamI) => {
    const { elements, svgId, mouseEvent } = params;

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
    controller && controller.select(clickedElement.id).blur();
  };

  private getMousePosition = (svgId: string, evt: any) => {
    const svg = document.getElementById(svgId);
    // @ts-ignore
    const CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  };

  private moveElement = (x: number, y: number) => {
    if (!this.selectedElement) {
      return;
    }

    const vector = {
      x: x - this.selectedElement.downX,
      y: y - this.selectedElement.downY,
    };

    const elementPosition = {
      x: this.selectedElement.elementDownX + vector.x,
      y: this.selectedElement.elementDownY + vector.y,
    };

    this.selectedElement.controller.setPosition(
      elementPosition.x,
      elementPosition.y,
    );
  };

  private onDragDone = (elements: CanvasElement<any>[]) => {
    if (this.selectedElement) {
      const { element, controller } = this.selectedElement;

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
