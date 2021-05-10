import { ElementDOMController } from '../BaseClasses/Base.controller';
import CanvasTeacherComponent, {
  CanvasTeacherProps,
} from './CanvasTeacher.component';

export default class TeacherDOMController extends ElementDOMController<CanvasTeacherProps> {
  getProps = () => {
    const { x, y } = this.getPosition();
    const rotation = this.getRotation();

    let fill = '#757575';
    let stroke = 'transparent';

    const teacher = this.elm.children[0];
    if (teacher) {
      fill = teacher.getAttribute('fill');
      stroke = teacher.getAttribute('stroke');
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
      const transform = CanvasTeacherComponent.getTransform(x, y, rotation);
      this.elm.setAttribute('transform', transform);
    }
    return this;
  };

  focus = () => {
    if (this.elm) {
      const outline = this.elm.children[1];
      outline.setAttribute('stroke', 'red');
    }
  };

  blur = () => {
    if (this.elm) {
      const outline = this.elm.children[1];
      outline.setAttribute('stroke', 'transparent');
    }
  };

  setStroke = (stroke?: string) => {
    if (this.elm && stroke) {
      const teacher = this.elm.children[0];
      teacher.setAttribute('stroke', stroke);
    }
    return this;
  };

  setFill = (fill?: string) => {
    if (this.elm && fill) {
      const teacher = this.elm.children[0];
      teacher.setAttribute('fill', fill);
    }
    return this;
  };
}
