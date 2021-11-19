import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import CreateIcon from '@material-ui/icons/Create';

import CanvasAbstractTool, {
  CanvasElement,
  CanvasSvgMouseParamsI,
} from '../BaseClasses/Base.tool';
import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';
import { CanvasLineProps } from './CanvasLine.component';
import LineDOMController from './CanvasLine.controller';

type Draft = {
  id: string;
  lastX: number;
  lastY: number;
};

export default class CanvasLineTool extends CanvasAbstractTool<CanvasLineProps> {
  type = CANVAS_SELECTABLE_TOOLS.line;

  draft: Draft | null = null;

  onClick = (params: CanvasSvgMouseParamsI) => {
    const { x, y, elements, settings } = params;

    if (this.draft) {
      const _elements = [...elements];
      let index = _elements.findIndex((el) => el.id === this.draft.id);

      let current: CanvasElement<CanvasLineProps>;

      if (index > -1) {
        current = cloneDeep(_elements[index]);
      } else {
        index = _elements.length;

        current = {
          type: this.type,
          id: this.draft.id,
          data: {
            points: [[this.draft.lastX, this.draft.lastY]],
            stroke: settings.strokeColor,
            fill: settings.fillColor,
          },
        };
      }

      current.data.points.push([x, y]);
      this.draft.lastX = x;
      this.draft.lastY = y;

      _elements[index] = current;
      return _elements;
    }

    if (!this.draft) {
      this.draft = {
        id: `${this.type}-${Date.now()}`,
        lastX: x,
        lastY: y,
      };
    }

    return undefined;
  };

  onMove = (params: CanvasSvgMouseParamsI) => {
    const { x, y, settings } = params;

    if (this.draft) {
      const { fillColor, strokeColor } = settings;

      const points = [];
      points.push([this.draft.lastX, this.draft.lastY]);
      points.push([x, y]);

      new LineDOMController()
        .select(this.draftId)
        .setPoints(points)
        .setFill(fillColor)
        .setStroke(strokeColor);
    }
  };

  onMouseOut = () => {
    new LineDOMController().select(this.draftId).setPoints([]);
  };

  onCancel = () => {
    if (this.draft) {
      new LineDOMController().select(this.draftId).setPoints([]);
      this.draft = null;
      return false;
    }
    return true;
  };

  renderCursor = () => {
    return <CreateIcon />;
  };
}
