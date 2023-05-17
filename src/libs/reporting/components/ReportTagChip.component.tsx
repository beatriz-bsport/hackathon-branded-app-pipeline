// @ts-nocheck
import React from 'react';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChipDisplay.component';

// TODO PROPER TYPING
type Props = {
  color: string;
  icon: any;
  translation: string;
};

export const ReportTagChip = (props: Props) => {
  const { translation, color, icon } = props;
  return <ReportChipDisplay color={color} icon={icon} value={translation} />;
};

export default ReportTagChip;
