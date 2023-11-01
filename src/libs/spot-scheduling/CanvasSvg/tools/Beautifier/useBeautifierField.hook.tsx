import {
  CanvasSelectableToolsEnum,
  CANVAS_SELECTABLE_TOOLS,
} from '../CanvasStrategy';

export const useBeautifierField = (type: CanvasSelectableToolsEnum) => {
  return {
    displayFill: [].includes(type),
    displayHeight: [].includes(type),
    displayRotation: type === CANVAS_SELECTABLE_TOOLS.door,
    displayStroke: type === CANVAS_SELECTABLE_TOOLS.door,
    displayStrokeLineCap: type === CANVAS_SELECTABLE_TOOLS.door,
    displayStrokeWidth: type === CANVAS_SELECTABLE_TOOLS.door,
    displayWidth: [].includes(type),
    displayX: type === CANVAS_SELECTABLE_TOOLS.door,
    displayY: type === CANVAS_SELECTABLE_TOOLS.door,
  };
};

export default useBeautifierField;
