import type { FC } from "react";

type AggregatorLogoProps = {
  src: string;
  alt: string;
};

export const AggregatorLogo: FC<AggregatorLogoProps> = ({ src, alt }) => (
  <img src={src} alt={alt} className="object-contain h-full w-auto" />
);
