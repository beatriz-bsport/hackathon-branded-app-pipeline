import {
  CanvasSelectableToolsEnum,
  CANVAS_SELECTABLE_TOOLS,
} from '../CanvasStrategy';

export const useBeautifierField = (type: CanvasSelectableToolsEnum) => {
  return {
    displayFill: type === CANVAS_SELECTABLE_TOOLS.line,
    displayHeight: [].includes(type),
    displayRotation: type === CANVAS_SELECTABLE_TOOLS.door,
    displayStroke:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line,
    displayStrokeLineCap:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line,
    displayStrokeWidth:
      type === CANVAS_SELECTABLE_TOOLS.door ||
      type === CANVAS_SELECTABLE_TOOLS.line,
    displayWidth: [].includes(type),
    displayX: type === CANVAS_SELECTABLE_TOOLS.door,
    displayY: type === CANVAS_SELECTABLE_TOOLS.door,
  };
};

export default useBeautifierField;
