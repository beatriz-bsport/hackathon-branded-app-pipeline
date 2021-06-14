import CanvasAbstractTool, {
  CanvasElementMouseParamI,
  CanvasElement,
} from '../BaseClasses/Base.tool';
import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasControllerStrategy,
} from '../CanvasStrategy';
import { ElementDOMController } from '../BaseClasses/Base.controller';

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

  onMouseOverElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;

    if (clickedElement.type !== CANVAS_SELECTABLE_TOOLS.spot) {
      return;
    }

    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).focus();
  };

  onMouseOutElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;

    if (clickedElement.type !== CANVAS_SELECTABLE_TOOLS.spot) {
      return;
    }

    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).blur();
  };
}
