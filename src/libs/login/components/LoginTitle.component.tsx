import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';

import './LoginTitleStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

type Props = {
  title: string;
  isCompany?: boolean;
  simplifyUI?: boolean;
};

export const LoginTitle: React.FC<Props> = ({
  title,
  isCompany,
  simplifyUI,
}) => {
  const rectangleBackgroundClass = isCompany
    ? 'bs-signup-title__rectangle-background--company'
    : 'bs-signup-title__rectangle-background--default';

  return (
    <div className="bs-signup-title">
      <div className="bs-signup-title__title">{title} </div>
      {!simplifyUI && (
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

export const LoginTitleCssHoc = compose<any, Props>(
  marketplaceCssHoc(),
  React.memo,
)(LoginTitle);

export default React.memo(LoginTitle);
