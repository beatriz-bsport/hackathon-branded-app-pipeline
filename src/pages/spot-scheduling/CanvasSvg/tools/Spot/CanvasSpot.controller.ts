import { ElementDOMController } from '../BaseClasses/Base.controller';
import CanvasSpotComponent, { CanvasSpotProps } from './CanvasSpot.component';

export default class SpotDOMController extends ElementDOMController<CanvasSpotProps> {
  getProps = () => {
    let x = 0;
    let y = 0;
    let index = 1;

    const position = this.getPosition();

    if (position && position.x && position.y) {
      x = position.x;
      y = position.y;
    }

    const rotation = this.getRotation();

    if (this.elm && this.elm.children[2]) {
      const text = this.elm.children[2];
      const content = text.textContent.trim();
      index = parseInt(content);
    }

    return {
      x,
      y,
      rotation,
      index,
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
      const transform = CanvasSpotComponent.getTransform(x, y, rotation);
      this.elm.setAttribute('transform', transform);
    }
    return this;
  };

  focus = () => {
    if (this.elm) {
      const outline = this.elm.children[3];
      outline.setAttribute('stroke', 'red');
    }
  };

  blur = () => {
    if (this.elm) {
      const outline = this.elm.children[3];
      outline.setAttribute('stroke', 'transparent');
    }
  };
}
