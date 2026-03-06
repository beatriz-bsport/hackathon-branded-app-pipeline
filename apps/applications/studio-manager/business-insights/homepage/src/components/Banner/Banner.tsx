import { type FC, useState } from "react";

import { Body, Button, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type BannerProps = {
  ctaLabel: string;
  description: string;
  identifier: string;
  image: string;
  onCTAClick: () => void;
  title: string;
};

const getBannerIdentifier = (identifier: string) => {
  return `bsport:banner:${identifier}`;
};

function getBannerHasBeenCleared(bannerIdentifier: string) {
  try {
    return !!localStorage.getItem(bannerIdentifier);
  } catch (_error) {
    console.warn("[Homepage] Could not get identifier from localStorage");
    return false;
  }
}

function setBannerHasBeenCleared(bannerIdentifier: string) {
  try {
    localStorage.setItem(bannerIdentifier, String(true));
  } catch (_error) {
    console.warn("[Homepage] Could not set identifier in localStorage");
  }
}

export const Banner: FC<BannerProps> = ({
  ctaLabel,
  description,
  identifier,
  image,
  onCTAClick,
  title,
}) => {
  const { t } = useTranslation("default");
  const [isShowing, setIsShowing] = useState(true);
  const bannerIdentifier = getBannerIdentifier(identifier);

  const hasBeenCleared = getBannerHasBeenCleared(bannerIdentifier);
  if (!isShowing || hasBeenCleared) return null;

  const onCrossClick = () => {
    setBannerHasBeenCleared(bannerIdentifier);
    setIsShowing(false);
  };

  return (
    <div
      className={[
        "relative",
        "rounded-xl w-full max-w-full",
        "bg-no-repeat bg-cover bg-center",
        "bg-[image:var(--bg-url)]",
        "overflow-hidden",
      ].join(" ")}
      style={{ "--bg-url": `url("${image}")` }}
    >
      {/* Grid layout: left column expands, right column for close button */}
      <div className="grid grid-cols-[1fr_auto] gap-md p-lg">
        {/* Left column: Content stacked vertically */}
        <div className="flex min-w-0 flex-col justify-center gap-sm">
          <Title
            htmlVariant="h2"
            weight="stronger"
            className="line-clamp-2 break-words max-w-[260px] md:max-w-[450px]"
          >
            {title}
          </Title>
          {description && (
            <Body className="line-clamp-2 break-words max-w-[260px] md:max-w-[450px]">
              {description}
            </Body>
          )}
          <div className="mt-2xs">
            <Button
              intent="call-to-action"
              label={ctaLabel}
              color="main"
              size="md"
              onClick={onCTAClick}
            />
          </div>
        </div>

        {/* Right column: Close button aligned to top */}
        <div className="flex items-start">
          <Button
            onClick={onCrossClick}
            kind="icon-button"
            icon="x-close"
            label={t("banner.close")}
            size="md"
            intent="flat"
            color="main"
          />
        </div>
      </div>
    </div>
  );
};
