import React from 'react';

import CanvasAbstractTool from '../BaseClasses/Base.tool';

import { CANVAS_SELECTABLE_TOOLS } from '../CanvasStrategy';
import HandIcon from './Hand.icon';

export default class CanvasHandTools extends CanvasAbstractTool<null> {
  type = CANVAS_SELECTABLE_TOOLS.hand;

  renderCursor = () => {
    return <HandIcon />;
  };
}
