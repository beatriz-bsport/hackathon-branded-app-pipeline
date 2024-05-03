import React, { ReactNode } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  MEMBER_PAGE_GRID_CONTAINER_SPACING,
  MEMBER_PAGE_GRID_ITEM_LG,
  MEMBER_PAGE_GRID_ITEM_XS,
} from './constants';

type Props = {
  leftChildren: ReactNode;
  rightChildren: ReactNode;
};

const FranchiseMemberPageLayout: React.FC<Props> = ({
  leftChildren,
  rightChildren,
}) => {
  return (
    <Grid
      container
      direction="row"
      spacing={MEMBER_PAGE_GRID_CONTAINER_SPACING}
    >
      <Grid item lg={MEMBER_PAGE_GRID_ITEM_LG} xs={MEMBER_PAGE_GRID_ITEM_XS}>
        {leftChildren}
      </Grid>
      <Grid item lg={MEMBER_PAGE_GRID_ITEM_LG} xs={MEMBER_PAGE_GRID_ITEM_XS}>
        {rightChildren}
      </Grid>
    </Grid>
  );
};

export default React.memo(FranchiseMemberPageLayout);
