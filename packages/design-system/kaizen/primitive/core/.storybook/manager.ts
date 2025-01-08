import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

addons.setConfig({
  panelPosition: "right",
  theme: create({
    base: "light",
    brandTitle: "bsport - Kaizen UI",
    brandImage:
      "https://pro.bsport.io/_next/image/?url=%2Flogo_bsport_color.svg&w=1920&q=75",
    brandTarget: "_self",
  }),
});
