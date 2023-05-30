import React from 'react';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

// typing to confirm
type Props = {
  color: string;
  icon: any;
  translation: string;
};

// may have to adapt code according to icon type

export const ReportTagChip = (props: Props) => {
  const { translation, color, icon } = props;
  return (
    <ReportChipDisplay mainColor={color} icon={icon} value={translation} />
  );
};

export default React.memo(ReportTagChip);
