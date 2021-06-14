import React from 'react';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import CanvasAbstractTool, {
  CanvasElement,
  CanvasSvgMouseParamsI,
} from '../BaseClasses/Base.tool';

import CanvasRectComponent, { CanvasRectProps } from './CanvasRect.component';
import RectDOMController from './CanvasRect.controller';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';

type Draft = {
  x: number;
  y: number;
};

export default class CanvasRectTool extends CanvasAbstractTool<CanvasRectProps> {
  type = CANVAS_SELECTABLE_TOOLS.rect;

  ComponentClass: CanvasRectComponent;

  draft: Draft | null = null;

  getData = (x: number, y: number) => {
    const data = {
      x: this.draft.x,
      y: this.draft.y,
      width: 0,
      height: 0,
    };

    if (x >= this.draft.x) {
      data.width = x - this.draft.x;
    }
    if (y >= this.draft.y) {
      data.height = y - this.draft.y;
    }
    if (x < this.draft.x) {
      data.width = this.draft.x - x;
      data.x = x;
    }
    if (y < this.draft.y) {
      data.height = this.draft.y - y;
      data.y = y;
    }

    return data;
  };

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { x, y, settings, elements } = params;

    if (!this.draft) {
      this.draft = {
        x,
        y,
      };
    } else {
      const data = this.getData(x, y);
      const rectElement = this.newElement({
        ...data,
        fill: settings.fillColor,
        stroke: settings.strokeColor,
      });

      this.draft = null;
      this.hideDraft();
      return [...elements, rectElement];
    }

    return undefined;
  };

  onMove = (params: CanvasSvgMouseParamsI) => {
    const { x, y, settings } = params;
    if (this.draft) {
      const data = this.getData(x, y);

      new RectDOMController()
        .select(this.draftId)
        .setPosition(data.x, data.y)
        .setDimension(data.width, data.height)
        .setStroke(settings.strokeColor)
        .setFill(settings.fillColor);
    }
  };

  onCancel = () => {
    this.hideDraft();

    if (this.draft) {
      this.draft = null;
      return false;
    }
    return true;
  };

  onMouseOut = () => {
    this.hideDraft();
  };

  private hideDraft = () => {
    new RectDOMController()
      .select(this.draftId)
      .setPosition(0, 0)
      .setDimension(0, 0);
  };

  renderCursor = () => {
    return <CheckBoxOutlineBlankIcon />;
  };

  getBoundaries = (element: CanvasElement<CanvasRectProps>) => {
    const minX = element.data.x;
    const minY = element.data.y;
    const maxX = minX + element.data.width;
    const maxY = minY + element.data.height;

    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  };
}
