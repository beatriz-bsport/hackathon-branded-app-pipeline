import { useEffect, useMemo, useState } from "react";

import { Button, List, ListLayout } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { Loading } from "#src/components/Loading";
import { useTranslation } from "#src/utils/i18n";

type Smartlist = {
  id: number;
  name: string;
  company: number;
  description: string;
  member_base: number;
  has_active_communication_group_configs: boolean;
};

const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_PAGE = 1;

const ListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      defaultValues: { page: DEFAULT_PAGE, page_size: DEFAULT_ROWS_PER_PAGE },
      shouldReplace: false,
    });

  const [searchTerm, setSearchTerm] = useState("");

  const {
    pagedData: smartlists,
    isLoading,
    totalItems,
  } = useSmartlists({
    page: currentPage,
    rowsPerPage: currentPageSize,
    searchTerm,
  });

  const isEmpty = smartlists.length === 0 && searchTerm.trim().length === 0;
  const isEmptySearch = searchTerm.trim().length > 0 && smartlists.length === 0;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("title")}
        callToActionButton={
          <Button
            color="main"
            size="md"
            intent="call-to-action"
            label={t("addSmartlist")}
          />
        }
        searchConfig={{
          id: "smartlists-search",
          inputValue: searchTerm,
          onInputValueChange: handleSearchChange,
          onClear: handleSearchClear,
        }}
      />
      <ListLayout.Content>
        {isLoading ? (
          <Loading />
        ) : (
          <List
            id="smartlists-list"
            className="w-full"
            items={smartlists.map((smartlist: Smartlist) => ({
              id: smartlist.id.toString(),
              title: smartlist.name,
              buttons: [
                {
                  color: "default",
                  size: "md",
                  intent: "flat",
                  iconLeft: "edit-02",
                },
                {
                  color: "default",
                  size: "md",
                  intent: "flat",
                  iconLeft: "copy-03",
                },
                {
                  color: "default",
                  size: "md",
                  intent: "flat",
                  iconLeft: "trash-01",
                },
              ],
            }))}
            paginationProps={{
              currentPage,
              totalItems,
              rowsPerPage: currentPageSize,
              onPageChange: (page: number) =>
                setPageSettings(page, currentPageSize),
              onPageSettingsChange: setPageSettings,
              showRowsPerPageSelector: true,
            }}
            emptyStateProps={{
              emptyConfig: {
                ctaButtonConfig: {
                  iconLeft: "plus",
                  label: t("addSmartlist"),
                  color: "main",
                  size: "md",
                  intent: "call-to-action",
                },
                subtitle: t("emptyState.subtitle"),
                title: t("emptyState.title"),
              },
              emptySearchConfig: {
                secondaryButtonConfig: {
                  iconLeft: "x",
                  label: t("emptySearch.clearFilters"),
                  color: "default",
                  size: "md",
                  intent: "flat",
                  onClick: handleSearchClear,
                },
                subtitle: t("emptySearch.subtitle"),
                title: t("emptySearch.title"),
              },
              isEmpty,
              isEmptySearch,
            }}
          />
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;

// ----- Mock data -----
const SMARTLISTS: Smartlist[] = [
  {
    id: 140,
    name: "This is a really long smartlisy name that should be tyruncated bevcasue og the woçdyj",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 135,
    name: "to be deletedddd",
    company: 2,
    description: "",
    member_base: 2,
    has_active_communication_group_configs: false,
  },
  {
    id: 144,
    name: "Intro offer (1)",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 145,
    name: "New To test",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 146,
    name: "test Brice",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 107,
    name: "tz",
    company: 2,
    description: "Z",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 109,
    name: "aaa",
    company: 2,
    description: "aaa",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 82,
    name: "CADENCIA 1 - TAG 1- 2",
    company: 2,
    description: "azeer",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 83,
    name: "CADENCIA 1 - TAG 1 - 3",
    company: 2,
    description: "qzerqsd",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 84,
    name: "CADENCIA 1 - TAG STEP 1",
    company: 2,
    description: "zaerzer",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 85,
    name: "CADENCIA 1 - TAG STEP 2",
    company: 2,
    description: "zerzer",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 86,
    name: "CADENCIA 1 - TAG STEP 3",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 87,
    name: "Date filter",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 94,
    name: "Todos",
    company: 2,
    description: "description",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 95,
    name: "General report testing",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 97,
    name: "2 sessions reward",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 98,
    name: "5 sessions reward",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 99,
    name: "10 sessions reward",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 100,
    name: "3 sessions reward",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 111,
    name: "testnewfilters",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 112,
    name: "New members",
    company: 2,
    description: "x",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 113,
    name: "Intro offer",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 114,
    name: "Full offers",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 115,
    name: "test unticked mail (1)",
    company: 2,
    description: "ccz",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 116,
    name: "Luxonnn",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 117,
    name: "Only man",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 122,
    name: "test comm",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 124,
    name: "j",
    company: 2,
    description: "j",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 110,
    name: "test bookings",
    company: 2,
    description: "",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 130,
    name: "qfd",
    company: 2,
    description: "wsdqfdssqfd",
    member_base: 1,
    has_active_communication_group_configs: false,
  },
  {
    id: 106,
    name: "Scheduled message 2",
    company: 2,
    description: "",
    member_base: 2,
    has_active_communication_group_configs: false,
  },
  {
    id: 133,
    name: "BS-4777",
    company: 2,
    description: "777 is a jackpot",
    member_base: 0,
    has_active_communication_group_configs: false,
  },
];

type SmartlistsParams = {
  page?: number;
  rowsPerPage?: number;
  searchTerm?: string;
};

// this is only used for prototyping real data will come in upcoming MR
function useSmartlists(params?: SmartlistsParams): {
  data: Smartlist[];
  pagedData: Smartlist[];
  isLoading: boolean;
  totalItems: number;
} {
  // simulate api call with a set timeout
  const [smartlists, setSmartlists] = useState<Smartlist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const page = params?.page || DEFAULT_PAGE;
  const rowsPerPage = params?.rowsPerPage || DEFAULT_ROWS_PER_PAGE;

  // Fetch data
  useEffect(() => {
    setTimeout(() => {
      setSmartlists(SMARTLISTS);
      setIsLoading(false);
    }, 2000);
  }, []);

  // Filter data based on search term
  const filteredSmartlists = useMemo(() => {
    if (!params?.searchTerm) return smartlists;

    const searchTermLower = params.searchTerm.toLowerCase();
    return smartlists.filter(
      (smartlist) =>
        smartlist.name.toLowerCase().includes(searchTermLower) ||
        smartlist.description.toLowerCase().includes(searchTermLower),
    );
  }, [smartlists, params?.searchTerm]);

  // Get paged data based on current page and rows per page
  const getPagedSmartlists = (page: number, itemsPerPage: number) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredSmartlists.slice(start, end);
  };

  // Calculate paged data based on provided parameters
  const pagedData = useMemo(() => {
    if (isLoading || filteredSmartlists.length === 0) {
      return [];
    }
    return getPagedSmartlists(page, rowsPerPage);
  }, [filteredSmartlists, page, rowsPerPage, isLoading]);

  return {
    data: filteredSmartlists,
    pagedData,
    isLoading,
    totalItems: filteredSmartlists.length,
  };
}
