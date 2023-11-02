import {
  CanvasSelectableToolsEnum,
  CANVAS_SELECTABLE_TOOLS,
} from '../CanvasStrategy';

export const useBeautifierField = (type: CanvasSelectableToolsEnum) => {
  return {
    displayFill:
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.rect,
    displayHeight: type === CANVAS_SELECTABLE_TOOLS.rect,
    displayRotation:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.rect,
    displayStroke:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.rect,
    displayStrokeLineCap:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line,
    displayStrokeWidth:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.rect,
    displayWidth: type === CANVAS_SELECTABLE_TOOLS.rect,
    displayX:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.rect,
    displayY:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.rect,
    displayImageLink: type === CANVAS_SELECTABLE_TOOLS.rect,
  };
};

export default useBeautifierField;
