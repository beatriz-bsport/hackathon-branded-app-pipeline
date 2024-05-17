import { ElementDOMController } from '../BaseClasses/Base.controller';
import CanvasSpotComponent, { CanvasSpotProps } from './CanvasSpot.component';

export default class SpotDOMController extends ElementDOMController<CanvasSpotProps> {
  // @ts-expect-error
  getProps = () => {
    let x = 0;
    let y = 0;

    const position = this.getPosition();

    if (position && position.x && position.y) {
      x = position.x;
      y = position.y;
    }

    const rotation = this.getRotation();

    return {
      x,
      y,
      rotation,
    };
  };

  getRotation = () => {
    let rotation = 0;
    if (this.elm) {
      const transform = this.elm.getAttribute('transform');
      const str = transform
        .replace(/translate\(.*\) rotate\(/, '')
        .replace(/\).*/, '');
      const data = str.split(' ');
      rotation = parseInt(data[0]);
    }
    return rotation;
  };

  getPosition = () => {
    let x = 0;
    let y = 0;
    if (this.elm) {
      const transform = this.elm.getAttribute('transform');
      const str = transform.replace('translate(', '').replace(/\).*/, '');
      const arr = str.split(' ');
      x = parseInt(arr[0]);
      y = parseInt(arr[1]);
    }
    return { x, y };
  };

  setPosition = (x: number, y: number) => {
    if (this.elm) {
      const rotation = this.getRotation();
      // @ts-expect-error
      let transform = CanvasSpotComponent.getTransform(x, y, rotation);
      switch (this.elm.getAttribute('type')) {
        case 'rectangle':
          // @ts-expect-error
          transform = CanvasSpotComponent.getTransformRectangle(x, y, rotation);
          break;
        case 'triangle':
          // @ts-expect-error
          transform = CanvasSpotComponent.getTransformTriangle(x, y, rotation);
          break;
        default:
          break;
      }
      this.elm.setAttribute('transform', transform);
    }
    return this;
  };

  focus = () => {
    if (this.elm) {
      const outline = this.elm.children[3];
      if (outline?.getAttribute('stroke'))
        outline.setAttribute('stroke', 'red');
    }
  };

  blur = () => {
    if (this.elm) {
      const outline = this.elm.children[3];
      if (outline?.getAttribute('stroke'))
        outline.setAttribute('stroke', 'transparent');
    }
  };
}
