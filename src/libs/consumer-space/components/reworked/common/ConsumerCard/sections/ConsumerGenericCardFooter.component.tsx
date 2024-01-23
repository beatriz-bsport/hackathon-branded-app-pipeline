import React from 'react';

import classNames from 'classnames';

import Button from '#Fabrique/ButtonV2';
import Menu from '#Fabrique/Menu';
import MenuItem from '#Fabrique/MenuItem';
import Typography from '#Fabrique/Typography';
import { DotsVertical } from '#components/untitledui';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';

import '../styles.css';

type Props = {
  className?: string;
  secondaryButtonsHidden?: boolean;
  secondaryButtonsList?: {
    shouldDisplay: boolean;
    color: ButtonColor;
    onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    leftIcon?: React.ReactNode;
    variant: ButtonVariant;
    isDisabled: boolean;
    label: string;
    buttonClassName: string;
    typographyClassName: string;
  }[];
  mainButtonsList: {
    shouldDisplay: boolean;
    color: ButtonColor;
    onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    leftIcon?: React.ReactNode;
    variant: ButtonVariant;
    isDisabled: boolean;
    label: string;
    buttonClassName: string;
    typographyClassName: string;
  }[];
  menuButtonLabel?: string;
  isMenuButtonDisabled?: boolean;
  menuItemsList?: {
    menuItemClassName: string;
    shouldDisplay: boolean;
    label: string;
    leftIcon: React.ReactNode;
    onClick: (
      event?: React.MouseEvent<
        HTMLButtonElement | HTMLInputElement,
        MouseEvent
      >,
    ) => void;
  }[];
  menuId?: string;
  menuClassName?: string;
  menuButtonClassName?: string;
};

const ConsumerGenericCardFooter: React.FC<Props> = ({
  secondaryButtonsHidden,
  secondaryButtonsList,
  mainButtonsList,
  menuButtonLabel,
  menuButtonClassName,
  isMenuButtonDisabled,
  menuItemsList,
  className,
  menuId,
  menuClassName,
}) => {
  const [isButtonMenuOpened, setIsButtonMenuOpened] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

  const handleMoreClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsButtonMenuOpened(true);
      const eventCurrentTarget = event.currentTarget;
      setAnchorEl(eventCurrentTarget);
    },
    [],
  );
  const handleOnMenuClose = React.useCallback(() => {
    setIsButtonMenuOpened(false);
    setAnchorEl(null);
  }, []);

  return (
    <div className={classNames('bs-consumer__generic-card__footer', className)}>
      {secondaryButtonsHidden && (
        <Button
          className={menuButtonClassName}
          color="grey"
          isDisabled={isMenuButtonDisabled}
          leftIcon={<DotsVertical stroke="currentColor" />}
          onClick={handleMoreClick}
          size="md"
          variant="outlined"
        >
          <Typography align="center" variant="body-md">
            {menuButtonLabel}
          </Typography>
        </Button>
      )}

      {!secondaryButtonsHidden &&
        (secondaryButtonsList || []).map(
          ({
            color,
            isDisabled,
            onClick,
            leftIcon,
            variant,
            label,
            buttonClassName,
            typographyClassName,
            shouldDisplay,
          }) =>
            shouldDisplay && (
              <Button
                key={`${buttonClassName}-${typographyClassName}-${variant}`}
                className={buttonClassName}
                color={color}
                isDisabled={isDisabled}
                leftIcon={leftIcon}
                onClick={onClick}
                size="md"
                variant={variant}
              >
                <Typography
                  align="center"
                  className={typographyClassName}
                  variant="body-md"
                >
                  {label}
                </Typography>
              </Button>
            ),
        )}

      {(mainButtonsList || []).map(
        ({
          color,
          isDisabled,
          onClick,
          leftIcon,
          variant,
          label,
          buttonClassName,
          typographyClassName,
          shouldDisplay,
        }) =>
          shouldDisplay && (
            <Button
              key={`${color}-${variant}-${buttonClassName}-${typographyClassName}`}
              className={buttonClassName}
              color={color}
              isDisabled={isDisabled}
              leftIcon={leftIcon}
              onClick={onClick}
              size="md"
              variant={variant}
            >
              <Typography
                align="center"
                className={typographyClassName}
                variant="body-md"
              >
                {label}
              </Typography>
            </Button>
          ),
      )}
      {/* TODO: DISPLAY BOTTOMDRAWER IF ON MOBILE AND MENU IF ON DESKTOP */}
      {menuId && (
        <Menu
          anchorEl={anchorEl}
          className={classNames(
            'bs-consumer-generic-card__menu',
            menuClassName,
          )}
          id={menuId}
          isOpen={isButtonMenuOpened}
          onClose={handleOnMenuClose}
        >
          {/* TODO: DISABLE STATE FOR MENU ITEMS AND PUT FOR EACH MENUITEM HERE */}
          {(menuItemsList || []).map(
            ({ label, leftIcon, onClick, shouldDisplay, menuItemClassName }) =>
              shouldDisplay && (
                <MenuItem
                  key={`${menuItemClassName}-${label}`}
                  className={menuItemClassName}
                  label={label}
                  leftIcon={leftIcon}
                  onClick={onClick}
                />
              ),
          )}
        </Menu>
      )}
    </div>
  );
};

export default React.memo(ConsumerGenericCardFooter);
