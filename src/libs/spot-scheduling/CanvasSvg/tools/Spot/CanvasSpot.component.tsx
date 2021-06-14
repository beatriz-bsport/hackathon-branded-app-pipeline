import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasSpotProps {
  x: number;
  y: number;
  rotation?: number;
  index: number;
  asset_identifier: string;
  selected: boolean;
}

export default class CanvasSpotComponent extends CanvasBaseComponent<CanvasSpotProps> {
  static zIndex = 99;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${62 / 2} ${62 / 2})`;
  }

  renderSpot() {
    const asset_identifier = this.props.asset_identifier || 'spot_free';
    const asset = this.props.getAsset(asset_identifier);

    let url;

    if (asset) {
      url = asset.asset;
    }

    if (url) {
      return <image x={1} y={1} href={url} width={60} height={60} />;
    }

    if (asset_identifier === 'spot_free') {
      return (
        <circle
          cx="31"
          cy="31"
          r="29"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />
      );
    }

    return (
      <circle
        cx="30"
        cy="30"
        r="29"
        fill="lightgrey"
        stroke="darkgrey"
        strokeWidth="2"
      />
    );
  }

  render() {
    const { x, y, rotation, index } = this.props;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
      >
        {this.props.selected && (
          <rect
            x={0}
            y={0}
            width={62}
            height={62}
            stroke="black"
            fill="transparent"
            strokeWidth={2}
          />
        )}

        {this.renderSpot()}

        <rect
          x={62 / 2 - (index > 9 ? 20 : 15) / 2}
          y={62 / 2 - 15 / 2}
          width={index > 9 ? 20 : 15}
          height={15}
          fill="white"
        />

        <text
          x={62 / 2}
          y={62 / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          {index}
        </text>

        <rect
          visibility="visible"
          width={62}
          height={62}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }
}
