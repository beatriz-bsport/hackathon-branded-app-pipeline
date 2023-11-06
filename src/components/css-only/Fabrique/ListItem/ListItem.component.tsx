import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import type { ListItemSize, ListItemType } from './types';

import { ListItemSizeEnum, ListItemTypeEnum } from './constants';
import RadioButton from '#Fabrique/RadioButtonV2';
import Checkbox from '#Fabrique/Checkbox';

import './styles.css';

type Props = {
  isDisabled?: boolean;
  label: string;
  size?: ListItemSize;
  className?: string;
  classes?: {
    label?: string;
    captionText?: string;
    button?: string;
    icon?: string;
    textWrapper?: string;
    wrapper?: string;
    container?: string;
    radio?: string;
    checkbox?: string;
  };
  onClick?: () => void;
  isRippleEnabled?: boolean;
  captionText?: string;
  isSelected?: boolean;
  icon?: React.ReactNode;
  type?: ListItemType;
  inputId?: string;
};

// TO BE USED WITH <List> for valid HTML structure
export const ListItem: React.FC<Props> = ({
  isDisabled,
  label,
  classes,
  className,
  onClick,
  isRippleEnabled,
  icon,
  captionText,
  isSelected,
  type = ListItemTypeEnum.TEXT,
  size = ListItemSizeEnum.LG,
  inputId,
}) => {
  const isSmall = size === ListItemSizeEnum.SM;
  if (type !== ListItemTypeEnum.TEXT) {
    return (
      <li
        className={classNames(
          'bs-fabrique-listitem__root',
          {
            'bs-fabrique-listitem__radio--selected':
              isSelected && type === ListItemTypeEnum.RADIO,
          },
          className,
        )}
      >
        <ButtonBase
          className={classNames(
            'bs-fabrique-listitem__button',
            { 'bs-fabrique-listitem__root--spacing--sm': isSmall },
            { 'bs-fabrique-listitem__root--spacing--lg': !isSmall },
            classes?.button,
          )}
          isDisabled={isDisabled}
          isRippleEnabled={isRippleEnabled}
          onClick={onClick}
          type="button"
        >
          <div
            className={classNames(
              'bs-fabrique-listitem__wrapper',
              classes?.wrapper,
            )}
          >
            <div
              className={classNames(
                'bs-fabrique-listitem__container',
                classes?.container,
              )}
            >
              {type === ListItemTypeEnum.RADIO && (
                <RadioButton
                  captionText={captionText}
                  classes={{
                    label: classNames(
                      'bs-fabrique-listitem__label',
                      classes?.label,
                    ),
                    captionText: classNames(
                      'bs-fabrique-listitem__captiontext',
                      classes?.captionText,
                    ),
                  }}
                  className={classNames(
                    'bs-fabrique-listitem__radio',
                    classes?.radio,
                  )}
                  id={inputId}
                  isChecked={isSelected}
                  isDisabled={isDisabled}
                  isInversed={isSelected}
                  label={label}
                  onClick={onClick}
                  size={isSmall ? 'sm' : 'lg'}
                />
              )}
              {type === ListItemTypeEnum.CHECKBOX && (
                <Checkbox
                  captionText={captionText}
                  classes={{
                    label: classNames(
                      'bs-fabrique-listitem__label',
                      {
                        'bs-fabrique-listitem__checkbox__label--selected':
                          isSelected,
                      },
                      classes?.label,
                    ),
                    captionText: classNames(
                      'bs-fabrique-listitem__captiontext',
                      classes?.captionText,
                    ),
                  }}
                  className={classNames(
                    'bs-fabrique-listitem__checkbox',
                    classes?.checkbox,
                  )}
                  id={inputId}
                  isChecked={isSelected}
                  isDisabled={isDisabled}
                  label={label}
                  onClick={onClick}
                  size={isSmall ? 'sm' : 'lg'}
                />
              )}
            </div>
          </div>
        </ButtonBase>
      </li>
    );
  }
  return (
    <li
      className={classNames(
        'bs-fabrique-listitem__root',
        { 'bs-fabrique-listitem__root--spacing--sm': isSmall },
        { 'bs-fabrique-listitem__root--spacing--lg': !isSmall },
        className,
      )}
    >
      <div
        className={classNames(
          'bs-fabrique-listitem__wrapper',
          classes?.wrapper,
        )}
      >
        <div
          className={classNames(
            'bs-fabrique-listitem__container',
            classes?.container,
          )}
        >
          <span
            className={classNames(
              'bs-fabrique-listitem__icon',
              {
                'bs-fabrique-listitem__icon--sm': isSmall,
                'bs-fabrique-listitem__icon--lg': !isSmall,
                'bs-fabrique-listitem__icon--hidden': !icon,
              },
              classes?.icon,
            )}
          >
            {icon}
          </span>

          <div
            className={classNames(
              'bs-fabrique-listitem__textwrapper',
              classes?.textWrapper,
            )}
          >
            <Typography
              align="left"
              className={classNames(
                'bs-fabrique-listitem__label',
                classes?.label,
              )}
              variant={isSmall ? 'body-sm' : 'body-md'}
            >
              {label}
            </Typography>
            <Typography
              align="left"
              className={classNames(
                'bs-fabrique-listitem__captiontext',
                classes?.captionText,
              )}
              variant="body-xs"
            >
              {captionText}
            </Typography>
          </div>
        </div>
      </div>
    </li>
  );
};

export const ListItemStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ListItem>>()(ListItem);

export default memo(ListItem);
