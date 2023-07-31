import React from 'react';
import { AssetForBlueprint } from '../../../types';

export interface CanvasComponentMouseProps {
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
  onMouseDown: (evt: any) => void;
  onMouseUp: (evt: any) => void;
}

export interface CanvasComponentBaseProps extends CanvasComponentMouseProps {
  id: string;
  getAsset: (identifier: string) => AssetForBlueprint;
}

class CanvasBaseComponent<
  InheritedProps = {},
  InheritedState = {},
> extends React.PureComponent<
  CanvasComponentBaseProps & InheritedProps,
  InheritedState
> {
  get BaseProps() {
    // @ts-ignore
    const baseProps: CanvasComponentBaseProps = {
      id: this.props.id,
      onClick: this.props.onClick,
      onMouseOver: this.props.onMouseOver,
      onMouseUp: this.props.onMouseUp,
      onMouseDown: this.props.onMouseDown,
      onMouseOut: this.props.onMouseOut,
    };

    return baseProps;
  }

  /**
   * Describe the rendering order on the Z axis
   * Redefine this value for custom zIndex
   */
  static zIndex = 1;
}

export default CanvasBaseComponent;
