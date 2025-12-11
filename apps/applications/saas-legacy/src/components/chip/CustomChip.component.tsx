import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createTheme from '@material-ui/core/styles/createTheme';
import useTheme from '@material-ui/core/styles/useTheme';
import { MuiThemeProvider, alpha } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import MuiIcon from '#src/components/MuiIcon.component';
import ToolTip from '#src/components/Tooltip.component';

type StylesProps = {
  mainColor?: string;
  iconColor?: string;
  maxWidth?: string;
};

export type CustomChipProps = {
  displayedValue: string;
  icon?: string;
  chipClass?: string;
  withBackground?: boolean;
  withBackgroundOnHover?: boolean;
  blackText?: boolean;
  disabled?: boolean;
  toolTip?: boolean;
  toolTipValue?: string;
  onDelete?: () => void;
} & StylesProps;

type ChipWrapperProps = {
  toolTip: boolean;
  toolTipValue: string;
  displayedValue: string;
  children: React.ReactElement;
};

/**
 * Generates the text and background colors for the chip.
 *
 * @param {Theme} theme - Mui theme.
 * @param {string} mainColor - The global and main color of the chip.
 * @param {boolean} withBackground - True if there is a background.
 * @param {boolean} blackText - True if the text color is black.
 * @param {boolean} disabled - True for having a grey text color if blackText.
 *
 * @returns {backgroundColor: string, textColor: string} - Returns a string tuple containing backgroundColor and textColor
 */
const _getColor = (
  theme: Theme,
  mainColor?: string,
  withBackground?: boolean,
  blackText?: boolean,
  disabled?: boolean,
) => {
  const blackTextColor = disabled
    ? theme.palette.grey[600]
    : theme.palette.common.black;

  const textColor = blackText
    ? blackTextColor
    : mainColor || theme.palette.grey[900];

  const backgroundColor = alpha(
    mainColor || theme.palette.grey[900],
    withBackground ? 0.1 : 0,
  );

  return { backgroundColor, textColor };
};

/**
 * Wrapper component designed to attach a tooltip to the chip component.
 *
 * @param {boolean} toolTip - Enables the tooltip to appear when the mouse is over the chip, displaying the displayedValue.
 * @param {string} toolTipValue - The text shown in the chip's tooltip when the mouse is over it. Overrides the toolTip prop.
 * @param {string} displayedValue - The text value displayed in the chip.
 * @param {React.ReactElement} children - The element to which the tooltip will be added.
 */
const ChipWrapper: React.FC<ChipWrapperProps> = React.memo(
  ({ toolTip, toolTipValue, children, displayedValue }) => {
    if (toolTip || !!toolTipValue) {
      return (
        <ToolTip title={toolTipValue || displayedValue}>{children}</ToolTip>
      );
    }
    return <>{children}</>;
  },
);

/**
 * Customizable chip component.
 *
 * @remarks
 * This component is an abstract custom chip.
 * Its basic look is a monochrome chip, with a light background color the
 * same shade as its text color, and with the possibility to add an icon.
 *
 * @example
 * ```typescript
 * import { CustomChip } from './CustomChip';
 *
 * // Use it as ReactElement :
 *  <CustomChip displayedValue="string" />
 * ```
 *
 * @param {string} displayedValue - The text value displayed in the chip.
 * @param {string} icon - The name of the icon displayed on the left side of the chip. If null, no icon will be shown.
 * @param {string} chipClass - The custom class applied to the chip.
 * @param {boolean} withBackground - Determines if the chip has a background. Sets to true by default.
 * @param {boolean} withBackgroundOnHover - Controls the chip's background display on mouse-over event. Overrides the withBackground prop.
 * @param {boolean} blackText - Sets the chip's text color to black if true.
 * @param {boolean} disabled - Sets the chip's text color to grey if true and blackText.
 * @param {boolean} toolTip - Enables the tooltip to appear when the mouse is over the chip, displaying the displayedValue.
 * @param {string} toolTipValue - The text shown in the chip's tooltip when the mouse is over it. Overrides the toolTip prop.
 * @param {string} mainColor - The main color of the chip (text and icon), used for background color computation. If null, the chip will be grey.
 * @param {string} iconColor - The custom color for the icon, if different from mainColor.
 * @param {string} maxWidth - The maximum width of the chip. If the displayedValue is too long, an ellipsis will be used to truncate it.
 */
export const CustomChip: React.FC<CustomChipProps> = ({
  displayedValue,
  icon,
  chipClass,
  withBackground = true,
  withBackgroundOnHover,
  blackText,
  disabled,
  toolTip,
  toolTipValue,
  mainColor,
  iconColor,
  maxWidth,
  onDelete,
}) => {
  const classes = useStyles({ iconColor, mainColor, maxWidth });

  const [isBackgroundDisplayed, setIsBackgroundDisplayed] = useState(false);

  /**
   * Displays the background on mouse enter event.
   * @type {React.MouseEventHandler<HTMLDivElement>}
   */
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsBackgroundDisplayed(true);
    },
    [],
  );

  /**
   * Hides the background on mouse leave event.
   * @type {React.MouseEventHandler<HTMLDivElement>}
   */
  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsBackgroundDisplayed(false);
    },
    [],
  );

  const defaultTheme = useTheme();

  const { backgroundColor, textColor } = useMemo(
    () =>
      _getColor(
        defaultTheme,
        mainColor,
        withBackgroundOnHover ? isBackgroundDisplayed : withBackground,
        blackText,
        disabled,
      ),
    [
      blackText,
      disabled,
      defaultTheme,
      isBackgroundDisplayed,
      mainColor,
      withBackground,
      withBackgroundOnHover,
    ],
  );

  const theme = useMemo(
    () =>
      backgroundColor
        ? createTheme({
            palette: {
              primary: {
                main: backgroundColor,
                contrastText: textColor,
              },
            },
          })
        : defaultTheme,
    [backgroundColor, defaultTheme, textColor],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <div
        className={classes.outerDiv}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ChipWrapper
          displayedValue={displayedValue}
          toolTip={toolTip}
          toolTipValue={toolTipValue}
        >
          <Chip
            className={clsx(classes.chip, chipClass)}
            color="primary"
            icon={
              icon ? <MuiIcon className={classes.icon} icon={icon} /> : null
            }
            label={displayedValue}
            onDelete={onDelete || null}
            size="small"
            variant="default"
          />
        </ChipWrapper>
      </div>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    color: ({ iconColor, mainColor }) =>
      iconColor ?? mainColor ?? theme.palette.grey[900],
  },
  chip: {
    borderRadius: theme.spacing(0.5),
    maxWidth: ({ maxWidth }) => maxWidth || null,
  },
  outerDiv: { display: 'flex', overflow: 'auto' },
}));

export default React.memo(CustomChip);
