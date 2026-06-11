import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getDocsMainScrollRoot } from "#src/lib/docs-scroll-root";

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  if (!hash.startsWith("#") || hash.length < 2) return;

  const main = getDocsMainScrollRoot();
  const target = document.getElementById(hash.slice(1));
  if (!main || !target || !main.contains(target)) return;

  target.scrollIntoView({ behavior, block: "start" });
}

export function DocsMainScrollAnchors() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href");
      if (!href?.startsWith("#") || href.length < 2) return;

      const main = getDocsMainScrollRoot();
      const target = document.getElementById(href.slice(1));
      if (!main || !target || !main.contains(target)) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!hash) return;

    const timer = window.setTimeout(() => {
      scrollToHash(hash, "auto");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
