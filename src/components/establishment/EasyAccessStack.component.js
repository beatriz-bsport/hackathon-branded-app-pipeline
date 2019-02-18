// @flow

import React from 'react';

import { getEasyAccessOptions } from 'bsport-commons/lib/colors';

// eslint-disable-next-line
import './easy-access-stack.scss';

type Props = {
  name: string,
  lines: string[],
  size?: 'xs' | 'md',
};

export function EasyAccessStack(props: Props) {
  const { name, lines, size } = props;
  return (
    <div
      className={`easy-access-stack -${size}`}
      title={name}
      style={{
        fontSize: size === 'xs' ? '10px' : null,
      }}
    >
      <div className="stack">
        {lines.map((line) => (
          <LineBubble key={line} id={line} />
        ))}
      </div>
      {name}
    </div>
  );
}

EasyAccessStack.defaultProps = {
  size: 'md',
};

export default EasyAccessStack;

type LineBubbleProps = {
  id: string,
};
function LineBubble(props: LineBubbleProps) {
  const options = getEasyAccessOptions(props.id);
  if (!options) {
    return null; // FIXME
  }
  return (
    <div
      className="line-bubble"
      style={{
        backgroundColor: options.bgColor,
        color: options.color,
      }}
    >
      {options.name}
    </div>
  );
}
