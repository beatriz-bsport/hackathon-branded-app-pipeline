/**
 * Fallback descriptions for semantic color tokens when none are authored in docs.
 */
export function inferColorTokenDescription(path) {
  if (!path.startsWith("color.")) return undefined;

  const name = path.slice("color.".length);
  if (name === "test") return undefined;

  if (name.startsWith("shadow-")) {
    if (name === "shadow-weak") {
      return "Subtle shadow colour used for elevation and depth.";
    }
    if (name === "shadow-strong") {
      return "Strong shadow colour used for elevated surfaces and overlays.";
    }
    if (name === "shadow-action-brand-selected") {
      return "Shadow colour for selected brand actions.";
    }
    if (name === "shadow-action-default-selected") {
      return "Shadow colour for selected default actions.";
    }

    const actionState = name.match(
      /^shadow-action-default-(rest|hovered|pressed)$/,
    );
    if (actionState) {
      const stateLabel = {
        rest: "resting",
        hovered: "hovered",
        pressed: "pressed",
      }[actionState[1]];
      return `Shadow colour for default actions in ${stateLabel} state.`;
    }
  }

  if (name.startsWith("stroke-")) {
    if (name === "stroke-main") {
      return "Primary brand border colour.";
    }
    if (name === "stroke-strong") {
      return "Strong border colour for emphasis and separation.";
    }
    if (name === "stroke-weak") {
      return "Subtle border colour for minimal separation.";
    }
    if (name === "stroke-divider") {
      return "Border colour for dividers between content sections.";
    }
    if (name === "stroke-action-main-selected") {
      return "Border colour for selected primary actions.";
    }

    const status = name.match(
      /^stroke-status-(info|positive|warning|critical)$/,
    );
    if (status) {
      const labels = {
        info: "informational",
        positive: "success",
        warning: "warning",
        critical: "critical",
      };
      return `Border colour indicating ${labels[status[1]]} status.`;
    }

    const actionState = name.match(
      /^stroke-action-default-(rest|hovered|pressed)$/,
    );
    if (actionState) {
      const stateLabel = {
        rest: "resting",
        hovered: "hovered",
        pressed: "pressed",
      }[actionState[1]];
      return `Border colour for default actions in ${stateLabel} state.`;
    }
  }

  if (name === "onsurface-action-main-selected") {
    return "Colour of elements on selected primary actions.";
  }

  return undefined;
}
