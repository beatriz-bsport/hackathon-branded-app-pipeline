/** @typedef {import('hast').Element} HastElement */
/** @typedef {import('hast').Properties} HastProperties */

/** Untitled UI link-01 (Kaizen `link-01` asset). */
export const LINK_ICON = {
  viewBox: "0 0 24 24",
  paths: [
    {
      d: "m12.708 18.364-1.415 1.414a5 5 0 1 1-7.07-7.07l1.413-1.415m12.728 1.414 1.415-1.414a5 5 0 0 0-7.071-7.071l-1.415 1.414M8.5 15.5l7-7",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  ],
};

/** Untitled UI check (Kaizen `check` asset). */
export const CHECK_ICON = {
  viewBox: "0 0 24 24",
  paths: [
    {
      d: "M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd",
    },
  ],
};

/**
 * @param {{ viewBox: string, paths: HastProperties[] }} icon
 * @returns {HastElement}
 */
export function svgHast(icon) {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      className: ["heading-anchor-svg"],
      viewBox: icon.viewBox,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ariaHidden: "true",
    },
    children: icon.paths.map((pathProperties) => ({
      type: "element",
      tagName: "path",
      properties: pathProperties,
      children: [],
    })),
  };
}

/**
 * @param {{ viewBox: string, paths: Record<string, string>[] }} icon
 * @returns {string}
 */
export function svgHtml(icon) {
  const pathMarkup = icon.paths
    .map((pathProperties) => {
      const attrs = Object.entries(pathProperties)
        .map(([key, value]) => {
          const attr = key.replace(
            /[A-Z]/g,
            (char) => `-${char.toLowerCase()}`,
          );
          return `${attr}="${value}"`;
        })
        .join(" ");

      return `<path ${attrs}/>`;
    })
    .join("");

  return `<svg class="heading-anchor-svg" viewBox="${icon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${pathMarkup}</svg>`;
}
