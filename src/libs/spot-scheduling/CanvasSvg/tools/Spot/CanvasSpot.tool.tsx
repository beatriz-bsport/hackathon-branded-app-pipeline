import CanvasAbstractTool, {
  CanvasElement,
  CanvasSvgMouseParamsI,
} from '../BaseClasses/Base.tool';

import SpotDOMController from './CanvasSpot.controller';
import { CanvasSpotProps } from './CanvasSpot.component';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';

export default class CanvasSpotTool extends CanvasAbstractTool<CanvasSpotProps> {
  type = CANVAS_SELECTABLE_TOOLS.spot;

  hideNativeCursor = true;

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { x, y, elements } = params;

    const index = elements.filter((el) => el.type === this.type).length;

    const spot = this.newElement({
      x,
      y,
      index: index + 1,
      asset_identifier: 'spot_free',
      selected: false,
    });

    return [...elements, spot];
  };

  onMove = (params: CanvasSvgMouseParamsI) => {
    const { x, y } = params;
    new SpotDOMController().select(this.draftId).setPosition(x, y);
  };

  onMouseOut = () => {
    new SpotDOMController().select(this.draftId).setPosition(-100, -100);
  };

  onCancel = () => {
    new SpotDOMController().select(this.draftId).setPosition(-100, -100);
    return true;
  };

  renderCursor: () => null = () => {
    return null;
  };

  getBoundaries = (element: CanvasElement<CanvasSpotProps>) => {
    const minX = element.data.x;
    const minY = element.data.y;
    const maxX = minX + 60;
    const maxY = minY + 60;

    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  };
}
