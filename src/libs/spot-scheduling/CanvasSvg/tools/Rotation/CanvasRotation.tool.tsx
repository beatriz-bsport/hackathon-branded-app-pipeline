import React from 'react';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import CanvasAbstractTool, {
  CanvasElementMouseParamI,
} from '../BaseClasses/Base.tool';

import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasControllerStrategy,
} from '../CanvasStrategy';

export default class CanvasRotationTool extends CanvasAbstractTool<any> {
  type = CANVAS_SELECTABLE_TOOLS.rotation;

  onClickElement = (params: CanvasElementMouseParamI) => {
    const { elements, clickedElement } = params;

    const _elements = [...elements];
    const i = _elements.findIndex((el) => el.id === clickedElement.id);

    const controller = CanvasControllerStrategy[clickedElement.type];
    controller.select(clickedElement.id);

    if (controller.getProps().rotation !== undefined) {
      const oldRotation = clickedElement.data.rotation || 0;

      const newElement = {
        ...clickedElement,
        data: {
          ...clickedElement.data,
          rotation: oldRotation + 45,
        },
      };

      _elements[i] = newElement;
      return _elements;
    }

    return undefined;
  };

  onMouseOverElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller.select(clickedElement.id);
    if (controller.getProps().rotation !== undefined) {
      controller && controller.select(clickedElement.id).focus();
    }
  };

  onMouseOutElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller.select(clickedElement.id);
    if (controller.getProps().rotation !== undefined) {
      controller && controller.select(clickedElement.id).blur();
    }
  };

  renderCursor = () => {
    return <AutorenewIcon />;
  };
}
