import { Loader } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";

import { MemberDetailContent } from "./member-detail-content";

export type MemberDetailProps = {
  memberId: number;
};

export function MemberDetail({ memberId }: MemberDetailProps) {
  return (
    <QueryBoundary
      loadingFallback={
        <div className="flex h-full min-h-[480px] items-center justify-center p-md">
          <Loader size="lg" />
        </div>
      }
    >
      <MemberDetailContent memberId={memberId} />
    </QueryBoundary>
  );
}
