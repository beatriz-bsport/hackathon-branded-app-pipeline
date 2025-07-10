import React, { createContext, useState, useContext } from 'react';

/**
 * Context for managing passes page data.
 *
 */
export const PassesContext = createContext<
  | {
      selectedCardId: number | null;
      setSelectedCardId: React.Dispatch<React.SetStateAction<number | null>>;
      selectedAppointmentCardId: number | null;
      setSelectedAppointmentCardId: React.Dispatch<
        React.SetStateAction<number | null>
      >;
      requestSignUp?: () => void;
    }
  | undefined
>(undefined);

export const PassesProvider: React.FC<{
  children: React.ReactNode;
  requestSignUp?: () => void;
}> = ({ children, requestSignUp }) => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedAppointmentCardId, setSelectedAppointmentCardId] = useState<
    number | null
  >(null);
  return (
    <PassesContext.Provider
      value={{
        selectedCardId,
        setSelectedCardId,
        selectedAppointmentCardId,
        setSelectedAppointmentCardId,
        requestSignUp,
      }}
    >
      {children}
    </PassesContext.Provider>
  );
};

/**
 * Custom hook to conveniently access the PassesContext values.
 *
 */
export const usePassesContext = () => {
  const context = useContext(PassesContext);
  if (!context) {
    throw new Error('usePassesContext must be used within a PassesProvider');
  }
  return context;
};
