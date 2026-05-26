import { type FC } from "react";
import { useNavigate } from "react-router";

import {
  Body,
  Button,
  Chip,
  Divider,
  Loader,
  Title,
} from "@bsport/kaizen-primitive-core";

import { PassFlagChips } from "#src/components/class-detail/pass-flag-chips";
import type { CompatibilityLookup, CompatiblePass } from "#src/types";
import { PASSES_URL } from "#src/urls";
import {
  formatCompatibilitySections,
  formatOffPeakSchedule,
  formatPassPrice,
  hasAnyFlag,
} from "#src/utils/compatible-passes";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  pass: CompatiblePass;
  compatibilityLookup: CompatibilityLookup;
  isCompatibilityLookupLoading: boolean;
};

const Section: FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-xs">
    <Body size="sm" weight="weak" color="weak">
      {label}
    </Body>
    <div>{children}</div>
  </div>
);

export const CompatiblePassDetailContent: FC<Props> = ({
  pass,
  compatibilityLookup,
  isCompatibilityLookupLoading,
}) => {
  const { t, i18n } = useTranslation("class-detail");
  const navigate = useNavigate();

  const price = formatPassPrice(
    pass.price,
    t("classDetail.compatiblePasses.panel.free"),
  );

  const offPeakDays = formatOffPeakSchedule(
    pass.off_peak_schedule,
    i18n.language,
  );

  const compatibility = formatCompatibilitySections(
    pass,
    compatibilityLookup,
    t,
  );

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col gap-xs w-full">
          <div className="flex justify-between gap-lg w-full">
            <Title htmlVariant="h2" weight="strong">
              {pass.name}
            </Title>
            <div className="shrink-0">
              <Button
                intent="default"
                color="main"
                size="md"
                label={t("classDetail.compatiblePasses.panel.goToPass")}
                iconRight="link-external-02"
                onClick={() => navigate(`${PASSES_URL}/${pass.id}`)}
              />
            </div>
          </div>
          <Body color="weak" size="lg">
            {price}
          </Body>
        </div>
      </div>

      {hasAnyFlag(pass) && (
        <>
          <Divider orientation="horizontal" weight="thin" />
          <Section label={t("classDetail.compatiblePasses.panel.properties")}>
            <PassFlagChips pass={pass} />
          </Section>
        </>
      )}

      <Divider orientation="horizontal" weight="thin" />

      <Section label={t("classDetail.compatiblePasses.panel.credits")}>
        <Title htmlVariant="h5" weight="strong">
          {pass.unlimited || pass.credits === null
            ? t("classDetail.compatiblePasses.panel.creditsUnlimited")
            : t("classDetail.compatiblePasses.panel.creditsCount", {
                count: pass.credits,
              })}
        </Title>
      </Section>

      <Divider orientation="horizontal" weight="thin" />

      <Section label={t("classDetail.compatiblePasses.panel.compatibility")}>
        {isCompatibilityLookupLoading ? (
          <Loader size="md" />
        ) : compatibility.kind === "all" ? (
          <Title htmlVariant="h5" weight="strong">
            {compatibility.text}
          </Title>
        ) : (
          <div className="flex flex-col gap-xs">
            {compatibility.sections.map(({ heading, chips }) => (
              <div key={heading} className="flex flex-col gap-xs">
                <Title htmlVariant="h5" weight="strong">
                  {heading}
                </Title>
                {chips.length > 0 && (
                  <div className="flex gap-xs flex-wrap">
                    {chips.map((name) => (
                      <Chip
                        key={name}
                        type="weak"
                        color="default"
                        size="lg"
                        label={name}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {offPeakDays.length > 0 && (
        <>
          <Divider orientation="horizontal" weight="thin" />
          <Section label={t("classDetail.compatiblePasses.panel.offPeakOnly")}>
            <div className="flex flex-col gap-xs">
              {offPeakDays.map(({ day, ranges }) => (
                <div key={day} className="flex items-center gap-xs w-full">
                  <Body
                    className="w-2xl shrink-0"
                    color="weak"
                    weight="weak"
                    size="sm"
                  >
                    {day}
                  </Body>
                  <div className="flex gap-md flex-wrap">
                    {ranges.map((range) => (
                      <Body key={range} size="md" weight="weak">
                        {range}
                      </Body>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
};
