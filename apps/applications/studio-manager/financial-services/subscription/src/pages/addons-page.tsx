import type { FC } from "react";

import {
  Body,
  Card,
  ErrorFallback,
  Loader,
  Title,
} from "@bsport/kaizen-primitive-core";

import AvailableAddonCard from "#src/components/available-addon-card";
import SubscribedAddonCard from "#src/components/subscribed-addon-card";
import { usePackData } from "#src/hooks/use-pack-data";
import { useTranslation } from "#src/utils/i18n";

const AddonsPage: FC = () => {
  const { t } = useTranslation("subscription");
  const { subscribedPacks, availablePacks, isLoading, isError, refetch } =
    usePackData();

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <span>{t("addons.loading")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorFallback
          actionProps={{ onClick: refetch, label: t("addons.retry") }}
          description={t("addons.error")}
        />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col p-md w-full max-w-component-content-centered m-auto gap-md">
      <section className="flex flex-col gap-sm">
        <div>
          <Title htmlVariant="h2" weight="strong">
            {t("addons.your-addons")}
          </Title>
          <Body color="weak">
            {/* @ts-expect-error type system doesnt consider this as a valid key */}
            {t("addons.your-addons-subtitle", {
              count: subscribedPacks.length,
            })}
          </Body>
        </div>
        <div className="flex flex-col gap-sm">
          {subscribedPacks.map((pack) => (
            <SubscribedAddonCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-sm">
        <div>
          <Title htmlVariant="h2" weight="strong">
            {t("addons.available-addons")}
          </Title>
          <Body color="weak">{t("addons.available-addons-subtitle")}</Body>
        </div>
        {availablePacks.length === 0 ? (
          <Card>
            <Body color="weak">
              {t("addons.available-addons-all-subscribed")}
            </Body>
          </Card>
        ) : (
          <div className="grid gap-sm lg:grid-cols-2">
            {availablePacks.map((pack) => (
              <AvailableAddonCard key={pack.id} pack={pack} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AddonsPage;
