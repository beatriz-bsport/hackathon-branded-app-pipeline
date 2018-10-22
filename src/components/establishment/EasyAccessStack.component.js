// @flow

import React from 'react';

import { getEasyAccessOptions } from 'bsport-commons/lib/colors';

// eslint-disable-next-line
import './easy-access-stack.scss';

// eslint-disable-next-line
type Props = { name: string, lines: string[], size: 'xs' | 'md' };

export function EasyAccessStack(props: Props) {
  const { name, lines } = props;
  return (
    <div className={`easy-access-stack -${props.size}`} title={name}>
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
  // eslint-disable-next-line
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
