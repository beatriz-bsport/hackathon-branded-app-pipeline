import React from 'react';

export const SVG_WORK_SIZE = 2100;
const SVG_WALL_SIZE = 5000;

interface Props {
  onClick: (x: number, y: number, evt: any) => void;
  onMouseMove: (
    x: number, // use scale
    y: number, // use scale
    absoluteX: number,
    absoluteY: number,
    evt: any,
  ) => void;
  onMouseOut: (evt: any) => void;
  enablePan: boolean;
  onSvgId: (id: string) => void;
  registerFunction: (params: {
    centerSvg: (params: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    }) => void;
    zoomIn: () => void;
    zoomOut: () => void;
  }) => void;
  showGrid?: boolean;
  onEnterUnsafeZone: () => void;
  onLeaveUnsafeZone: () => void;
}

interface State {
  width: number;
  height: number;
  max_scale: number;
}

export default class CanvasSvg extends React.PureComponent<Props, State> {
  svg: any;

  lastWheelEventTimestamp = 0;

  scale = 2.5;

  offsetX = 0;

  offsetY = 0;

  initialDrag: {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null = null;

  svgId = '';

  svgContainerId = '';

  static instanceCount = 0;

  isUnsafeZone = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      width: 400,
      height: 400,
      max_scale: 2.5,
    };

    CanvasSvg.instanceCount += 1;
    this.svgId = `svg-canvas-${CanvasSvg.instanceCount}`;
    this.svgContainerId = `svg-canvas-container-${CanvasSvg.instanceCount}`;
  }

  centerOffsets = (width: number, height: number, scale: number) => {
    this.scale = scale;
    this.offsetX = (SVG_WORK_SIZE - width * this.scale) / 2;
    this.offsetY = (SVG_WORK_SIZE - height * this.scale) / 2;
  };

  limitOffsets() {
    if (this.offsetX < -SVG_WORK_SIZE) {
      this.offsetX = -SVG_WORK_SIZE;
    }

    if (this.offsetY > SVG_WORK_SIZE) {
      this.offsetY = -SVG_WORK_SIZE;
    }

    if (this.offsetX > SVG_WORK_SIZE) {
      this.offsetX = SVG_WORK_SIZE;
    }

    if (this.offsetY > SVG_WORK_SIZE) {
      this.offsetY = SVG_WORK_SIZE;
    }
  }

  get viewBox() {
    const viewbox = `${this.offsetX} ${this.offsetY} ${
      this.state.width * this.scale
    } ${this.state.height * this.scale}`;

    return viewbox;
  }

  componentDidMount = () => {
    // @ts-ignore
    this.svg = document.getElementById(this.svgId);
    this.props.onSvgId(this.svgId);
    this.props.registerFunction({
      centerSvg: this.centerSvg,
      zoomIn: this.zoomIn,
      zoomOut: this.zoomOut,
    });
    this.svg && this.svg.addEventListener('wheel', this.onWheelChange);
    window.addEventListener('resize', this.setDimensions);
    this.setDimensions();
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setDimensions);
  };

  centerSvg = (params: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }) => {
    const { minX, minY, maxX, maxY } = params;

    const element = document.getElementById(this.svgContainerId);
    const position = element.getBoundingClientRect();
    let { width, height } = position;

    const Xdiff = maxX - minX;
    const Ydiff = maxY - minY;

    let scale = 1;

    if (Xdiff > width) {
      scale = Xdiff / width + 0.1;
    }

    if (Ydiff > height) {
      if (Ydiff / height > scale) {
        scale = Ydiff / height + 0.1;
      }
    }

    this.scale = scale;

    width *= scale;
    height *= scale;

    const XXdiff = width - Xdiff;
    const YYdiff = height - Ydiff;

    this.offsetX = minX - XXdiff / 2;
    this.offsetY = minY - YYdiff / 2;

    this.svg.setAttribute('viewBox', this.viewBox);
  };

  zoomIn = () => {
    let scale = this.scale;
    scale -= 0.1;
    scale = Math.min(Math.max(0.7, scale), this.state.max_scale);
    this.setScale(scale);
  };

  zoomOut = () => {
    let scale = this.scale;
    scale += 0.1;
    scale = Math.min(Math.max(0.7, scale), this.state.max_scale);
    this.setScale(scale);
  };

  setScale = (scale: number) => {
    const currentW = this.state.width * this.scale;
    const currentH = this.state.height * this.scale;

    const newW = this.state.width * scale;
    const newH = this.state.height * scale;

    const diffW = newW - currentW;
    const diffH = newH - currentH;

    if (scale !== this.scale) {
      this.offsetX -= diffW / 2;
      this.offsetY -= diffH / 2;
    }
    this.scale = scale;

    this.limitOffsets();

    this.svg.setAttribute('viewBox', this.viewBox);
  };

  onWheelChange = (event: any) => {
    if (Date.now() + 100 > this.lastWheelEventTimestamp) {
      event.preventDefault();
      let scale = this.scale;
      scale += event.deltaY * +0.01;
      scale = Math.min(Math.max(0.7, scale), this.state.max_scale);
      this.setScale(scale);
      this.lastWheelEventTimestamp = Date.now();
    }
  };

  setDimensions = () => {
    const element = document.getElementById(this.svgContainerId);
    const position = element.getBoundingClientRect();
    const { width, height } = position;
    const max_scale =
      width > height
        ? (SVG_WORK_SIZE * 1.01) / height
        : (SVG_WORK_SIZE * 1.01) / width;
    this.setState({ width, height, max_scale });
    this.centerOffsets(width, height, max_scale);
  };

  multipleOf = (x: number, k: number = 5) => {
    const quotient = Math.floor(x / k);
    return quotient * k;
  };

  getAbsoluteMousePosition = (evt: any) => {
    let e = evt.target;
    if (e && e.nodeName && e.nodeName.toLowerCase() !== 'svg') {
      e = this.svg;
    }

    const dim = e.getBoundingClientRect();
    const absoluteX = evt.clientX - dim.left;
    const absoluteY = evt.clientY - dim.top;
    return { absoluteX, absoluteY };
  };

  getMousePosition = (x: number, y: number) => {
    return {
      x: this.multipleOf(this.offsetX + x * this.scale),
      y: this.multipleOf(this.offsetY + y * this.scale),
    };
  };

  onSvgClick = (evt: any) => {
    const { absoluteX, absoluteY } = this.getAbsoluteMousePosition(evt);
    const { x, y } = this.getMousePosition(absoluteX, absoluteY);

    if (x < 0 || x > SVG_WORK_SIZE) {
      return;
    }
    if (y < 0 || y > SVG_WORK_SIZE) {
      return;
    }

    this.props.onClick(x, y, evt);
  };

  onSvgMouseDown = (evt: any) => {
    const { absoluteX, absoluteY } = this.getAbsoluteMousePosition(evt);
    this.initialDrag = {
      x: absoluteX,
      y: absoluteY,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    };
  };

  onSvgMouseUp = () => {
    this.initialDrag = null;
  };

  onSvgMouseMove = (evt: any) => {
    const { absoluteX, absoluteY } = this.getAbsoluteMousePosition(evt);

    if (this.props.enablePan && this.initialDrag) {
      const xDiff = absoluteX - this.initialDrag.x;
      const yDiff = absoluteY - this.initialDrag.y;

      const offsetX = this.initialDrag.offsetX - xDiff;
      const offsetY = this.initialDrag.offsetY - yDiff;

      this.offsetX = offsetX;
      this.offsetY = offsetY;

      this.limitOffsets();

      this.svg.setAttribute('viewBox', this.viewBox);
    }

    const { x, y } = this.getMousePosition(absoluteX, absoluteY);

    if ((x < 0 || x > SVG_WORK_SIZE) && !this.isUnsafeZone) {
      this.isUnsafeZone = true;
      this.props.onEnterUnsafeZone();
      return;
    }

    if ((y < 0 || y > SVG_WORK_SIZE) && !this.isUnsafeZone) {
      this.isUnsafeZone = true;
      this.props.onEnterUnsafeZone();
      return;
    }

    if (
      x > 0 &&
      x < SVG_WORK_SIZE &&
      y > 0 &&
      y < SVG_WORK_SIZE &&
      this.isUnsafeZone
    ) {
      this.isUnsafeZone = false;
      this.props.onLeaveUnsafeZone();
    }

    this.props.onMouseMove(x, y, absoluteX, absoluteY, evt);
  };

  onMouseOver = () => {};

  onSvgMouseOut = (evt: any) => {
    this.initialDrag = null;
    this.props.onMouseOut(evt);
  };

  renderGrid = () => {
    if (!this.props.showGrid) {
      return null;
    }

    const line = [];

    const lineSpace = 60;

    for (let i = 0; i < SVG_WORK_SIZE; i += lineSpace) {
      line.push(
        <line x1={i} y1={0} x2={i} y2={SVG_WORK_SIZE} stroke="lightgrey" />,
      );

      line.push(
        <line x1={0} y1={i} x2={SVG_WORK_SIZE} y2={i} stroke="lightgrey" />,
      );
    }

    line.push(
      <circle
        cx={SVG_WORK_SIZE / 2}
        cy={SVG_WORK_SIZE / 2}
        r={2}
        fill="grey"
      />,
    );

    return line;
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
        }}
        id={this.svgContainerId}
      >
        <svg
          width={this.state.width}
          height={this.state.height}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.onSvgClick}
          onMouseDown={this.onSvgMouseDown}
          onMouseUp={this.onSvgMouseUp}
          onMouseMove={this.onSvgMouseMove}
          onMouseLeave={this.onSvgMouseOut}
          onMouseOver={this.onMouseOver}
          id={this.svgId}
          viewBox={this.viewBox}
        >
          <rect
            className="svg-element"
            x={-SVG_WALL_SIZE}
            y={-SVG_WALL_SIZE}
            width={SVG_WORK_SIZE + SVG_WALL_SIZE * 2}
            height={SVG_WORK_SIZE + SVG_WALL_SIZE * 2}
            stroke="black"
            fill="grey"
            style={{ cursor: this.props.enablePan ? undefined : 'not-allowed' }}
          />

          <rect
            className="svg-element"
            x={0}
            y={0}
            width={SVG_WORK_SIZE}
            height={SVG_WORK_SIZE}
            stroke="transparent"
            fill="white"
          />

          {this.renderGrid()}

          {this.props.children}
        </svg>
      </div>
    );
  }
}
