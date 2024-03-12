import React, { CSSProperties, PropsWithChildren, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useViewport, Position } from 'react-flow-renderer';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  boxToRect,
  getNodeToolbarTransform,
  rectToBox,
} from '#libs/sequential_marketing/utils';
import { ClickAwayContext } from '../context/ClickAwayContext.component';

type Props = {
  handleOnClickAway: () => void;
  height: number;
  isVisible: boolean;
  position: Position;
  nodePosition: { x: number; y: number };
  width: number;
};

export const CadencePopover: React.FC<PropsWithChildren<Props>> = ({
  children,
  height,
  isVisible,
  nodePosition,
  position = Position.Right,
  width,
  handleOnClickAway,
}) => {
  const viewport = useViewport();
  const wrapper = document?.getElementsByClassName('react-flow')?.[0];
  const nodeBox = rectToBox({ ...nodePosition, width, height });
  const { clickAwayEnabled } = useContext(ClickAwayContext);

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    transform: getNodeToolbarTransform(
      boxToRect(nodeBox),
      viewport,
      position,
      0,
    ),
    zIndex: 800, // because his sibling has a zIndex of 700 (cf react-flow__renderer className),
  };

  if (!wrapper || !isVisible) {
    return null;
  }

  return createPortal(
    <ClickAwayListener onClickAway={clickAwayEnabled && handleOnClickAway}>
      <div style={wrapperStyle}>{children}</div>
    </ClickAwayListener>,
    wrapper,
  );
};

export default React.memo(CadencePopover);
