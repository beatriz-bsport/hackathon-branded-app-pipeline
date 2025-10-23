import type { FC } from "react";

import { Body, Card, Media } from "@bsport/kaizen-primitive-core";

type ExploreCardProps = {
  imageUrl: string;
  link: string;
  title: string;
  description: string;
};

export const ExploreCard: FC<ExploreCardProps> = ({
  imageUrl,
  title,
  description,
  link,
}) => {
  return (
    <Card elevated padding="none">
      <a href={link} rel="noopener noreferrer" target="_blank">
        <div className="flex flex-row items-center w-full h-full px-md py-sm">
          <Media
            alt={title}
            src={imageUrl}
            size="sm"
            className="mr-md shadow-sm"
            ratio="1:1"
            width={48}
          />
          <div>
            <Body weight="strong" size="lg">
              {title}
            </Body>
            <Body weight="weak" size="md" color="weak">
              {description}
            </Body>
          </div>
        </div>
      </a>
    </Card>
  );
};
