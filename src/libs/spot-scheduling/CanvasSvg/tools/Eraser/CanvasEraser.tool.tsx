import React from 'react';

import CanvasAbstractTool, {
  CanvasElement,
  CanvasElementMouseParamI,
} from '../BaseClasses/Base.tool';

import EraserIcon from './Eraser.icon';
import {
  CANVAS_SELECTABLE_TOOLS,
  CanvasControllerStrategy,
} from '../CanvasStrategy';

export default class CanvasEraserTool extends CanvasAbstractTool<any> {
  type = CANVAS_SELECTABLE_TOOLS.eraser;

  oldStrokeColor: string | null = null;

  onClickElement = (params: CanvasElementMouseParamI) => {
    const { elements, clickedElement } = params;

    const _elements = [...elements];

    const i = _elements.findIndex((el) => el.id === clickedElement.id);

    let secondHalf: CanvasElement<any>[] = [];
    if (i > -1) {
      secondHalf = _elements.splice(i, _elements.length - i);
      const deleted = secondHalf.shift();

      if (deleted.type === CANVAS_SELECTABLE_TOOLS.spot) {
        secondHalf = secondHalf.map((el) => {
          return {
            ...el,
            data: {
              ...el.data,
              index: el.data.index - 1,
            },
          };
        });
      }
    }

    return [..._elements, ...secondHalf];
  };

  onMouseOverElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).focus();
  };

  onMouseOutElement = (params: CanvasElementMouseParamI) => {
    const { clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).blur();
  };

  renderCursor = () => {
    return <EraserIcon />;
  };
}
