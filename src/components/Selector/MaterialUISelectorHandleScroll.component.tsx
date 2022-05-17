import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { InputActionTypes } from 'react-select';

import MaterialUISelector, {
  MuiSelectProps,
  OptionTypeBase,
} from './MaterialUISelector.component';

type Props<T extends OptionTypeBase> = {
  fetch: (page: number, text: string) => void;
  isLoading: boolean;
  nextPage: number | null;
} & MuiSelectProps<T>;

const MaterialUISelectorHandleScroll: React.FC<Props<OptionTypeBase>> = ({
  isLoading,
  nextPage,
  fetch,
  ...selectorProps
}) => {
  const [pageAll, setPageAll] = useState(1);
  const [pageFiltered, setPageFiltered] = useState(1);
  const [searchText, setSearchText] = useState('');

  const debouncedInputChange = React.useMemo(
    () =>
      debounce((text: string) => {
        setSearchText(text);
        setPageFiltered(1);
        fetch(1, text);
      }, 500),
    [fetch],
  );

  const handleEndReach = useCallback(() => {
    if (isLoading) return;
    if (!nextPage) return;
    const newPage = searchText ? pageFiltered + 1 : pageAll + 1;
    fetch(newPage, searchText);

    if (searchText) {
      setPageFiltered(newPage);
      return;
    }

    setPageAll(newPage);
  }, [fetch, isLoading, nextPage, pageAll, pageFiltered, searchText]);

  const handleInputChange = useCallback(
    (value: string, meta: { action: InputActionTypes }) => {
      if (isLoading) return value;
      if (meta.action !== 'input-change') return value;
      if (searchText !== value) {
        debouncedInputChange(value);
      }
      return value;
    },
    [debouncedInputChange, searchText, isLoading],
  );

  return (
    <MaterialUISelector
      backspaceRemovesValue={false}
      onEndMenuListReach={handleEndReach}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      withoutSelectAll
      {...selectorProps}
    />
  );
};

export default MaterialUISelectorHandleScroll;
