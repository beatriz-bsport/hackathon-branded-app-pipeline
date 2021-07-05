import CanvasAbstractTool, {
  CanvasSvgMouseParamsI,
} from '../BaseClasses/Base.tool';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';

import { CanvasDoorProps } from './CanvasDoor.component';
import DoorDOMController from './CanvasDoor.controller';

export default class CanvasDoorTool extends CanvasAbstractTool<CanvasDoorProps> {
  type = CANVAS_SELECTABLE_TOOLS.door;

  hideNativeCursor = true;

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { x, y, elements, settings } = params;
    const { fillColor, strokeColor } = settings;

    const teacher = this.newElement({
      x,
      y,
      rotation: 0,
      fill: fillColor,
      stroke: strokeColor,
    });

    return [...elements, teacher];
  };

  onMove = (params: CanvasSvgMouseParamsI) => {
    const { x, y, settings } = params;

    new DoorDOMController()
      .select(this.draftId)
      .setPosition(x, y)
      .setStroke(settings.strokeColor)
      .setFill(settings.fillColor);
  };

  onMouseOut = () => {
    new DoorDOMController().select(this.draftId).setPosition(-100, -100);
  };

  onCancel = () => {
    new DoorDOMController().select(this.draftId).setPosition(-100, -100);
    return true;
  };

  renderCursor: () => null = () => {
    return null;
  };
}
