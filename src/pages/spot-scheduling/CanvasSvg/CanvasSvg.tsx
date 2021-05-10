import React from 'react';

interface Props {
  onClick: (x: number, y: number, evt: any) => void;
  onMouseMove: (x: number, y: number, evt: any) => void;
  onMouseOut: (evt: any) => void;
}

export default class CanvasSvg extends React.PureComponent<Props> {
  svg: any;

  componentDidMount = () => {
    // @ts-ignore
    this.svg = document.getElementById('svg-canvas');
  };

  multipleOf = (x: number, k: number = 10) => {
    const quotient = Math.floor(x / k);
    return quotient * k;
  };

  getMousePosition = (evt: any) => {
    let e = evt.target;
    if (e && e.nodeName && e.nodeName.toLowerCase() !== 'svg') {
      e = this.svg;
    }

    const dim = e.getBoundingClientRect();
    let x = evt.clientX - dim.left;
    let y = evt.clientY - dim.top;

    x = this.multipleOf(x);
    y = this.multipleOf(y);
    return { x, y };
  };

  onSvgClick = (evt: any) => {
    const { x, y } = this.getMousePosition(evt);
    this.props.onClick(x, y, evt);
  };

  onSvgMouseMove = (evt: any) => {
    const { x, y } = this.getMousePosition(evt);
    this.props.onMouseMove(x, y, evt);
  };

  onSvgMouseOut = (evt: any) => {
    this.props.onMouseOut(evt);
  };

  render() {
    return (
      <svg
        width="100%"
        height="100%"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onClick={this.onSvgClick}
        onMouseMove={this.onSvgMouseMove}
        onMouseLeave={this.onSvgMouseOut}
        id="svg-canvas"
      >
        {this.props.children}
      </svg>
    );
  }
}
