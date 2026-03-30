import React, { createContext, useContext, useState, useEffect } from 'react';

import { getWellhubProductsByAccount } from '#src/libs/partnership/api';
import type { WellhubProduct } from '#src/libs/wellhub/types';

type ProductsByExternalId = Record<string, WellhubProduct[]>;

type PartnershipAccountProductContextType = {
  productsByExternalId: ProductsByExternalId;
  isLoading: boolean;
};

type PartnershipAccountProductProviderProps = {
  children: React.ReactNode;
};

const PartnershipAccountProductContext =
  createContext<PartnershipAccountProductContextType>({
    productsByExternalId: {},
    isLoading: false,
  });

export const PartnershipAccountProductProvider: React.FC<
  PartnershipAccountProductProviderProps
> = ({ children }) => {
  const [productsByExternalId, setProductsByExternalId] =
    useState<ProductsByExternalId>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getWellhubProductsByAccount();
      setProductsByExternalId(
        response?.data?.products_by_partnership_account ?? {},
      );
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <PartnershipAccountProductContext.Provider
      value={{ productsByExternalId, isLoading }}
    >
      {children}
    </PartnershipAccountProductContext.Provider>
  );
};

export const usePartnershipAccountProduct = () => {
  return useContext(PartnershipAccountProductContext);
};
