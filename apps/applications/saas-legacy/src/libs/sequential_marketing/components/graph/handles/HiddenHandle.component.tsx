import React from 'react';

import { Handle, Position, HandleType } from 'react-flow-renderer';
import makeStyles from '@material-ui/styles/makeStyles';

type Props = {
  position: Position;
  type: HandleType;
  isConnectable?: boolean;
  style?: React.CSSProperties;
};

export const HiddenHandle: React.FC<Props> = ({
  position,
  type,
  isConnectable,
  style,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.invisible}>
      <Handle
        isConnectable={isConnectable}
        position={position}
        style={style}
        type={type}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  invisible: {
    '& > .react-flow__handle': {
      backgroundColor: 'transparent',
      PointerEvents: 'none',
      border: 'none',
    },
    '& > .react-flow__handle.connectable': {
      cursor: 'not-allowed',
      PointerEvents: 'none',
    },
  },
}));

export default React.memo(HiddenHandle);
