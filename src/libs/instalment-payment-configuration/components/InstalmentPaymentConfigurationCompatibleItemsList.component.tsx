import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme, Typography } from '@material-ui/core';

type OwnProps = {
  isAvailableOnAll: boolean;
  allItemList: Array<any>;
  itemList: Array<any>;
  title: string;
};
type Props = OwnProps;
export const InstalmentPaymentCompatibleItemsList: React.FC<Props> = (
  props,
) => {
  const classes = useStyles();
  const { itemList, allItemList, isAvailableOnAll, title } = props;
  return (
    <>
      {(!!itemList?.length || isAvailableOnAll) && (
        <div className={classes.column}>
          <Typography variant="h6" className={classes.typo}>
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
export default InstalmentPaymentCompatibleItemsList;
