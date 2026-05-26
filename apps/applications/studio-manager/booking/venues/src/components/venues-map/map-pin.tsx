import { type DivIcon, type Icon, divIcon } from "leaflet";
import { type FC, type ReactNode, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import type { LatLng } from "./map";

const PIN_SVG = `
<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="currentColor"/>
  <circle cx="14" cy="14" r="6" fill="var(--kz-color-surface-default-elevated-rest, #ffffff)"/>
</svg>
`.trim();

const DEFAULT_PIN_CLASSNAME = "text-onsurface-main-strong";

const DEFAULT_ICON = divIcon({
  html: PIN_SVG,
  className: DEFAULT_PIN_CLASSNAME,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

export type MapPinProps = {
  position: LatLng;
  icon?: Icon | DivIcon;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
};

export const MapPin: FC<MapPinProps> = ({
  position,
  icon,
  className,
  onClick,
  children,
}) => {
  const resolvedIcon = useMemo(() => {
    if (icon) return icon;
    if (!className) return DEFAULT_ICON;
    return divIcon({
      html: PIN_SVG,
      className,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -36],
    });
  }, [icon, className]);

  return (
    <Marker
      icon={resolvedIcon}
      position={position}
      eventHandlers={onClick ? { click: onClick } : undefined}
    >
      {children !== undefined && <Popup>{children}</Popup>}
    </Marker>
  );
};

MapPin.displayName = "KaizenMapPin";
