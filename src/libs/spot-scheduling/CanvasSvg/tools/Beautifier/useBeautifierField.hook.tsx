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

  return {
    displayFill:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot,
    displayHeight:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot,
    displayRotation:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot,
    displayStroke:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot,
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
      isDefaultSquareSpot,
    displayWidth: canvasElementType === CANVAS_SELECTABLE_TOOLS.rect,
    displayX:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot,
    displayY:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot ||
      isDefaultSquareSpot,
    displayImageLink: canvasElementType === CANVAS_SELECTABLE_TOOLS.rect,
    displayFontSize: isDefaultCircularSpot || isDefaultSquareSpot,
    displayFontColor: isDefaultCircularSpot || isDefaultSquareSpot,
    displayFontWeight: isDefaultCircularSpot || isDefaultSquareSpot,
    displayTextOffsetX: isDefaultCircularSpot || isDefaultSquareSpot,
    displayTextOffsetY: isDefaultCircularSpot || isDefaultSquareSpot,
    displayStrokeDasharray:
      isDefaultCircularSpot ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      isDefaultSquareSpot,
  };
};

export default useBeautifierField;
