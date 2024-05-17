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

  // @ts-expect-error
  onClick = (params: CanvasSvgMouseParamsI, spotTypeId: number) => {
    const { x, y, elements } = params;

    const index = elements.filter((el) => el.type === 'spot').length;
    const indexType = elements.filter(
      (el) =>
        (el?.data?.spotTypeId || -1) === spotTypeId &&
        el?.data?.index <= index &&
        el.type === 'spot',
    ).length;
    const spot = this.newElement({
      x,
      y,
      index: index + 1,
      indexType: indexType + 1,
      // @ts-expect-error
      spotTypeId,
      taken: false,
      selected: false,
    });

    return [...elements, spot];
  };

  // @ts-expect-error
  onMove = (params: CanvasSvgMouseParamsI, spotTypeId: number) => {
    const { x, y } = params;

    if (!spotTypeId) {
      new SpotDOMController().select(this.draftId).setPosition(x, y);
    } else {
      new SpotDOMController().select(`spot-${spotTypeId}`).setPosition(x, y);
    }
  };

  // @ts-expect-error
  onMouseOut = (spotTypeId: number) => {
    if (!spotTypeId) {
      new SpotDOMController().select(this.draftId).setPosition(-100, -100);
    }
    new SpotDOMController()
      .select(`spot-${spotTypeId}`)
      .setPosition(-100, -100);
  };

  // @ts-expect-error
  onCancel = (spotTypeId: number) => {
    if (!spotTypeId) {
      new SpotDOMController().select(this.draftId).setPosition(-100, -100);
    }
    new SpotDOMController()
      .select(`spot-${spotTypeId}`)
      .setPosition(-100, -100);
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
