import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
} from 'react';

type ClickAwayContextType = {
  clickAwayEnabled: boolean;
  setIsClickAwayEnabled: Dispatch<SetStateAction<boolean>>;
};

export const ClickAwayContext = createContext<ClickAwayContextType>({
  clickAwayEnabled: true,
  setIsClickAwayEnabled: () => {},
});

type Props = { children?: ReactNode | undefined };

const ClickAwayContextProvider: React.FC<Props> = ({ children }) => {
  const [clickAwayEnabled, setIsClickAwayEnabled] = React.useState(true);
  return (
    <ClickAwayContext.Provider
      value={{ clickAwayEnabled, setIsClickAwayEnabled }}
    >
      {children}
    </ClickAwayContext.Provider>
  );
};

export default ClickAwayContextProvider;
