import { useEffect, useRef, useState } from 'react';

const useIsTextExpandable = (showMore: boolean) => {
  const [isTextExpandable, setIsTextExpandable] = useState<boolean>(true);

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTextExpandable(
      showMore ||
        textRef?.current?.scrollHeight > textRef?.current?.clientHeight,
    );
  }, [
    showMore,
    textRef?.current?.scrollHeight,
    textRef?.current?.clientHeight,
  ]);

  const hookResult = {
    ref: textRef,
    isExpandable: isTextExpandable,
  };

  return hookResult;
};

export default useIsTextExpandable;
