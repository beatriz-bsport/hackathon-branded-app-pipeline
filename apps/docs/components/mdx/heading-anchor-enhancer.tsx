import { useEffect } from "react";

import {
  CHECK_ICON,
  LINK_ICON,
  svgHtml,
} from "#src/lib/heading-anchor-icons.js";

const COPY_FEEDBACK_MS = 2000;

function setAnchorIcon(anchor: HTMLAnchorElement, icon: "link" | "check") {
  const iconHost =
    anchor.querySelector<HTMLElement>(".heading-anchor-icon") ?? anchor;

  iconHost.innerHTML =
    icon === "link" ? svgHtml(LINK_ICON) : svgHtml(CHECK_ICON);
}

export function HeadingAnchorEnhancer() {
  useEffect(() => {
    const proseRoot = document.querySelector(".prose-doc-body");
    if (!proseRoot) return;

    const timers = new Map<HTMLAnchorElement, ReturnType<typeof setTimeout>>();

    function enhanceAnchor(anchor: HTMLAnchorElement) {
      if (anchor.dataset.enhanced === "true") return;
      anchor.dataset.enhanced = "true";

      if (!anchor.querySelector(".heading-anchor-svg")) {
        setAnchorIcon(anchor, "link");
      }

      anchor.addEventListener("click", (event) => {
        event.preventDefault();

        const hash = anchor.getAttribute("href");
        if (!hash?.startsWith("#")) return;

        const url = `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`;

        void navigator.clipboard.writeText(url).then(
          () => {
            anchor.classList.add("is-copied");
            anchor.setAttribute("aria-label", "Link copied");
            setAnchorIcon(anchor, "check");

            const existing = timers.get(anchor);
            if (existing) clearTimeout(existing);

            const timer = setTimeout(() => {
              anchor.classList.remove("is-copied");
              anchor.setAttribute("aria-label", "Copy link to section");
              setAnchorIcon(anchor, "link");
              timers.delete(anchor);
            }, COPY_FEEDBACK_MS);

            timers.set(anchor, timer);
          },
          () => {
            window.location.hash = hash;
          },
        );
      });
    }

    proseRoot
      .querySelectorAll<HTMLAnchorElement>("a.heading-anchor")
      .forEach(enhanceAnchor);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          if (node.matches("a.heading-anchor")) {
            enhanceAnchor(node);
          }

          node
            .querySelectorAll<HTMLAnchorElement>("a.heading-anchor")
            .forEach(enhanceAnchor);
        });
      }
    });

    observer.observe(proseRoot, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return null;
}
