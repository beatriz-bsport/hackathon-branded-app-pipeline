import { ElementDOMController } from '../BaseClasses/Base.controller';
import { CanvasRectProps } from './CanvasRect.component';

export default class RectDOMController extends ElementDOMController<CanvasRectProps> {
  oldStroke: string | null = null;

  getProps = () => {
    const x = parseInt(this.elm.getAttribute('x'));
    const y = parseInt(this.elm.getAttribute('y'));
    const width = parseInt(this.elm.getAttribute('width'));
    const height = parseInt(this.elm.getAttribute('height'));
    const stroke = this.elm.getAttribute('stroke');
    const strokeWidth = parseInt(this.elm.getAttribute('stroke-width'));
    const fill = this.elm.getAttribute('fill');
    let rotation = 0;

    const _rotation = this.elm.getAttribute('data-rotation');
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
    if (this.elm) {
      x = parseInt(this.elm.getAttribute('x'));
      y = parseInt(this.elm.getAttribute('y'));
    }
    return { x, y };
  };

  setPosition = (x: number | string, y: number | string) => {
    if (this.elm) {
      const { width, height, rotation } = this.getProps();

      const _x = typeof x === 'string' ? parseInt(x) : x;
      const _y = typeof y === 'string' ? parseInt(y) : y;

      this.elm.setAttribute('x', x.toString());
      this.elm.setAttribute('y', y.toString());
      this.elm.setAttribute(
        'transform',
        `rotate(${rotation} ${_x + width / 2} ${_y + height / 2})`,
      );
    }
    return this;
  };

  setDimension = (width: number | string, height: number | string) => {
    if (this.elm) {
      this.elm.setAttribute('width', width.toString());
      this.elm.setAttribute('height', height.toString());
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
