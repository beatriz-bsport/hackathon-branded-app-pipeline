import React from 'react';
import classNames from 'classnames';

import './LoginTitleStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

type Props = {
  title: string;
  company?: boolean;
  simplifyUI?: boolean;
};

export const LoginTitle = (props: Props) => {
  const { title } = props;

  const rectangleBackgroundClass = props.company
    ? 'bs-signup-title__rectangle-background--company'
    : 'bs-signup-title__rectangle-background--default';

  return (
    <div className="bs-signup-title">
      <div className="bs-signup-title__title">{title} </div>
      {!props.simplifyUI && (
        <div
          className={classNames(
            'bs-signup-title__rectangle',
            rectangleBackgroundClass,
          )}
        />
      )}
    </div>
  );
};

// @ts-expect-error
export const LoginTitleCssHoc = marketplaceCssHoc()(LoginTitle);

export default React.memo(LoginTitle);
