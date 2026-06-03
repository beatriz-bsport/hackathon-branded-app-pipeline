import { Divider, useMatchMedia } from "@bsport/kaizen-primitive-core";

export const WidgetsSettingsGeneralShell = () => {
  const isMobileLayout = !useMatchMedia("lg");
  const layoutClassName = isMobileLayout
    ? "grid min-h-full grid-cols-1"
    : // Desktop 40% 60% grid (Left settings, Right preview widget)
      "grid min-h-full grid-cols-[minmax(400px,2fr)_1px_minmax(0,3fr)]";

  return (
    <div className={layoutClassName}>
      {/*settings col*/}
      <section className="flex min-w-0 flex-col gap-md"></section>
      {!isMobileLayout && (
        <Divider weight="extra-thin" orientation="vertical" />
      )}
      {/*preview col*/}
      <section className="min-w-0"></section>
    </div>
  );
};
