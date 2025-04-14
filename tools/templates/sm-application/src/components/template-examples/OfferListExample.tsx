import { useEffect, useState } from "react";

import { buildUrlParams } from "@bsport/fetch";
import { List } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import fetch from "#src/utils/fetch";

type OfferMinimal = {
  id: number | undefined;
  activity: number | undefined;
};

const OfferListExample: React.FC = () => {
  const [offers, setOffers] = useState<OfferMinimal[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  useEffect(() => {
    const urlParams = buildUrlParams({
      company: "2", // Set the dev API to see data
      min_date: "2025-01-01",
      max_date: "2025-01-30",
      available: "true",
      page: currentPage,
      page_size: currentPageSize,
    });
    const getPaginatedOffers = async () => {
      try {
        const { data } = await fetch(`api/v1/offer/${urlParams}`);
        // @ts-expect-error Need to type data
        const { results, count } = data;
        setOffers(
          results?.map((item: OfferMinimal) => {
            return { id: item?.id, activity: item?.activity };
          }),
        );
        setTotalItems(count);
      } catch (error) {
        console.error(error);
      }
    };
    getPaginatedOffers();
  }, [currentPage, currentPageSize]);

  if (!offers?.length) {
    return null;
  }

  return (
    <div className="flex flex-row p-md gap-md flex-wrap w-full">
      <List
        id="offer-list"
        items={offers.map((item) => ({
          id: `offer-${item.id}`,
          title: `Offer n°${item.id}`,
        }))}
        className="w-full"
        paginationProps={{
          currentPage,
          rowsPerPage: currentPageSize,
          onPageSettingsChange: setPageSettings,
          totalItems: totalItems,
          showRowsPerPageSelector: true,
        }}
      />
    </div>
  );
};

export default OfferListExample;
