// @flow

import React, { Component } from 'react';
import { Sankey, Rectangle, Layer, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

const DemoSankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  colors,
}: {
  x: number,
  y: number,
  width: number,
  height: number,
  index: number,
  payload: any,
  containerWidth: number,
  colors: Array,
}) => {
  const isOut = x + width + 6 > containerWidth;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colors[index]}
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        stroke="#333"
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        stroke="#333"
        strokeOpacity="0.5"
      >
        {payload.value}
      </text>
    </Layer>
  );
};

export class DemoSankeyLink extends Component {
  static displayName = 'SankeyLinkDemo';

  static propTypes = {
    sourceX: PropTypes.number,
    targetX: PropTypes.number,
    sourceY: PropTypes.number,
    targetY: PropTypes.number,
    sourceControlX: PropTypes.number,
    targetControlX: PropTypes.number,
    linkWidth: PropTypes.number,
    index: PropTypes.number,
  };

  state = {
    fill: `url(#linkGradient-${this.props.index})`,
  };

  render() {
    const {
      sourceX,
      targetX,
      sourceY,
      targetY,
      sourceControlX,
      targetControlX,
      linkWidth,
      index,
    } = this.props;
    const { fill } = this.state;

    return (
      <Layer key={`CustomLink${index}`}>
        <path
          d={`
            M${sourceX},${sourceY + linkWidth / 2}
            C${sourceControlX},${sourceY + linkWidth / 2}
              ${targetControlX},${targetY + linkWidth / 2}
              ${targetX},${targetY + linkWidth / 2}
            L${targetX},${targetY - linkWidth / 2}
            C${targetControlX},${targetY - linkWidth / 2}
              ${sourceControlX},${sourceY - linkWidth / 2}
              ${sourceX},${sourceY - linkWidth / 2}
            Z
          `}
          fill={fill}
          strokeWidth="0"
          onMouseEnter={() => {
            this.setState({ fill: 'rgba(0, 136, 254, 0.5)' });
          }}
          onMouseLeave={() => {
            this.setState({ fill: `url(#linkGradient-${index})` });
          }}
        />
      </Layer>
    );
  }
}

type Props = {
  data: any,
  width: number,
  height: number,
  title: string,
};

export default function SankeyGraph(props: Props) {
  const randomColors = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ];
  return (
    <div className="sankey-charts">
      <div>
        {props.title}
        <Sankey
          width={props.width}
          height={props.height}
          margin={{ top: 20, bottom: 20 }}
          data={props.data}
          nodeWidth={20}
          nodePadding={60}
          linkCurvature={0.61}
          iterations={64}
          link={<DemoSankeyLink />}
          node={<DemoSankeyNode containerWidth={500} colors={randomColors} />}
        >
          <defs>
            {props.data.links.map((link, index) => (
              <linearGradient id={`linkGradient-${index}`}>
                <stop
                  offset="0%"
                  stopColor={`${randomColors[link.source]}50`}
                />
                <stop
                  offset="100%"
                  stopColor={`${randomColors[link.target]}50`}
                />
              </linearGradient>
            ))}
          </defs>
          <Tooltip />
        </Sankey>
      </div>
    </div>
  );
}
