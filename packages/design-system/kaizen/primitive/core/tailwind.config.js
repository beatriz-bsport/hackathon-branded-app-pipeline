import THEME from "@bsport/kaizen-tokens/src/tailwind.theme.json";

/** @type {import("tailwindcss").Config} */
export default {
  // Do not edit theme directly as it is auto-generated from tokens
  theme: {
    ...THEME,
    extend: {
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
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
};
