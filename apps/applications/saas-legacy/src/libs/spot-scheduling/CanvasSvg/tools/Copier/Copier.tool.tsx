import React from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
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
import { LENGTH_REFERENCE } from '../Spot/CanvasSpot.component';
import { COACH_CANVAS_AVATAR_DEFAULT_SIZE } from '../Teacher/CanvasTeacher.component';

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
/**
 * @description This function calculates and retrieves the dimensions of an element.
 *              For certain element types, height and width can be customized.
 *              If not specified, default values are used.
 */
// @ts-expect-error
const getDeltaDimensions = (element) => {
  if (element.type === CANVAS_SELECTABLE_TOOLS.rect) {
    return {
      height: element?.data?.height || 50,
      width: element?.data?.width || 50,
    };
  }
  if (element.type === CANVAS_SELECTABLE_TOOLS.spot) {
    const height = element?.data?.height || LENGTH_REFERENCE;
    const width = element?.data?.width || LENGTH_REFERENCE;

    return { height, width };
  }
  if (element.type === CANVAS_SELECTABLE_TOOLS.teacher) {
    // Note: This does not take into account the coachHeight multiplicator.
    const height = element?.data?.height || COACH_CANVAS_AVATAR_DEFAULT_SIZE;
    const width = element?.data?.width || COACH_CANVAS_AVATAR_DEFAULT_SIZE;

    return { height, width };
  }

  return { height: 100, width: 100 };
};

/**
 * @description This function adjusts the position of an element within the canvas.
 *              It takes into consideration the element's dimensions and the canvas size.
 *              If the adjusted position would exceed the canvas bounds, it adjusts accordingly.
 */
// @ts-expect-error
const adjustPosition = (element) => {
  const { height, width } = getDeltaDimensions(element);

  const maxPositionX = SVG_WORK_SIZE - width; // To ensure it stays within bounds of the canvas.
  const maxPositionY = SVG_WORK_SIZE - height;

  const x = element.data.x;
  const y = element.data.y;

  const adjustedX = x + width > maxPositionX ? x - width : x + width;
  const adjustedY = y + height > maxPositionY ? y - height : y + height;

  return { x: adjustedX, y: adjustedY };
};
export default class CanvasCopierTool extends CanvasAbstractTool<null> {
  type = CANVAS_SELECTABLE_TOOLS.copier;

  selectedElement: SelectedElement = null;

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { mouseEvent } = params;
    if (mouseEvent.target.nodeName.toLowerCase() === 'svg') {
      this.selectedElement = null;
    }
  };

  /**
   * @description This function handles the click event on an element, duplicating it.
   *              Special consideration is given to indexes, especially for spots, similar to the Canvas Eraser Tool.
   */
  onClickElement = (params: CanvasElementMouseParamI) => {
    const { elements, clickedElement } = params;
    const controller = CanvasControllerStrategy[clickedElement.type];
    controller && controller.select(clickedElement.id).focus();

    // This variable represents the position of the clicked element in the list.
    const clickedElementPositionIndex = elements.findIndex(
      (el) => el.id === clickedElement.id,
    );
    const positionIndexFound = clickedElementPositionIndex > -1;

    if (!positionIndexFound) {
      // In this case, for security reasons, we simply return the existing elements as they are.
      return elements;
    }

    // This variable represents the max index of all spots (custom or not).
    const maxIndex = elements.filter((el) => el.type === 'spot').length;

    // This variable represents the index of the spot within spots of the same type (represented by spot with the same spotTypeId)
    const maxIndexType = elements.filter(
      (el) =>
        (el?.data?.spotTypeId || -1) === clickedElement.data.spotTypeId &&
        el?.data?.index <= maxIndex &&
        el.type === 'spot',
    ).length;

    const elementToBeAdded: CanvasElement<any> = {
      ...clickedElement,
      id: `${clickedElement.type}-${Date.now()}`,
      data: {
        ...clickedElement.data,
        ...adjustPosition(clickedElement),
        index: maxIndex + 1,
        indexType: maxIndexType + 1,
        // This is used solely to keep track of the copy history.
        copyFrom: clickedElement.id,
      },
    };

    return [...elements, elementToBeAdded];
  };

  onCancel = () => {};

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
    return <FileCopyIcon />;
  };
}
