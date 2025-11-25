import plugin from "tailwindcss/plugin";

import THEME from "@bsport/kaizen-tokens/src/tailwind.theme.json";

/** @type {import("tailwindcss").Config} */
export default {
  // Do not edit theme directly as it is auto-generated from tokens
  theme: {
    ...THEME,
    extend: {
      height: {
        "layout-mobile-header": "var(--kz-topbar-height)",
        "layout-content-mobile": "calc(100vh - var(--kz-topbar-height))",
        "layout-content-desktop": "100vh",
      },
      width: {
        "layout-sidebar": "var(--kz-sidebar-width)",
      },
      spacing: {
        "layout-mobile-sidebar-offset": "var(--kz-topbar-height)",
      },
      keyframes: {
        "slide-in-right": {
          from: {
            transform: "translateX(100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "slide-out-right": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(100%)",
          },
        },
        "slide-in-left": {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "slide-out-left": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
        "slide-in-bottom": {
          from: {
            transform: "translateY(100%)",
          },
          to: {
            transform: "translateY(0%)",
          },
        },
        "slide-out-bottom": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(100%)",
          },
        },
      },
      animation: {
        "slide-in-bottom": "slide-in-bottom 0.3s ease-in-out",
        "slide-out-bottom": "slide-out-bottom 0.3s ease-in-out",
        "slide-in-right": "slide-in-right 0.3s ease-in-out",
        "slide-out-right": "slide-out-right 0.3s ease-in-out",
        "slide-in-left": "slide-in-left 0.3s ease-in-out forwards",
        "slide-out-left": "slide-out-left 0.3s ease-in-out forwards",
      },
    },
  },
  content: [
    "../primitive/core/src/**/*.{js,ts,jsx,tsx}",
    "../business-components/**/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "selector",
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": {
          "--kz-topbar-height": "56px",
          "--kz-sidebar-width": "240px",
        },
      });
    }),
  ],
};
