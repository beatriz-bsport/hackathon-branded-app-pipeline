import { ElementDOMController } from '../BaseClasses/Base.controller';
import { CanvasRectProps } from './CanvasRect.component';

export default class RectDOMController extends ElementDOMController<CanvasRectProps> {
  oldStroke: string | null = null;

  compatibleWithResize = true;
  /* The Rect on the map serves two purposes: it can either display a simple rectangle or function as an image container. 
  The use of `this.elm.classList.contains('unbound-asset-group')` is the only method I've identified to accurately determine the type of Rect we're working with. 
  Based on this, the properties that need to be updated vary. For more details, refer to the Rect DOM structure in CanvasRect.component.tsx. */

  getProps = () => {
    let targettedElm = this.elm;
    if (this.elm.classList.contains('unbound-asset-group')) {
      targettedElm = this.elm.children[0];
    }
    const x = parseInt(targettedElm.getAttribute('x'));
    const y = parseInt(targettedElm.getAttribute('y'));
    const width = parseInt(targettedElm.getAttribute('width'));
    const height = parseInt(targettedElm.getAttribute('height'));
    const stroke = targettedElm.getAttribute('stroke');
    const strokeWidth = '2';
    const fill = targettedElm.getAttribute('fill');
    let rotation = 0;

    const _rotation = targettedElm.getAttribute('data-rotation');
    if (_rotation) {
      rotation = parseInt(_rotation);
    }

    return {
      x,
      y,
      width,
      height,
      stroke,
      strokeWidth,
      fill,
      rotation,
    };
  };

  getPosition = () => {
    let x = 0;
    let y = 0;
    let targettedElm = this.elm;
    // For Rect use to contain an image we must
    if (this.elm.classList.contains('unbound-asset-group')) {
      targettedElm = this.elm.children[0];
    }
    if (this.elm) {
      x = parseInt(targettedElm.getAttribute('x'));
      y = parseInt(targettedElm.getAttribute('y'));
    }

    return { x, y };
  };

  setPosition = (x: number | string, y: number | string) => {
    if (this.elm) {
      let targettedElm = this.elm;
      if (this.elm.classList.contains('unbound-asset-group')) {
        targettedElm = this.elm.children[0];
      }
      if (targettedElm) {
        const { width, height, rotation } = this.getProps();

        const _x = typeof x === 'string' ? parseInt(x) : x;
        const _y = typeof y === 'string' ? parseInt(y) : y;

        targettedElm.setAttribute('x', x.toString());
        targettedElm.setAttribute('y', y.toString());
        targettedElm.setAttribute(
          'transform',
          `rotate(${rotation} ${_x + width / 2} ${_y + height / 2})`,
        );
      }
    }
    return this;
  };

  getDimensions = () => {
    let height = 0;
    let width = 0;
    let targettedElm = this.elm;
    if (this.elm.classList.contains('unbound-asset-group')) {
      targettedElm = this.elm.children[0];
    }
    if (this.elm) {
      height = parseInt(targettedElm.getAttribute('height'));
      width = parseInt(targettedElm.getAttribute('width'));
    }

    return { height, width };
  };

  setDimension = (width: number | string, height: number | string) => {
    let targettedElm = this.elm;

    if (targettedElm) {
      if (targettedElm.classList.contains('unbound-asset-group')) {
        targettedElm = this.elm.children[0];
      }
      targettedElm.setAttribute('width', width.toString());
      targettedElm.setAttribute('height', height.toString());
    }
    return this;
  };

  focus = () => {
    if (this.elm) {
      this.oldStroke = this.elm.getAttribute('stroke');
      this.elm.setAttribute('stroke', 'red');
    }
  };

  blur = () => {
    if (this.elm && this.oldStroke) {
      this.elm.setAttribute('stroke', this.oldStroke);
      this.oldStroke = null;
    }
  };

  setStroke = (stroke?: string) => {
    if (this.elm) {
      this.elm.setAttribute('stroke', stroke || 'transparent');
    }
    return this;
  };

  setFill = (fill?: string) => {
    if (this.elm) {
      this.elm.setAttribute('fill', fill || 'transparent');
    }
    return this;
  };
}
