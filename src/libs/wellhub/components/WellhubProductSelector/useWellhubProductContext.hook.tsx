import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWellhubProducts } from '#src/libs/wellhub/api';
import type { ProductsByWellhubGymUuid } from '#src/libs/wellhub/types';

type WellhubProductContextType = {
  productsByWellhubGymUuid: ProductsByWellhubGymUuid;
  isLoading: boolean;
};

type WellhubProductProviderProps = {
  children: React.ReactNode;
};

// Default Context Value
const WellhubProductContext = createContext<WellhubProductContextType>({
  productsByWellhubGymUuid: {},
  isLoading: false,
});

// Context Provider Component
export const WellhubProductProvider: React.FC<WellhubProductProviderProps> = ({
  children,
}) => {
  const [productsByWellhubGymUuid, setProductsByWellhubGymUuid] =
    useState<ProductsByWellhubGymUuid>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the products by Wellhu Gym on initialization
  useEffect(() => {
    const fetchWellhubProduct = async () => {
      const response = await fetchWellhubProducts();
      const result = response?.data?.products_by_wellhub_gym || {};
      setProductsByWellhubGymUuid(result);
      setIsLoading(false);
    };

    fetchWellhubProduct();
  }, []);

  return (
    <WellhubProductContext.Provider
      value={{ productsByWellhubGymUuid, isLoading }}
    >
      {children}
    </WellhubProductContext.Provider>
  );
};

// Custom Hook to Access Wellhub Product Context
export const useWellhubProduct = () => {
  return useContext(WellhubProductContext);
};
