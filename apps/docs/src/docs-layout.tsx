import { Outlet } from "react-router-dom";

import { DocsMainScrollAnchors } from "#src/components/layout/docs-main-scroll-anchors";
import { Header } from "#src/components/layout/header";
import { Sidebar } from "#src/components/layout/sidebar";
import { TableOfContents } from "#src/components/layout/table-of-contents";
import nav from "#src/lib/generated/nav.json";
import type { TopTab } from "#src/lib/nav";

const topTabs = nav.topTabs as TopTab[];

export function DocsLayout() {
  return (
    <div className="docs-shell flex flex-col">
      <Header topTabs={topTabs} />
      <div className="docs-body">
        <Sidebar topTabs={topTabs} />
        <div data-docs-main-scroll className="docs-main-scroll">
          <DocsMainScrollAnchors />
          <div className="docs-content-stage">
            <div className="docs-content-main">
              <Outlet />
            </div>
            <aside className="docs-toc-rail">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
