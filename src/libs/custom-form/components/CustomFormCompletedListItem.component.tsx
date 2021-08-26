import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { MaterialStyleType } from '../../../utils/types';
import type { CustomFormFilled } from '../types';

type OwnProps = {
  onClick: (id: number) => void;
  customFormFilled: CustomFormFilled;
};
type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;
export const CustomFormFilledListItem = (props: Props) => {
  const { classes } = props;
  return (
    <ListItem
      divider
      button
      selected={props.selected}
      onClick={() => props.onClick(props.customFormFilled.id)}
    >
      <div className={classes.fullwidth}>
        <Typography>{props.customFormFilled?.customFormData?.name}</Typography>
      </div>
      <div className={classes.flexFullWidth}>
        <Typography>{props.customFormFilled?.date_created}</Typography>
      </div>
    </ListItem>
  );
};
const styles = () => ({
  flexFullWidth: {
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  fullwidth: {
    width: '100%',
  },
});
export default compose<any, OwnProps>(withStyles(styles))(
  CustomFormFilledListItem,
);
