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

  return {
    displayFill:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot,
    displayHeight:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      isDefaultCircularSpot,
    displayRotation:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot,
    displayStroke:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot,
    displayStrokeLineCap:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen,
    displayStrokeWidth:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot,
    displayWidth: canvasElementType === CANVAS_SELECTABLE_TOOLS.rect,
    displayX:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot,
    displayY:
      canvasElementType === CANVAS_SELECTABLE_TOOLS.door ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.screen ||
      isDefaultCircularSpot,
    displayImageLink: canvasElementType === CANVAS_SELECTABLE_TOOLS.rect,
    displayFontSize: isDefaultCircularSpot,
    displayFontColor: isDefaultCircularSpot,
    displayFontWeight: isDefaultCircularSpot,
    displayTextOffsetX: isDefaultCircularSpot,
    displayTextOffsetY: isDefaultCircularSpot,
    displayStrokeDasharray:
      isDefaultCircularSpot ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.line ||
      canvasElementType === CANVAS_SELECTABLE_TOOLS.rect,
  };
};

export default useBeautifierField;
