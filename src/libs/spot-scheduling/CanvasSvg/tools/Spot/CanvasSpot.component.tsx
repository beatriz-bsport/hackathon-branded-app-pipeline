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

  static getTransform(
    x: number,
    y: number,
    rotation: number,
    height: number,
    width: number,
  ) {
    return `translate(${x} ${y}) rotate(${rotation} ${
      (width ?? height ?? LENGTH_REFERENCE) / 2
    } ${(height ?? LENGTH_REFERENCE) / 2})`;
  }

  static getTransformRectangle(
    x: number,
    y: number,
    rotation: number,
    height: number,
    width: number,
  ) {
    return `translate(${x} ${y}) rotate(${rotation} ${(width ?? 100) / 2} ${
      (height ?? LENGTH_REFERENCE) / 2
    })`;
  }

  static getTransformTriangle(
    x: number,
    y: number,
    rotation: number,
    height: number,
  ) {
    return `translate(${x} ${y}) rotate(${rotation} ${
      (height ?? TRIANGLE_LENGTH) / 2
    } ${(height ?? TRIANGLE_LENGTH) / 2 + 13})`;
  }

  getSpotTextColor(spotFillColor) {
    return this.props.taken
      ? chroma('black').alpha(0.5).hex()
      : getTextColorFromRGB(chroma(spotFillColor)?.rgb());
  }

  renderPersonalizedSpot(spotType: SpotType) {
    const {
      x,
      y,
      rotation,
      indexType,
      index,
      height,
      width,
      fill: _fill,
      stroke,
      strokeWidth,
      fontSize,
      fontStyle,
      textOffsetX,
      textOffsetY,
      fontColor,
      fontWeight,
      strokeDasharray,
      textStroke,
      textStrokeWidth,
    } = this.props;
    let image = spotType?.free_image;
    if (this.props.selected) image = spotType?.selected_image;
    if (this.props.taken) image = spotType.taken_image;

    // A bit dirty +2 is added because the text in not exactly centered otherwise
    // something (either the strokes of svgs element or something else) is
    // added an extra 2px in height and width.
    const textPositionX =
      image && !height
        ? SPOT_IMAGE_WIDTH / 2 + 2
        : (height ?? LENGTH_REFERENCE) / 2;
    const textPositionY =
      image && !width
        ? SPOT_IMAGE_HEIGHT / 2 + 2
        : (width ?? LENGTH_REFERENCE) / 2;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
          height ?? 0,
          width,
        )}
        type="personalized"
      >
        <rect
          className="svg-element"
          fill={_fill || 'transparent'}
          height={height ?? LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : stroke || 'transparent'
          }
          strokeWidth={strokeWidth ?? 2}
          width={width ?? LENGTH_REFERENCE}
          {...(strokeDasharray ? { strokeDasharray } : {})}
        />
        <image
          height={height ?? SPOT_IMAGE_HEIGHT}
          href={image}
          width={width ?? SPOT_IMAGE_WIDTH}
          x={1}
          y={1}
        />
        <text
          alignmentBaseline="middle"
          dominantBaseline="middle"
          fontSize={fontSize ?? '30'}
          fontStyle={fontStyle ?? 'normal'}
          fontWeight={fontWeight ?? 700}
          letterSpacing="0.15px"
          stroke={textStroke ?? 'white'}
          strokeWidth={textStrokeWidth ?? 2}
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransform(
            0,
            0,
            -rotation || 0,
            height,
            width,
          )}
          x={(textOffsetX ?? 0) + textPositionX}
          y={(textOffsetY ?? 0) + textPositionY}
          {...(fontColor ? { fill: fontColor } : {})}
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
    const {
      x,
      y,
      rotation,
      indexType,
      index,
      fill: _fill,
      stroke,
      height,
      strokeWidth,
      fontSize,
      textOffsetX,
      textOffsetY,
      fontColor,
      fontWeight,
      strokeDasharray,
    } = this.props;
    const fill = _fill || spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
          height,
        )}
        type="square"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            fill="transparent"
            height={height || LENGTH_REFERENCE}
            stroke="black"
            strokeWidth={2}
            width={height || LENGTH_REFERENCE}
            x={0}
            y={0}
          />
        )}
        <rect
          className="svg-element"
          fill={fill || spotType.fill_color || 'transparent'}
          height={height || LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : stroke || spotType.stroke_color || 'black'
          }
          strokeWidth={strokeWidth ?? 2}
          width={height || LENGTH_REFERENCE}
          {...(strokeDasharray ? { strokeDasharray } : {})}
        />
        <rect
          fill={spotType.fill_color || 'transparent'}
          height={15}
          width={indexType > 9 ? 20 : 15}
          x={(height || LENGTH_REFERENCE) / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={(height || LENGTH_REFERENCE) / 2 - 15 / 2}
        />
        <text
          dominantBaseline="middle"
          fill={fontColor ?? spotTextColor}
          fontSize={fontSize ?? '30'}
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransform(
            0,
            0,
            -rotation || 0,
            height,
          )}
          x={(textOffsetX ?? 0) + (height || LENGTH_REFERENCE) / 2}
          y={(textOffsetY ?? 0) + (height || LENGTH_REFERENCE) / 2}
          {...(fontWeight ? { fontWeight } : {})}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={height || LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={height || LENGTH_REFERENCE}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderTriangleSpot(spotType: SpotType) {
    const {
      x,
      y,
      rotation,
      indexType,
      index,
      fill: _fill,
      stroke,
      height,
      strokeWidth,
      fontSize,
      textOffsetX,
      textOffsetY,
      fontColor,
      fontWeight,
      strokeDasharray,
    } = this.props;
    const fill = _fill || spotType.fill_color || 'white';
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
          height,
        )}
        type="triangle"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            fill="transparent"
            height={height ?? TRIANGLE_LENGTH}
            stroke="black"
            strokeWidth={2}
            width={height ?? TRIANGLE_LENGTH}
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
          fill={fill || spotType?.fill_color || 'white'}
          points={`${(height ?? TRIANGLE_LENGTH) / 2},0 0,${
            height ?? TRIANGLE_LENGTH
          } ${height ?? TRIANGLE_LENGTH},${height ?? TRIANGLE_LENGTH}`}
          stroke={stroke || spotType?.stroke_color || 'black'}
          strokeWidth={strokeWidth ?? 2}
          {...(strokeDasharray ? { strokeDasharray } : {})}
        />
        <text
          dominantBaseline="middle"
          fill={fontColor ?? spotTextColor}
          fontSize={fontSize ?? '25'}
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransformTriangle(
            0,
            0,
            -rotation || 0,
            height,
          )}
          x={(textOffsetX ?? 0) + (height ?? TRIANGLE_LENGTH) / 2}
          y={(textOffsetY ?? 0) + (height ?? TRIANGLE_LENGTH) / 2 + 13}
          {...(fontWeight ? { fontWeight } : {})}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={height ?? TRIANGLE_LENGTH}
          stroke="transparent"
          visibility="visible"
          width={height ?? TRIANGLE_LENGTH}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderRectSpot(spotType: SpotType) {
    const {
      x,
      y,
      rotation,
      indexType,
      index,
      fill: _fill,
      stroke,
      height,
      width,
      strokeWidth,
      fontSize,
      textOffsetX,
      textOffsetY,
      fontColor,
      fontWeight,
      strokeDasharray,
    } = this.props;
    const fill = _fill || spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);
    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransformRectangle(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
          height,
          width,
        )}
        type="rectangle"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            fill="transparent"
            height={height || LENGTH_REFERENCE}
            stroke="black"
            strokeWidth={2}
            width={height || LENGTH_REFERENCE}
            x={0}
            y={0}
          />
        )}
        <rect
          className="svg-element"
          data-rotation={rotation || 0}
          fill={fill || spotType.fill_color || 'transparent'}
          height={height || LENGTH_REFERENCE}
          stroke={
            this.props.selected && !this.props.selectingSpot
              ? 'red'
              : stroke || spotType.stroke_color || 'black'
          }
          strokeWidth={strokeWidth ?? 2}
          width={width || 100}
          {...(strokeDasharray ? { strokeDasharray } : {})}
        />
        <rect
          fill={spotType.fill_color || 'transparent'}
          height={15}
          width={indexType > 9 ? 20 : 15}
          x={(height || LENGTH_REFERENCE) / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={(height || LENGTH_REFERENCE) / 2 - 15 / 2}
        />

        <text
          dominantBaseline="middle"
          fill={fontColor ?? spotTextColor}
          fontSize={fontSize ?? '30'}
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          transform={CanvasSpotComponent.getTransformRectangle(
            0,
            0,
            -rotation || 0,
            height,
            width,
          )}
          x={(textOffsetX ?? 0) + (width || 100) / 2}
          y={(textOffsetY ?? 0) + (height || LENGTH_REFERENCE) / 2}
          {...(fontWeight ? { fontWeight } : {})}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={height || LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={width || 100}
          x={0}
          y={0}
        />
      </g>
    );
  }

  renderCircularSpot(spotType: SpotType) {
    const {
      x,
      y,
      rotation,
      indexType,
      index,
      fill: _fill,
      stroke,
      height,
      strokeWidth,
      fontSize,
      textOffsetX,
      textOffsetY,
      fontColor,
      fontWeight,
      strokeDasharray,
    } = this.props;
    const fill = _fill || spotType.fill_color || 'white';
    const spotTextColor = this.getSpotTextColor(fill);

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
          height,
        )}
        type="circular"
      >
        {this.props.selected && !this.props.selectingSpot && (
          <rect
            fill="transparent"
            height={height || LENGTH_REFERENCE}
            stroke="black"
            strokeWidth={2}
            width={height || LENGTH_REFERENCE}
            x={0}
            y={0}
          />
        )}

        <circle
          cx={`${(height || LENGTH_REFERENCE) / 2}`}
          cy={`${(height || LENGTH_REFERENCE) / 2}`}
          fill={fill || 'white'}
          r={`${
            height % 2 === 0
              ? (height || LENGTH_REFERENCE) / 2 - 1
              : (height || LENGTH_REFERENCE) / 2 - 0.5
          }`}
          stroke={stroke || spotType.stroke_color || 'black'}
          {...(strokeDasharray ? { strokeDasharray } : {})}
          strokeWidth={strokeWidth ?? 2}
        />
        <rect
          fill={fill || 'white'}
          height={15}
          width={indexType > 9 ? 20 : 15}
          x={(height || LENGTH_REFERENCE) / 2 - (indexType > 9 ? 20 : 15) / 2}
          y={(height || LENGTH_REFERENCE) / 2 - 15 / 2}
        />
        <text
          dominantBaseline="middle"
          fill={fontColor ?? spotTextColor}
          fontSize={fontSize ?? '30'}
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          x={(textOffsetX ?? 0) + (height || LENGTH_REFERENCE) / 2}
          y={(textOffsetY ?? 0) + (height || LENGTH_REFERENCE) / 2}
          {...(fontWeight ? { fontWeight } : {})}
        >
          {spotType?.prefix && indexType && `${spotType?.prefix}${indexType}`}
          {!spotType?.prefix && indexType && indexType}
          {!spotType?.prefix && !indexType && index}
        </text>
        <rect
          fill="transparent"
          height={height || LENGTH_REFERENCE}
          stroke="transparent"
          visibility="visible"
          width={height || LENGTH_REFERENCE}
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
