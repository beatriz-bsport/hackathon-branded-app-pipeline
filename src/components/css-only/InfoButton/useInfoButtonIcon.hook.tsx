import React from 'react';
import { AlertCircle, AlertTriangle, InfoCircle } from '#components/untitledui';
import { InfoButtonSeverityEnum } from '#csscomponents/InfoButton/constants';
import type { InfoButtonSeverityType } from '#csscomponents/InfoButton/types';

/**
 * Retrieve the icon associated to the current Info Button severity
 * @param severity The Info Button severity
 */
const useInfoButtonIcon = (severity: InfoButtonSeverityType) => {
  switch (severity) {
    case InfoButtonSeverityEnum.WARNING:
      return <AlertTriangle stroke="currentColor" />;
    case InfoButtonSeverityEnum.ERROR:
      return <AlertCircle stroke="currentColor" />;
    default:
      return <InfoCircle stroke="currentColor" />;
  }
};

export default useInfoButtonIcon;
