import React from 'react';
import { AlertColorEnum } from './constants';
import { AlertColor } from './types';
import {
  AlertCircle,
  AlertTriangle,
  AnnotationInfo,
  CheckCircle,
  InfoCircle,
} from '#components/untitledui';

/**
 * Retrieve the fallback icon associated to the current alert color
 * @param color The alert color theme
 */
export const useAlertDefaultLeftIcon = (color: AlertColor) => {
  switch (color) {
    case AlertColorEnum.INFO:
      return <AnnotationInfo stroke="currentColor" />;
    case AlertColorEnum.SUCCESS:
      return <CheckCircle stroke="currentColor" />;
    case AlertColorEnum.WARNING:
      return <AlertTriangle stroke="currentColor" />;
    case AlertColorEnum.ERROR:
      return <AlertCircle stroke="currentColor" />;
    default:
      return <InfoCircle stroke="currentColor" />;
  }
};
