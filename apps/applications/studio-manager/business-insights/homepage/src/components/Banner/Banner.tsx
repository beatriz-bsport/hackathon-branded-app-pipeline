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
  } catch (error) {
    console.warn("[Homepage] Could not get identifier from localStorage");
    return false;
  }
}

function setBannerHasBeenCleared(bannerIdentifier: string) {
  try {
    localStorage.setItem(bannerIdentifier, String(true));
  } catch (error) {
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
        "rounded-xl flex flex-col w-full items-start p-md",
        "bg-no-repeat bg-cover",
        "bg-[image:var(--bg-url)]",
      ].join(" ")}
      style={{ "--bg-url": `url(${image})` }}
    >
      <div className="flex flex-row justify-between gap-md w-full">
        <Title htmlVariant="h2" weight="stronger">
          {title}
        </Title>
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
      {description && <Body className="mt-2xs">{description}</Body>}
      <Button
        intent="call-to-action"
        label={ctaLabel}
        color="main"
        size="md"
        onClick={onCTAClick}
        className="mt-lg"
      />
    </div>
  );
};
