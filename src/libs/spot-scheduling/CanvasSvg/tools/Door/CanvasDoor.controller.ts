import { ElementDOMController } from '../BaseClasses/Base.controller';
import CanvasDoorComponent, { CanvasDoorProps } from './CanvasDoor.component';

export default class DoorDOMController extends ElementDOMController<CanvasDoorProps> {
  getProps = () => {
    const { x, y } = this.getPosition();
    const rotation = this.getRotation();

    let fill = '#757575';
    let stroke = 'transparent';

    const door = this.elm.children[0];
    if (door) {
      fill = door.getAttribute('fill');
      stroke = door.getAttribute('stroke');
    }

    return {
      x,
      y,
      rotation,
      fill,
      stroke,
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
      const transform = CanvasDoorComponent.getTransform(x, y, rotation);
      this.elm.setAttribute('transform', transform);
    }
    return this;
  };

  focus = () => {
    if (this.elm) {
      const outline = this.elm.children[2];
      outline.setAttribute('stroke', 'red');
    }
  };

  blur = () => {
    if (this.elm) {
      const outline = this.elm.children[2];
      outline.setAttribute('stroke', 'transparent');
    }
  };

  setStroke = (stroke?: string) => {
    if (this.elm && stroke) {
      const door = this.elm.children[0];
      door.setAttribute('stroke', stroke);
    }
    return this;
  };

  setFill = (fill?: string) => {
    if (this.elm && fill) {
      const door = this.elm.children[0];
      door.setAttribute('fill', fill);
    }
    return this;
  };
}
