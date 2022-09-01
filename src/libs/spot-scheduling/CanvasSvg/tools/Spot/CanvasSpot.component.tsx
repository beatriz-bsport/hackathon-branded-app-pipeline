import React from 'react';
import chroma from 'chroma-js';
import { withTheme } from '@material-ui/styles';
import { getTextColorFromRGB } from '../../../../../utils/color';
import { SpotType } from '#libs/spot-scheduling/types';
import CanvasBaseComponent from '../BaseClasses/Base.component';
import { Theme } from '#libs/theme/types';
import { PERSONALIZED_CUSTOMIZATION } from '#libs/spot-scheduling/component/SpotCreator/CanvasSpotCreatorForm.component';

export interface CanvasSpotProps {
  x: number;
  y: number;
  rotation?: number;
  indexType?: number;
  index?: number;
  taken: boolean;
  selected: boolean;
  type?: 'circular' | 'rectangle' | 'square' | 'triangle';
  stroke?: string;
  fill?: string;
  spotType?: SpotType;
  selectingSpot?: boolean;
  theme?: Theme;
  trianglePreview: boolean;
}

const LENGTH_REFERENCE = 62;
let TRIANGLE_LENGTH = 70;

export class CanvasSpotComponent extends CanvasBaseComponent<CanvasSpotProps> {
  static zIndex = 99;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${LENGTH_REFERENCE / 2} ${
      LENGTH_REFERENCE / 2
    })`;
  }

  static getTransformRectangle(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${100 / 2} ${
      LENGTH_REFERENCE / 2
    })`;
  }

  static getTransformTriangle(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${TRIANGLE_LENGTH / 2} ${
      TRIANGLE_LENGTH / 2 + 13
    })`;
  }

  renderPersonalizedSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    let image = spotType?.free_image;
    if (this.props.selected) image = spotType?.selected_image;
    if (this.props.taken) image = spotType.taken_image;
    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
        type="personalized"
      >
        <rect
          className="svg-element"
          width={LENGTH_REFERENCE}
          height={LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : 'transparent'
          }
          fill="transparent"
          strokeWidth={2}
        />
        <image x={1} y={1} href={image} width={60} height={60} />
        <text
          x={LENGTH_REFERENCE / 2}
          y={LENGTH_REFERENCE / 2}
          fontSize="45"
          fontWeight="bold"
          dominantBaseline="middle"
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransform(0, 0, -rotation || 0)}
          style={{ userSelect: 'none' }}
          stroke="white"
          strokeWidth={2}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          visibility="visible"
          width={LENGTH_REFERENCE}
          height={LENGTH_REFERENCE}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }

  renderSquareSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';
    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
        type="square"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            x={0}
            y={0}
            width={LENGTH_REFERENCE}
            height={LENGTH_REFERENCE}
            stroke="black"
            fill="transparent"
            strokeWidth={2}
          />
        )}
        <rect
          className="svg-element"
          width={LENGTH_REFERENCE}
          height={LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : spotType.stroke_color || 'black'
          }
          fill={spotType.fill_color || 'transparent'}
          strokeWidth={2}
        />
        <rect
          x={LENGTH_REFERENCE / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={LENGTH_REFERENCE / 2 - 15 / 2}
          width={indexType > 9 ? 20 : 15}
          height={15}
          fill={spotType.fill_color || 'transparent'}
        />
        <text
          x={LENGTH_REFERENCE / 2}
          y={LENGTH_REFERENCE / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
          fontSize="30"
          transform={CanvasSpotComponent.getTransform(0, 0, -rotation || 0)}
          fill={getTextColorFromRGB(chroma(fill)?.rgb())}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          visibility="visible"
          width={LENGTH_REFERENCE}
          height={LENGTH_REFERENCE}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }

  renderTriangleSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';

    if (this.props.trianglePreview) {
      TRIANGLE_LENGTH = LENGTH_REFERENCE;
    }
    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransformTriangle(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
        type="triangle"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            x={0}
            y={0}
            width={TRIANGLE_LENGTH}
            height={TRIANGLE_LENGTH}
            stroke="black"
            fill="transparent"
            strokeWidth={2}
          />
        )}
        <rect
          className="svg-element"
          width={LENGTH_REFERENCE}
          height={LENGTH_REFERENCE}
          stroke="transparent"
          fill="transparent"
          strokeWidth={2}
        />
        <polygon
          points={`${
            TRIANGLE_LENGTH / 2
          },0 0,${TRIANGLE_LENGTH} ${TRIANGLE_LENGTH},${TRIANGLE_LENGTH}`}
          stroke={spotType?.stroke_color || 'black'}
          fill={spotType?.fill_color || 'white'}
          strokeWidth={2}
        />
        <text
          x={TRIANGLE_LENGTH / 2}
          y={TRIANGLE_LENGTH / 2 + 13}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
          fontSize="25"
          transform={CanvasSpotComponent.getTransformTriangle(
            0,
            0,
            -rotation || 0,
          )}
          fill={getTextColorFromRGB(chroma(fill)?.rgb())}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          visibility="visible"
          width={TRIANGLE_LENGTH}
          height={TRIANGLE_LENGTH}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }

  renderRectSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';
    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransformRectangle(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
        type="rectangle"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            x={0}
            y={0}
            width={LENGTH_REFERENCE}
            height={LENGTH_REFERENCE}
            stroke="black"
            fill="transparent"
            strokeWidth={2}
          />
        )}
        <rect
          className="svg-element"
          width={100}
          height={LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : spotType.stroke_color || 'black'
          }
          fill={spotType.fill_color || 'transparent'}
          strokeWidth={2}
          data-rotation={rotation || 0}
        />
        <rect
          x={LENGTH_REFERENCE / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={LENGTH_REFERENCE / 2 - 15 / 2}
          width={indexType > 9 ? 20 : 15}
          height={15}
          fill={spotType.fill_color || 'transparent'}
        />

        <text
          x={100 / 2}
          y={LENGTH_REFERENCE / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
          fontSize="30"
          transform={CanvasSpotComponent.getTransformRectangle(
            0,
            0,
            -rotation || 0,
          )}
          fill={getTextColorFromRGB(chroma(fill)?.rgb())}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          visibility="visible"
          width={100}
          height={LENGTH_REFERENCE}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }

  renderCircularSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
        type="circular"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            x={0}
            y={0}
            width={LENGTH_REFERENCE}
            height={LENGTH_REFERENCE}
            stroke="black"
            fill="transparent"
            strokeWidth={2}
          />
        )}
        <circle
          cx="31"
          cy="31"
          r="29"
          fill={spotType.fill_color || 'white'}
          stroke={spotType.stroke_color || 'black'}
          strokeWidth="2"
        />
        <rect
          x={LENGTH_REFERENCE / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={LENGTH_REFERENCE / 2 - 15 / 2}
          width={indexType > 9 ? 20 : 15}
          height={15}
          fill={spotType.fill_color || 'white'}
        />
        <text
          x={LENGTH_REFERENCE / 2}
          y={LENGTH_REFERENCE / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="30"
          style={{ userSelect: 'none' }}
          transform={CanvasSpotComponent.getTransform(0, 0, -rotation || 0)}
          fill={getTextColorFromRGB(chroma(fill)?.rgb())}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          visibility="visible"
          width={LENGTH_REFERENCE}
          height={LENGTH_REFERENCE}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }

  render() {
    let predefinedSpotType = this.props?.spotType || {
      fill_color: this.props.fill || 'white',
      stroke_color: this.props.stroke || 'black',
      shape: this.props.type || 'circular',
      prefix: this.props.prefix || '',
    };
    const asset_identifier = this.props.asset_identifier || 'spot_free';
    const asset = this.props.getAsset && this.props?.getAsset(asset_identifier);

    const oldVersionSpotType =
      asset_identifier === 'spot_free'
        ? { free_image: asset?.asset, selected_image: asset?.asset }
        : { taken_image: asset?.asset, selected_image: asset?.asset };

    if (this.props.selected)
      predefinedSpotType = {
        ...predefinedSpotType,
        fill_color: this.props.theme.palette.primary.main,
        stroke_color: this.props.theme.palette.primary.dark,
      };
    if (this.props.taken)
      predefinedSpotType = {
        ...predefinedSpotType,
        fill_color: this.props.theme.palette.grey[400],
        stroke_color: this.props.theme.palette.grey[600],
      };
    if (this.props?.spotType?.customization === PERSONALIZED_CUSTOMIZATION)
      return this.renderPersonalizedSpot(this.props.spotType);
    if (asset?.asset) return this.renderPersonalizedSpot(oldVersionSpotType);
    switch (predefinedSpotType.shape) {
      case 'square':
        return this.renderSquareSpot(predefinedSpotType);
      case 'rectangle':
        return this.renderRectSpot(predefinedSpotType);
      case 'triangle':
        return this.renderTriangleSpot(predefinedSpotType);
      case 'circular':
      default:
        return this.renderCircularSpot(predefinedSpotType);
    }
  }
}

export default withTheme(CanvasSpotComponent);
