import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import {
  colorEnum,
  placementEnum,
  placementToOrigins,
  TOOLTIP_DELAY,
  TOOLTIP_MARGIN,
} from './constants';
import type { Horizontal, Vertical } from '#Fabrique/Types';
import { usePopoverPositioning } from '#Fabrique/hooks';
import {
  HorizontalEnum,
  VerticalEnum,
  MARGIN_THRESHOLD,
  DELAY_DURATION,
} from '#Fabrique/constants';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Typography from '#Fabrique/Typography';
import './styles.css';

export type TooltipProps = {
  /** The id of the tooltip. */
  id: string;
  /** Tooltip contents. */
  children: React.ReactNode;
  /** Override or extend the styles applied to the tooltip. */
  className?: string;
  /** Override or extend the styles applied to the targeted element. */
  classes?: {
    targetedElement: string;
  };
  /** The text that will appear in the tooltip */
  text: string;
  /** The color of the tooltip. */
  color?: colorEnum;
  /**
   * The id used to identify the div element wrapping the tooltip
   * @default {'bs-fabrique-portal-container'}
   * */
  wrapperId?: string;
  /** The position of the tooltip relative to the anchor */
  placement?: placementEnum;
  /**
   * The id used to identify the DOM element where the tooltip will be rendered
   * @default {'bs-setup-variable'}
   * */
  targetElementId?: string;
  /** An optional string to set the class of the div element wrapping the tooltip */
  wrapperClass?: string;
  /** Refers to the x coordinate of the tooltip that will attach to the anchor's origin. */
  transformOriginHorizontal?: Horizontal;
  /** Refers to the y coordinate of the tooltip that will attach to the anchor's origin. */
  transformOriginVertical?: Vertical;
  /** Refers to the x coordinate on the anchor where the tooltip will attach to. */
  anchorOriginHorizontal?: Horizontal;
  /** Refers to the y coordinate on the anchor where the tooltip will attach to. */
  anchorOriginVertical?: Vertical;
};

const Tooltip: React.FC<TooltipProps> = ({
  id,
  children,
  text,
  classes,
  className,
  targetElementId,
  placement,
  wrapperId,
  wrapperClass,
  anchorOriginHorizontal = HorizontalEnum.CENTER,
  anchorOriginVertical = VerticalEnum.TOP,
  transformOriginHorizontal = HorizontalEnum.CENTER,
  transformOriginVertical = VerticalEnum.BOTTOM,
  color = colorEnum.WEAK,
}) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const [closeTimeoutId, setCloseTimeoutId] =
    React.useState<ReturnType<typeof setTimeout>>(null);

  let anchorHorizontal = anchorOriginHorizontal;
  let anchorVertical = anchorOriginVertical;
  let transformHorizontal = transformOriginHorizontal;
  let transformVertical = transformOriginVertical;
  if (placement) {
    const origins = placementToOrigins[placement];
    anchorHorizontal = origins.anchorOriginHorizontal;
    anchorVertical = origins.anchorOriginVertical;
    transformHorizontal = origins.transformOriginHorizontal;
    transformVertical = origins.transformOriginVertical;
  }
  const { isPositioned, setPositioningStyles, setPositionedToFalse } =
    usePopoverPositioning({
      margin: TOOLTIP_MARGIN,
      margin_threshold: MARGIN_THRESHOLD,
      ref: tooltipRef,
      isOpen,
      anchorEl,
      anchorOriginHorizontal: anchorHorizontal,
      anchorOriginVertical: anchorVertical,
      transformOriginHorizontal: transformHorizontal,
      transformOriginVertical: transformVertical,
    });

  const handleMouseEnter = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.FocusEvent<HTMLDivElement>,
    ) => {
      if (closeTimeoutId) {
        clearTimeout(closeTimeoutId);
        setCloseTimeoutId(null);
      }

      const currentTarget = event.currentTarget;
      setAnchorEl(currentTarget);
      setIsOpen(true);
    },
    [closeTimeoutId, setAnchorEl, setIsOpen],
  );

  const handleMouseLeave = React.useCallback(() => {
    setPositionedToFalse();
    const timeoutId = setTimeout(() => {
      setIsOpen(false);
      setAnchorEl(null);
    }, TOOLTIP_DELAY);

    setCloseTimeoutId(timeoutId);
  }, [setAnchorEl, setIsOpen, setPositionedToFalse]);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', handleMouseLeave);
    }
    return () => window.removeEventListener('scroll', handleMouseLeave);
  }, [handleMouseLeave, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(setPositioningStyles, DELAY_DURATION);
    } else {
      setPositionedToFalse();
    }
  }, [isOpen, setPositioningStyles, setPositionedToFalse]);

  return (
    <div
      id={id}
      onFocus={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseEnter}
    >
      <div className={classNames(classes, 'bs-fabrique-tooltip--children')}>
        {children}
      </div>
      {isOpen && (
        <PortalContainer
          targetElementId={targetElementId}
          wrapperClass={wrapperClass}
          wrapperId={wrapperId}
        >
          <div
            ref={tooltipRef}
            className={classNames(
              'bs-fabrique-tooltip',
              {
                'bs-fabrique-tooltip--positioned': isPositioned,
                'bs-fabrique-tooltip--strong-color': color === colorEnum.STRONG,
              },
              className,
            )}
          >
            <Typography
              className={classNames(
                'bs-fabrique-tooltip--weak-color-typography',
                {
                  'bs-fabrique-tooltip--strong-color-typography':
                    color === colorEnum.STRONG,
                },
              )}
            >
              {text}
            </Typography>
          </div>
        </PortalContainer>
      )}
    </div>
  );
};

export const TooltipStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Tooltip>>()(Tooltip);

export default React.memo(Tooltip);
