import {
  CanvasSelectableToolsEnum,
  CANVAS_SELECTABLE_TOOLS,
} from '../CanvasStrategy';

export const useBeautifierField = (type: CanvasSelectableToolsEnum) => {
  return {
    displayFill:
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.rect ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayHeight: type === CANVAS_SELECTABLE_TOOLS.rect,
    displayRotation:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.rect ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayStroke:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.rect ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayStrokeLineCap:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayStrokeWidth:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line ||
      type === CANVAS_SELECTABLE_TOOLS.rect ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayWidth: type === CANVAS_SELECTABLE_TOOLS.rect,
    displayX:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.rect ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayY:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.rect ||
      type === CANVAS_SELECTABLE_TOOLS.screen,
    displayImageLink: type === CANVAS_SELECTABLE_TOOLS.rect,
  };
};

export default useBeautifierField;
