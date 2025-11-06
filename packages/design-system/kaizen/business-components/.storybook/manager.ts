import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

const env = process.env.STORYBOOK_ENV || "local";
const sha = process.env.STORYBOOK_COMMIT_SHORT_SHA || "local";

const insertEnvBadge = () => {
  if (document.getElementById("sb-env-badge")) return;

  const badge = document.createElement("div");
  badge.id = "sb-env-badge";
  badge.innerText = `${env} – ${sha}`;
  Object.assign(badge.style, {
    position: "fixed",
    bottom: "8px",
    right: "8px",
    padding: "4px 8px",
    backgroundColor: "#333",
    color: "#fff",
    fontSize: "12px",
    borderRadius: "4px",
    fontFamily: "monospace",
    opacity: "0.75",
    zIndex: "9999",
    pointerEvents: "none",
  });
  document.body.appendChild(badge);
};

// Wait for DOM load
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", insertEnvBadge);
}

addons.setConfig({
  panelPosition: "right",
  theme: create({
    base: "light",
    brandTitle: "bsport - Kaizen Business Components",
    brandImage:
      "https://cdn.prod.website-files.com/6673de6d7fabfe3267680fc3/66e463f20336dbfc14e5bc18_logo_icon_for%20website.png",
    brandTarget: "_self",
  }),
});
