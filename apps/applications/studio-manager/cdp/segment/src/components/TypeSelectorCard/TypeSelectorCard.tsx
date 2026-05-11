import {
  Body,
  Card,
  Chip,
  Icon,
  type IconName,
  Title,
  type VariantProps,
  cva,
} from "@bsport/kaizen-primitive-core";

const typeSelectorCardVariants = cva("", {
  variants: {
    layout: {
      oneRow: "h-[225px]",
      twoRows: "",
    },
  },
  defaultVariants: {
    layout: "twoRows",
  },
});

const typeSelectorCardContentVariants = cva("flex flex-col", {
  variants: {
    layout: {
      oneRow: "h-full items-center justify-center gap-sm text-center",
      twoRows: "gap-xs",
    },
  },
  defaultVariants: {
    layout: "twoRows",
  },
});

const typeSelectorCardHeaderVariants = cva("flex", {
  variants: {
    layout: {
      oneRow: "flex-col items-center justify-center gap-xs",
      twoRows: "flex-row flex-wrap items-center gap-xs",
    },
  },
  defaultVariants: {
    layout: "twoRows",
  },
});

const typeSelectorCardDescriptionVariants = cva("", {
  variants: {
    layout: {
      oneRow: "text-center",
      twoRows: "",
    },
  },
  defaultVariants: {
    layout: "twoRows",
  },
});

type TypeSelectorCardProps = {
  title: string;
  description: string;
  icon: IconName;
  chipLabel?: string;
  onClick?: () => void;
} & VariantProps<typeof typeSelectorCardVariants>;

export const TypeSelectorCard = ({
  title,
  description,
  icon,
  chipLabel,
  onClick,
  layout,
}: TypeSelectorCardProps) => {
  const descriptionSize = layout === "oneRow" ? "sm" : "md";

  return (
    <Card
      actionable={Boolean(onClick)}
      padding="default"
      elevated
      onClick={onClick}
      className={typeSelectorCardVariants({ layout })}
    >
      <div className={typeSelectorCardContentVariants({ layout })}>
        <div className={typeSelectorCardHeaderVariants({ layout })}>
          <span className="text-onsurface-weak">
            <Icon icon={icon} size="md" />
          </span>
          <Title htmlVariant="h4" weight="strong" color="weak">
            {title}
          </Title>
          {chipLabel ? (
            <Chip type="weak" color="main" size="sm" label={chipLabel} />
          ) : null}
        </div>
        <Body
          htmlVariant="p"
          size={descriptionSize}
          weight="weak"
          color="weak"
          className={typeSelectorCardDescriptionVariants({ layout })}
        >
          {description}
        </Body>
      </div>
    </Card>
  );
};
