import React from 'react';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';
import { CanvasElement } from '../BaseClasses/Base.tool';
import type { SpotType } from '#libs/spot-scheduling/types';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';
import { PERSONALIZED_CUSTOMIZATION } from '#libs/spot-scheduling/component/SpotCreator/CanvasSpotCreatorForm.component';

export const useBeautifierField = (
  CanvasEl: CanvasElement<any>,
  spotTypes: SpotType[],
) => {
  const canvasElementType = CanvasEl?.type;

  const spotType = React.useMemo(() => {
    return (
      (spotTypes ?? []).filter(
        (_spotType) =>
          _spotType.id === (CanvasEl?.data?.spotTypeId || DEFAULT_SPOT_TYPE_ID),
      )[0] || null
    );
  }, [spotTypes, CanvasEl]);

  const isCustomStop = spotType?.customization === PERSONALIZED_CUSTOMIZATION;

  const spotShape = React.useMemo(() => {
    switch (spotType?.shape) {
      case 'square':
        return 'square';
      case 'rectangle':
        return 'rectangle';
      case 'triangle':
        return 'triangle';
      default:
        return 'circular';
    }
  }, [spotType]);

  const isDefaultCircularSpot =
    canvasElementType === CANVAS_SELECTABLE_TOOLS.spot &&
    !isCustomStop &&
    spotShape === 'circular';

  const isDefaultSquareSpot =
    canvasElementType === CANVAS_SELECTABLE_TOOLS.spot &&
    !isCustomStop &&
    spotShape === 'square';

  const isDefaultReactangleSpot =
    canvasElementType === CANVAS_SELECTABLE_TOOLS.spot &&
    !isCustomStop &&
    spotShape === 'rectangle';

  const isDefaultTriangleSpot =
    canvasElementType === CANVAS_SELECTABLE_TOOLS.spot &&
    !isCustomStop &&
    spotShape === 'triangle';

  return {
    displayFill:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayHeight:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayRotation:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayStroke:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayStrokeLineCap:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen,
    displayStrokeWidth:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayWidth:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      isDefaultReactangleSpot ||
      isCustomStop,
    displayX:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayY:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayImageLink:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect || isCustomStop,
    displayFontSize:
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayFontColor:
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayFontWeight:
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayTextOffsetX:
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayTextOffsetY:
      isDefaultCircularSpot ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayStrokeDasharray:
      isDefaultCircularSpot ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      isDefaultSquareSpot ||
      isDefaultReactangleSpot ||
      isDefaultTriangleSpot ||
      isCustomStop,
    displayTextStroke: isCustomStop,
    displayTextStrokeWidth: isCustomStop,
    displayFontStyle: isCustomStop,
  };
};

export default useBeautifierField;
