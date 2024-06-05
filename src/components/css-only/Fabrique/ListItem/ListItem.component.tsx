import React, { memo } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import RadioButton from '#Fabrique/RadioButtonV2';
import Checkbox from '#Fabrique/Checkbox';
import type { ListItemSize, ListItemType } from './types';

import { ListItemSizeEnum, ListItemTypeEnum } from './constants';

import './styles.css';

type Props = {
  isDisabled?: boolean;
  /**
   * The ReactNode type enables, among other things, getting i18next <Trans/> component.
   * This component is meant to manage specific bold or italic words inside a text.
   */
  label: string | React.ReactElement;
  size?: ListItemSize;
  className?: string;
  classes?: {
    label?: string;
    captionText?: string;
    button?: string;
    icon?: string;
    textWrapper?: string;
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
  rightSlot?: React.ReactElement;
};

type ListItemTextProps = Required<
  Pick<Props, 'label' | 'classes' | 'icon' | 'captionText'>
> & { isSmall: boolean };

const ListItemTextContainer: React.FC<ListItemTextProps> = ({
  label,
  classes,
  icon,
  captionText,
  isSmall,
}) => (
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
        className={classNames('bs-fabrique-listitem__label', classes?.label)}
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
);

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
  rightSlot,
}) => {
  const isSmall = size === ListItemSizeEnum.SM;
  if (type === ListItemTypeEnum.CLICKABLETEXT) {
    return (
      <li
        className={classNames(
          'bs-fabrique-listitem__root',
          {
            'bs-fabrique-listitem__root--selected': isSelected,
          },
          { 'bs-fabrique-listitem__root--spacing--sm': isSmall },
          { 'bs-fabrique-listitem__root--spacing--lg': !isSmall },
          className,
        )}
      >
        <ButtonBase
          className={classNames(
            'bs-fabrique-listitem__button-clickable-text',
            classes?.button,
          )}
          isRippleEnabled={isRippleEnabled}
          onClick={onClick}
        >
          <ListItemTextContainer
            captionText={captionText}
            classes={{
              ...classes,
              label: classNames(
                classes?.label,
                'bs-fabrique-listitem__clickable-text__label',
                {
                  'bs-fabrique-listitem__clickable-text__label--selected':
                    isSelected,
                },
              ),
            }}
            icon={icon}
            isSmall={isSmall}
            label={label}
          />
        </ButtonBase>
      </li>
    );
  }

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
        </ButtonBase>
        <div
          className={classNames('bs-fabrique-listitem__root__right-slot', {
            'bs-fabrique-listitem__root__right-slot--hidden': !rightSlot,
          })}
        >
          {rightSlot}
        </div>
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
      <ListItemTextContainer
        captionText={captionText}
        classes={classes}
        icon={icon}
        isSmall={isSmall}
        label={label}
      />
      <div
        className={classNames('bs-fabrique-listitem__root__right-slot', {
          'bs-fabrique-listitem__root__right-slot--hidden': !rightSlot,
        })}
      >
        {rightSlot}
      </div>
    </li>
  );
};

export const ListItemStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ListItem>>()(ListItem);

export default memo(ListItem);
