// @ts-nocheck
import React from 'react';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChipDisplay.component';

// TODO PROPER TYPING
type Props = {
  datatype: any;
  value: number;
  translation: string;
  extra_data: any;
};

export const ReportComparisonChip = (props: Props) => {
  const { datatype, value, translation, extra_data } = props;
  let icon = null;
  let color = 'grey';

  if (datatype === 'available_credits') {
    const totalCredits = extra_data.total_credits;
    if (value === 0) {
      color = 'green';
      icon = 'check';
    } else if (value === totalCredits) {
      color = 'red';
      icon = 'cross';
    } else {
      color = 'orange';
      icon = 'exclamation';
    }
  }

  if (datatype === 'amortized_price') {
    const price = extra_data.price;
    if (value === 0) {
      color = 'green';
      icon = 'check';
    } else if (value === price) {
      color = 'red';
      icon = 'cross';
    } else {
      color = 'orange';
      icon = 'exclamation';
    }
  }

  return <ReportChipDisplay color={color} icon={icon} value={translation} />;
};

export default ReportComparisonChip;
