import { useMediaQuery, useTheme } from '@material-ui/core';
import { useEffect, useMemo, useState } from 'react';

const useNumberOfDayToShow = () => {
  const materialTheme = useTheme();
  const isXS = useMediaQuery(materialTheme.breakpoints.down('xs'));
  const isSM = useMediaQuery(materialTheme.breakpoints.down('sm'));
  const isMD = useMediaQuery(materialTheme.breakpoints.up('md'));

  const computeNumberOfDays = useMemo(() => {
    if (isMD) return 7;
    if (isSM && !isXS) return 4;
    return 3;
  }, [isMD, isSM, isXS]);

  const [numberOfDayToShow, setNumberOfDayToShow] =
    useState(computeNumberOfDays);

  useEffect(() => {
    setNumberOfDayToShow(computeNumberOfDays);
  }, [computeNumberOfDays]);

  return numberOfDayToShow;
};

export default useNumberOfDayToShow;
