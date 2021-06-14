import CanvasAbstractTool, {
  CanvasElement,
  CanvasSvgMouseParamsI,
} from '../BaseClasses/Base.tool';

import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';
import TeacherDOMController from './CanvasTeacher.controller';
import { CanvasTeacherProps } from './CanvasTeacher.component';

export default class CanvasTeacherTool extends CanvasAbstractTool<CanvasTeacherProps> {
  type = CANVAS_SELECTABLE_TOOLS.teacher;

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

    new TeacherDOMController()
      .select(this.draftId)
      .setPosition(x, y)
      .setStroke(settings.strokeColor)
      .setFill(settings.fillColor);
  };

  onMouseOut = () => {
    new TeacherDOMController().select(this.draftId).setPosition(-100, -100);
  };

  onCancel = () => {
    new TeacherDOMController().select(this.draftId).setPosition(-100, -100);
    return true;
  };

  renderCursor: () => null = () => {
    return null;
  };

  getBoundaries = (element: CanvasElement<CanvasTeacherProps>) => {
    const minX = element.data.x;
    const minY = element.data.y;
    const maxX = minX + 40;
    const maxY = minY + 40;

    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  };
}
