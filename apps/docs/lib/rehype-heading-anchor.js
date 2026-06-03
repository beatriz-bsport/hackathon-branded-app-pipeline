import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { LINK_ICON, svgHast } from "./heading-anchor-icons.js";

/** Shared rehype plugins: slug ids + append-only anchor control (not wrap). */
export const rehypeHeadingAnchorPlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Copy link to section",
      },
      content: {
        type: "element",
        tagName: "span",
        properties: {
          className: ["heading-anchor-icon"],
          "aria-hidden": "true",
        },
        children: [svgHast(LINK_ICON)],
      },
    },
  ],
];
