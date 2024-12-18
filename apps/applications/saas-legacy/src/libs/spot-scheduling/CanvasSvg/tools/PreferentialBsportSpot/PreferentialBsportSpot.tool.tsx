import React from 'react';
import StarIcon from '@material-ui/icons/Star';

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

export default class PreferentialBsportSpotTool extends CanvasAbstractTool<null> {
  type = CANVAS_SELECTABLE_TOOLS.preferential_bsport_spot_tool;

  selectedElement: SelectedElement = null;

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { mouseEvent } = params;
    if (mouseEvent.target.nodeName.toLowerCase() === 'svg') {
      this.selectedElement = null;
    }
  };

  onClickElement = (params: CanvasElementMouseParamI) => {
    const { elements, clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).focus();
    return elements;
  };

  onCancel = () => {
    if (this.selectedElement) {
      // @ts-expect-error
      this.selectedElement.controller.setDimension(
        this.selectedElement.elementDownW,
        this.selectedElement.elementDownH,
      );
    }
  };

  onMouseOutElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).blur();
  };

  onMouseOverElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).focus();
  };

  renderCursor = () => {
    return <StarIcon />;
  };
}
