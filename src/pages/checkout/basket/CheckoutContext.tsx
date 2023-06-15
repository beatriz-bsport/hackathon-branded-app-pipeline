import { createContext } from 'react';

// By default we don't want to display the new checkout flow
export const CheckoutContext = createContext<boolean>(false);
