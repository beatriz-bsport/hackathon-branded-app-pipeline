import { useEffect, useState, useCallback } from "react";
import { ListLayout } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import { MemberTable } from "#src/components/MemberTable";
import { fetchMemberListPage, type Member } from "#src/store-api-pkg";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ shouldReplace: false });

  // For test purpose, it will be refacto when implementing the final store pkg
  const fetchMemberPageList = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchMemberListPage({
      page_size: currentPageSize,
      page: currentPage,
      exclude_archived: true,
    });
    setMemberList(data.results);
    setTotalItems(data.count);
    setIsLoading(false);
  }, [currentPage, currentPageSize]);

  useEffect(() => {
    fetchMemberPageList();
  }, [fetchMemberPageList]);

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pages.memberList")} />
      <ListLayout.Content className="hide-scrollbar h-full">
        <MemberTable
          memberList={memberList}
          isLoading={isLoading}
          paginationProps={{
            currentPage: currentPage,
            rowsPerPage: currentPageSize,
            totalItems: totalItems,
            onPageSettingsChange: setPageSettings,
            showRowsPerPageSelector: true,
          }}
          mode="active"
          handleArchive={({ memberId, memberName }) =>
            console.log(`Handle archive ${memberName} (${memberId})`)
          }
          handleRestore={({ memberId, memberName }) =>
            console.log(`Handle restore ${memberName} (${memberId})`)
          }
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
