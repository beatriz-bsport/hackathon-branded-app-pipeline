import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { useTheme } from '@material-ui/core';
import '#src/components/css-only/Login/LoginBackground.css';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

type Props = {
  company?: boolean;
  franchise?: boolean;
  backgroundFixed?: boolean;
  children?: ReactElement;
};

const effectArray = ['ball1', 'ball2', 'ball3', 'ball4']
  .map((effect) => ({ effect, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ effect }) => effect);

export const LoginBackgroundComponent: React.FC<Props> = ({
  company,
  franchise,
  backgroundFixed,
  children,
}) => {
  const theme = useTheme();

  const loginBackgroundClass = backgroundFixed
    ? 'bs-login-background--fixed'
    : 'bs-login-background--default';

  const darkClass =
    franchise || company
      ? 'bs-login-background__dark--company'
      : 'bs-login-background__dark--default';
  const lightClass =
    franchise || company
      ? 'bs-login-background__light--company'
      : 'bs-login-background__light--default';

  return (
    <div className={loginBackgroundClass}>
      {!!children && children}
      <div
        className={classNames(
          'bs-login-background__circle',
          darkClass,
          'bs-login-background__size-2',
          effectArray[0],
        )}
      />
      <div
        className={classNames(
          'bs-login-background__circle',
          darkClass,
          'bs-login-background__size-3',
          'bs-login-background__left',
          effectArray[2],
        )}
      />
      <div
        className={classNames(
          'bs-login-background__circle',
          lightClass,
          'bs-login-background__size-6',
          'bigBall',
        )}
      />
      <div
        className={classNames(
          'bs-login-background__circle',
          lightClass,
          'bs-login-background__size-1',
        )}
      />
      <div
        className={classNames(
          'bs-login-background__circle',
          lightClass,
          'bs-login-background__size-3',
          'bs-login-background__right',
        )}
      />
      <div
        className={classNames(
          'bs-login-background__circle',
          lightClass,
          'bs-login-background__size-4',
          effectArray[1],
        )}
      />
      <div
        className={classNames(
          'bs-login-background__circle',
          darkClass,
          'bs-login-background__size-5',
          effectArray[3],
        )}
      />
      <div className={classNames('bs-login-background__svg', 'svgMove')}>
        <svg
          fill="none"
          height="295"
          viewBox="0 0 911 295"
          width="911"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M335 203C565 209 863.5 212.5 910.5 294.5H0V0.5C34 50 105 197 335 203Z"
            fill={
              company || franchise
                ? theme?.palette.primary.main
                : 'rgba(44, 118, 126)'
            }
            fillOpacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};

export const LoginBackGroundComponentForStoryBook = marketplaceCssHoc()(
  LoginBackgroundComponent,
);

export default React.memo(LoginBackgroundComponent);
