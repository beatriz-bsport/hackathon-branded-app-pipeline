import React from 'react';
import { CanvasSelectableToolsEnum } from '../CanvasStrategy';

export type CanvasElement<D> = {
  type: CanvasSelectableToolsEnum;
  data: D;
  id: string;
};

export type CanvasSvgMouseParamsI = {
  /**
   * The X position of the mouse relative to the svg
   */
  x: number;
  /**
   * The Y position of the mouse relative to the svg
   */
  y: number;
  /**
   * The list of the current elements
   */
  elements: CanvasElement<any>[] | null;
  /**
   * Stroke color, Fill color
   */
  settings: {
    strokeColor: string;
    fillColor: string;
  };
  /**
   * The original mouse event
   */
  mouseEvent: any;
};

export type CanvasElementMouseParamI = {
  elements: CanvasElement<any>[];
  clickedElement: CanvasElement<any>;
  mouseEvent: any;
  svgId: string;
};

/**
 * Instance of CanvasAbstractTool can subscribe to different kind of event
 * When the user interract with the svg or with an element already attached to the svg
 * the events are injected inside the Tool
 *
 * Within each event the hole state of the Canvas (JSON: a list of CanvasElement) is injected
 * The tool can read from the current state, do his thing, then return a new one
 */
export default abstract class CanvasAbstractTool<D> {
  readonly type: CanvasSelectableToolsEnum;

  get draftId() {
    return `${this.type}-draft`;
  }

  newElement: (data: D) => CanvasElement<D> = (data: D) => {
    return {
      type: this.type,
      id: `${this.type}-${Date.now()}`,
      data,
    };
  };

  /**
   * When the user press the escape key
   * @returns {boolean} indicate if the current tool should be unselected or not
   */
  onCancel?: () => boolean | void;

  /**
   * Called when the user click on the SVG
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onClick?: (params: CanvasSvgMouseParamsI) => CanvasElement<any>[] | void;

  /** Called when the user move the mouse on the SVG
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onMove?: (params: CanvasSvgMouseParamsI) => CanvasElement<any>[] | void;

  /**
   *  Called when the user move the mouse out the SVG
   */
  onMouseOut?: (params: CanvasSvgMouseParamsI) => void;

  /** Called when the user click an element (rect, spot, line...)
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onClickElement?: (
    params: CanvasElementMouseParamI,
  ) => CanvasElement<any>[] | void;

  /** Called when the user has the mouse over an element (rect, spot, line...)
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onMouseOverElement?: (
    params: CanvasElementMouseParamI,
  ) => CanvasElement<any>[] | void;

  /** Called when the mouse is out of an element (rect, spot, line...)
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onMouseOutElement?: (
    params: CanvasElementMouseParamI,
  ) => CanvasElement<any>[] | void;

  /** Called when the mouse is down on element (rect, spot, line...)
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onMouseDownElement?: (
    params: CanvasElementMouseParamI,
  ) => CanvasElement<any>[] | void;

  /** Called when the mouse is up on element (rect, spot, line...)
   * @returns {CanvasElement<any>[]}} - Return a new list of elements
   * @returns {void} - Return undefined if you dont want to make any changes
   */
  onMouseUpElement?: (
    params: CanvasElementMouseParamI,
  ) => CanvasElement<any>[] | void;

  /**
   * Return a react component to add a custom cursor near the real one
   */
  renderCursor?: () => React.ReactElement | null;

  getBoundaries?: (
    element: CanvasElement<D>,
  ) => {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}
