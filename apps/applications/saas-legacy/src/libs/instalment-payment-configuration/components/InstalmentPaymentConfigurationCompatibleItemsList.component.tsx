import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme, Typography } from '@material-ui/core';

type Props = {
  isAvailableOnAll: boolean;
  allItemList: Array<any>;
  itemList: Array<any>;
  title: string;
};

export const InstalmentPaymentConfigurationCompatibleItemsList: React.FC<
  Props
> = ({ itemList, allItemList, isAvailableOnAll, title }) => {
  const classes = useStyles();

  return (
    <>
      {(!!itemList?.length || isAvailableOnAll) && (
        <div className={classes.column}>
          <Typography className={classes.typo} variant="h6">
            {title}
          </Typography>
          {isAvailableOnAll
            ? allItemList.map((item) => <Typography>{item?.name}</Typography>)
            : itemList.map((item) => <Typography>{item?.name}</Typography>)}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  typo: {
    marginBottom: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default React.memo(InstalmentPaymentConfigurationCompatibleItemsList);
