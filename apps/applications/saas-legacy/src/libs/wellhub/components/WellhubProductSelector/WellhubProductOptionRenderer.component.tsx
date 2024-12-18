import React from 'react';
import { Typography } from '@material-ui/core';

import type { WellhubProductId } from '#src/libs/wellhub/types';

type Props = {
  productId: WellhubProductId;
  productName: string;
};

const WellhubProductOptionRenderer: React.FC<Props> = ({
  productName,
  productId,
}) => {
  return (
    <Typography variant="body2">
      {productId} - {productName}
    </Typography>
  );
};

export default React.memo(WellhubProductOptionRenderer);
