import type { FC } from "react";
import { Outlet } from "react-router";

import { InboxLayout } from "#src/components/inbox-layout/inbox-layout";
import { ThreadList } from "#src/features/thread-list/thread-list";

/**
 * The `/threads` layout route: the thread list lives in the left rail and the
 * rest of the space is an `<Outlet />` for the routed content (the placeholder
 * today, the open conversation once `thread/:id/messages` lands). The outlet is
 * neither `InboxLayout.Header` nor `InboxLayout.DetailPane`, so `Content` drops
 * it into the body region.
 */
const ThreadsPage: FC = () => {
  return (
    <InboxLayout>
      <InboxLayout.ListPane>
        <ThreadList />
      </InboxLayout.ListPane>

      <InboxLayout.Content>
        <Outlet />
      </InboxLayout.Content>
    </InboxLayout>
  );
};

export default ThreadsPage;
