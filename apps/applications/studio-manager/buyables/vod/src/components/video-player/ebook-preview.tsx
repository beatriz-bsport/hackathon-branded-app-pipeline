import type { FC } from "react";

import { Icon } from "@bsport/kaizen-primitive-core";

type EbookPreviewProps = {
  alt: string;
  coverUrl: string;
};

export const EbookPreview: FC<EbookPreviewProps> = ({ alt, coverUrl }) => {
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative aspect-video w-full overflow-hidden rounded-sm bg-surface-default-weaker"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon
          icon="book-closed"
          size="xl"
          className="text-white"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
