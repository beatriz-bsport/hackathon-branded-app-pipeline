// @ts-nocheck
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
const SPOT_IMAGE_HEIGHT = LENGTH_REFERENCE;
const SPOT_IMAGE_WIDTH = LENGTH_REFERENCE;
let TRIANGLE_LENGTH = 70;

export class CanvasSpotComponent extends CanvasBaseComponent<CanvasSpotProps> {
  static zIndex = 99;

  static getTransform(x: number, y: number, rotation: number, height: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${
      height ?? LENGTH_REFERENCE / 2
    } ${LENGTH_REFERENCE / 2})`;
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

  getSpotTextColor(spotFillColor) {
    return this.props.taken
      ? chroma('black').alpha(0.5).hex()
      : getTextColorFromRGB(chroma(spotFillColor)?.rgb());
  }

  renderPersonalizedSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index, height, width } = this.props;
    let image = spotType?.free_image;
    if (this.props.selected) image = spotType?.selected_image;
    if (this.props.taken) image = spotType.taken_image;

    // A bit dirty +2 is added because the text in not exactly centered otherwise
    // something (either the strokes of svgs element or something else) is
    // added an extra 2px in height and width.
    const textPositionX = image
      ? SPOT_IMAGE_WIDTH / 2 + 2
      : LENGTH_REFERENCE / 2;
    const textPositionY = image
      ? SPOT_IMAGE_HEIGHT / 2 + 2
      : LENGTH_REFERENCE / 2;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
          height ?? 0,
        )}
        type="personalized"
      >
        <rect
          className="svg-element"
          fill="transparent"
          height={height ?? LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : 'transparent'
          }
          strokeWidth={2}
          width={width ?? LENGTH_REFERENCE}
        />
        <image
          height={SPOT_IMAGE_HEIGHT}
          href={image}
          width={SPOT_IMAGE_WIDTH}
          x={1}
          y={1}
        />
        <text
          alignmentBaseline="middle"
          dominantBaseline="middle"
          fontSize="30"
          fontStyle="normal"
          fontWeight={700}
          letterSpacing="0.15px"
          stroke="white"
          strokeWidth={2}
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransform(0, 0, -rotation || 0)}
          x={textPositionX}
          y={textPositionY}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={height ?? LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={width ?? LENGTH_REFERENCE}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderSquareSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);

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
            fill="transparent"
            height={LENGTH_REFERENCE}
            stroke="black"
            strokeWidth={2}
            width={LENGTH_REFERENCE}
            x={0}
            y={0}
          />
        )}
        <rect
          className="svg-element"
          fill={spotType.fill_color || 'transparent'}
          height={LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : spotType.stroke_color || 'black'
          }
          strokeWidth={2}
          width={LENGTH_REFERENCE}
        />
        <rect
          fill={spotType.fill_color || 'transparent'}
          height={15}
          width={indexType > 9 ? 20 : 15}
          x={LENGTH_REFERENCE / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={LENGTH_REFERENCE / 2 - 15 / 2}
        />
        <text
          dominantBaseline="middle"
          fill={spotTextColor}
          fontSize="30"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransform(0, 0, -rotation || 0)}
          x={LENGTH_REFERENCE / 2}
          y={LENGTH_REFERENCE / 2}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={LENGTH_REFERENCE}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderTriangleSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);

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
            fill="transparent"
            height={TRIANGLE_LENGTH}
            stroke="black"
            strokeWidth={2}
            width={TRIANGLE_LENGTH}
            x={0}
            y={0}
          />
        )}
        <rect
          className="svg-element"
          fill="transparent"
          height={LENGTH_REFERENCE}
          stroke="transparent"
          strokeWidth={2}
          width={LENGTH_REFERENCE}
        />
        <polygon
          fill={spotType?.fill_color || 'white'}
          points={`${
            TRIANGLE_LENGTH / 2
          },0 0,${TRIANGLE_LENGTH} ${TRIANGLE_LENGTH},${TRIANGLE_LENGTH}`}
          stroke={spotType?.stroke_color || 'black'}
          strokeWidth={2}
        />
        <text
          dominantBaseline="middle"
          fill={spotTextColor}
          fontSize="25"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransformTriangle(
            0,
            0,
            -rotation || 0,
          )}
          x={TRIANGLE_LENGTH / 2}
          y={TRIANGLE_LENGTH / 2 + 13}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={TRIANGLE_LENGTH}
          stroke="transparent"
          visibility="visible"
          width={TRIANGLE_LENGTH}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderRectSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);
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
            fill="transparent"
            height={LENGTH_REFERENCE}
            stroke="black"
            strokeWidth={2}
            width={LENGTH_REFERENCE}
            x={0}
            y={0}
          />
        )}
        <rect
          className="svg-element"
          data-rotation={rotation || 0}
          fill={spotType.fill_color || 'transparent'}
          height={LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : spotType.stroke_color || 'black'
          }
          strokeWidth={2}
          width={100}
        />
        <rect
          fill={spotType.fill_color || 'transparent'}
          height={15}
          width={indexType > 9 ? 20 : 15}
          x={LENGTH_REFERENCE / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={LENGTH_REFERENCE / 2 - 15 / 2}
        />

        <text
          dominantBaseline="middle"
          fill={spotTextColor}
          fontSize="30"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransformRectangle(
            0,
            0,
            -rotation || 0,
          )}
          x={100 / 2}
          y={LENGTH_REFERENCE / 2}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={100}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderCircularSpot(spotType: SpotType) {
    const { x, y, rotation, indexType, index } = this.props;
    const fill = spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);

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
            fill="transparent"
            height={LENGTH_REFERENCE}
            stroke="black"
            strokeWidth={2}
            width={LENGTH_REFERENCE}
            x={0}
            y={0}
          />
        )}
        <circle
          cx="31"
          cy="31"
          fill={spotType.fill_color || 'white'}
          r="29"
          stroke={spotType.stroke_color || 'black'}
          strokeWidth="2"
        />
        <rect
          fill={spotType.fill_color || 'white'}
          height={15}
          width={indexType > 9 ? 20 : 15}
          x={LENGTH_REFERENCE / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={LENGTH_REFERENCE / 2 - 15 / 2}
        />
        <text
          dominantBaseline="middle"
          fill={spotTextColor}
          fontSize="30"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransform(0, 0, -rotation || 0)}
          x={LENGTH_REFERENCE / 2}
          y={LENGTH_REFERENCE / 2}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={LENGTH_REFERENCE}
          x={0}
          y={0}
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
    if (asset?.asset && this.props?.asset_identifier)
      return this.renderPersonalizedSpot(oldVersionSpotType);
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
