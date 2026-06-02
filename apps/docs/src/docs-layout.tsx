import { Outlet } from "react-router-dom";

import { Header } from "#src/components/layout/header";
import { Sidebar } from "#src/components/layout/sidebar";
import { TableOfContents } from "#src/components/layout/table-of-contents";
import nav from "#src/lib/generated/nav.json";
import type { TopTab } from "#src/lib/nav";
import { Providers } from "#src/src/providers";

const topTabs = nav.topTabs as TopTab[];

export function DocsLayout() {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header topTabs={topTabs} />
        <div
          className={[
            "mx-auto grid w-full max-w-screen-2xl flex-1 gap-8 px-4 py-8 md:px-6",
            "grid-cols-1",
            "md:grid-cols-[14rem_minmax(0,1fr)]",
            "lg:grid-cols-[15rem_minmax(0,1fr)_13rem]",
          ].join(" ")}
        >
          <Sidebar topTabs={topTabs} />
          <main className="min-w-0">
            <Outlet />
          </main>
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <TableOfContents />
            </div>
          </div>
        </div>
      </div>
    </Providers>
  );
}
