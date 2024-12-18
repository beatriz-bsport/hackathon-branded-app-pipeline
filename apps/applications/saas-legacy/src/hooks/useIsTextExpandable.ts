import { useEffect, useRef, useState } from 'react';

const useIsTextExpandable = (showMore: boolean) => {
  const [isTextExpandable, setIsTextExpandable] = useState<boolean>(true);

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTextExpandable(
      showMore ||
        textRef?.current?.scrollHeight > textRef?.current?.clientHeight,
    );
    // scroll back to the top when shrinking
    if (!showMore) {
      textRef?.current?.scrollTo?.(0, 0);
    }
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
