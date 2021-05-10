import { ElementDOMController } from '../BaseClasses/Base.controller';
import { CanvasLineProps } from './CanvasLine.component';

export default class LineDOMController extends ElementDOMController<CanvasLineProps> {
  private oldStroke: string | null = null;

  getProps = () => {
    const points: number[][] = [];
    let stroke = 'black';
    let fill = 'transparent';
    let strokeWidth = '3';

    if (this.elm) {
      const pointsStr = this.elm.getAttribute('points');
      const pointsArr = pointsStr.split(' ').filter((s) => !!s);
      for (let i = 0; i < pointsArr.length; i += 1) {
        const [x, y] = pointsArr[i].split(',');
        points.push([parseInt(x), parseInt(y)]);
      }

      stroke = this.elm.getAttribute('stroke');
      strokeWidth = this.elm.getAttribute('stroke-width');
      fill = this.elm.getAttribute('fill');
    }

    return {
      points,
      stroke,
      strokeWidth,
      fill,
    };
  };

  getPosition = () => {
    let x = 0;
    let y = 0;
    if (this.elm) {
      const { points } = this.getProps();
      const firstPoints = points[0];
      x = firstPoints[0];
      y = firstPoints[1];
    }
    return { x, y };
  };

  setPosition = (x: number | string, y: number | string) => {
    if (this.elm) {
      const { points } = this.getProps();
      const oldPosition = this.getPosition();

      const vector = {
        x: (typeof x === 'string' ? parseInt(x) : x) - oldPosition.x,
        y: (typeof y === 'string' ? parseInt(y) : y) - oldPosition.y,
      };

      const newPoints = points.map((point) => {
        return [point[0] + vector.x, point[1] + vector.y];
      });

      let newPointsStr = '';
      newPoints.forEach((p) => {
        newPointsStr += `${p[0]},${p[1]} `;
      });

      this.elm.setAttribute('points', newPointsStr);
    }
    return this;
  };

  setPoints = (points: number[][]) => {
    let pointsStr = '';
    points.forEach((p) => {
      pointsStr += `${p[0]},${p[1]} `;
    });

    if (this.elm) {
      this.elm.setAttribute('points', pointsStr);
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
