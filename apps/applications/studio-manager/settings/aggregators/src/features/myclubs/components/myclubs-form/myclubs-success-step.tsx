import type { FC } from "react";

import {
  Body,
  Button,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";

import { Trans } from "#src/utils/i18n";

const MYCLUBS_PORTAL_URL = "https://partner.myclubs.com/integrations";

type Props = {
  externalId: string;
};

export const MyclubsSuccessStep: FC<Props> = ({ externalId }) => {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-md">
      <Body size="md" color="weak">
        <Trans
          i18nKey="myclubs.modal.success.helper"
          components={[
            <a
              key="portal-link"
              href={MYCLUBS_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            />,
          ]}
        />
      </Body>
      <Button
        kind="default"
        iconLeft="copy-07"
        label={externalId}
        intent="flat"
        color="default"
        size="sm"
        onClick={() => copyToClipboard(externalId)}
      />
    </div>
  );
};
