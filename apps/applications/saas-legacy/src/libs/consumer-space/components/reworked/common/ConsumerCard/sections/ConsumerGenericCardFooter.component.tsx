import React from 'react';

import clsx from 'clsx';

import Button from '#Fabrique/ButtonV2';
import Menu from '#Fabrique/Menu';
import MenuItem from '#Fabrique/MenuItem';
import Typography from '#Fabrique/Typography';
import { DotsVertical } from '#src/components/untitledui';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';

import '../styles.css';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';
import { BottomDrawer } from '#src/components/css-only/Fabrique/BottomDrawer/BottomDrawer.component';
import { useTranslation } from 'react-i18next';

type Props = {
  className?: string;
  isMobile?: boolean;
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
  /** An optional title for the bottom drawer of extra actions in the card footer. Defaults to "More actions" */
  bottomDrawerTitle?: string;
};

const ConsumerGenericCardFooter: React.FC<Props> = ({
  isMobile,
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
  bottomDrawerTitle,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common']);

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

  const handleMenuOptionClick = React.useCallback(
    (onOptionClick: () => void) => () => {
      onOptionClick?.();
      handleOnMenuClose?.();
    },
    [handleOnMenuClose],
  );

  return (
    <div className={clsx('bs-consumer__generic-card__footer', className)}>
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

      {!!menuId && !isMobile && (
        <Menu
          anchorEl={anchorEl}
          className={clsx('bs-consumer-generic-card__menu', menuClassName)}
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
                  onClick={handleMenuOptionClick(onClick)}
                />
              ),
          )}
        </Menu>
      )}
      {!!menuId && isMobile && (
        <PortalContainer wrapperId={menuId}>
          <BottomDrawer
            blanketProps={{
              isOpen: isButtonMenuOpened,
              onClick: handleOnMenuClose,
            }}
            className={clsx(
              'bs-consumer-generic-card__bottom-drawer',
              menuClassName,
            )}
            modalDialogProps={{
              title:
                bottomDrawerTitle ?? t('consumerSpace:reworked.moreActions'),
              onClose: handleOnMenuClose,
              onCancel: handleOnMenuClose,
              cancelLabel: t('common:back'),
            }}
          >
            {(menuItemsList || []).map(
              ({
                label,
                leftIcon,
                onClick,
                shouldDisplay,
                menuItemClassName,
              }) =>
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
          </BottomDrawer>
        </PortalContainer>
      )}
    </div>
  );
};

export default React.memo(ConsumerGenericCardFooter);
